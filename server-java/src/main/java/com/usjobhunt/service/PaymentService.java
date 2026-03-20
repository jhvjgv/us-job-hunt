package com.usjobhunt.service;

import com.usjobhunt.dto.PaymentRequest;
import com.usjobhunt.dto.PaymentResponse;
import com.usjobhunt.dto.PricingPlan;
import com.usjobhunt.entity.LocalUser;
import com.usjobhunt.entity.Order;
import com.usjobhunt.repository.LocalUserRepository;
import com.usjobhunt.repository.OrderRepository;
import com.usjobhunt.util.AlipayUtil;
import com.usjobhunt.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {
    
    private final OrderRepository orderRepository;
    private final LocalUserRepository userRepository;
    private final AlipayUtil alipayUtil;
    private final MembershipService membershipService;
    
    @Value("${alipay.app-id:}")
    private String alipayAppId;
    
    private static final Map<String, PricingPlan> PRICING_PLANS = new LinkedHashMap<>();
    
    static {
        PRICING_PLANS.put("starter", PricingPlan.builder()
            .id("starter")
            .name("Starter")
            .price(new BigDecimal("99"))
            .description("基础求职辅导")
            .features(Arrays.asList(
                "简历优化 1 次",
                "模拟面试 2 次",
                "求职资源库访问"
            ))
            .build());
        
        PRICING_PLANS.put("pro", PricingPlan.builder()
            .id("pro")
            .name("Pro")
            .price(new BigDecimal("299"))
            .description("专业求职辅导")
            .features(Arrays.asList(
                "简历优化 3 次",
                "模拟面试 8 次",
                "一对一导师指导（4 小时）",
                "求职资源库访问",
                "内推机会"
            ))
            .build());
        
        PRICING_PLANS.put("elite", PricingPlan.builder()
            .id("elite")
            .name("Elite")
            .price(new BigDecimal("599"))
            .description("精英求职辅导")
            .features(Arrays.asList(
                "简历优化 5 次",
                "模拟面试 16 次",
                "一对一导师指导（12 小时）",
                "求职资源库访问",
                "内推机会",
                "Offer 谈判协助",
                "职业规划咨询"
            ))
            .build());
    }
    
    public PaymentResponse createOrder(PaymentRequest request) {
        // Validate plan exists
        PricingPlan plan = PRICING_PLANS.get(request.getPlanId());
        if (plan == null) {
            throw new IllegalArgumentException("Invalid plan");
        }
        
        // Generate order ID
        String orderId = "ORDER_" + System.currentTimeMillis() + "_" + 
            UUID.randomUUID().toString().substring(0, 7);
        
        // Find or create user
        Optional<LocalUser> existingUser = userRepository.findByEmail(request.getEmail());
        Integer userId;
        
        if (existingUser.isPresent()) {
            userId = existingUser.get().getId();
        } else {
            LocalUser newUser = LocalUser.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash("")  // Empty password hash for payment-created users
                .isVerified(false)
                .build();
            LocalUser savedUser = userRepository.save(newUser);
            userId = savedUser.getId();
        }
        
        // Create order
        Order order = Order.builder()
            .userId(userId)
            .planName(request.getPlanId())
            .price(plan.getPrice())
            .currency("USD")
            .status(Order.OrderStatus.PENDING)
            .paymentMethod("alipay")
            .transactionId(orderId)
            .build();
        
        orderRepository.save(order);
        
        // Generate payment URL
        String paymentUrl = alipayUtil.generatePaymentUrl(
            orderId,
            plan.getPrice().toString(),
            "美职通 - " + plan.getName() + " 套餐",
            "华人程序员美国求职辅导 - " + plan.getName() + " 套餐",
            "http://localhost:3000/payment/success?orderId=" + orderId,
            "http://localhost:8080/api/payment/notifyAlipay"
        );
        
        return PaymentResponse.builder()
            .orderId(orderId)
            .paymentUrl(paymentUrl)
            .plan(PaymentResponse.PlanInfo.builder()
                .id(plan.getId())
                .name(plan.getName())
                .price(plan.getPrice())
                .description(plan.getDescription())
                .build())
            .build();
    }
    
    public Order getOrder(String orderId) {
        return orderRepository.findByTransactionId(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }
    
    public Map<String, Object> notifyAlipay(Map<String, String> params) {
        String outTradeNo = params.get("out_trade_no");
        String tradeStatus = params.get("trade_status");
        
        // Validate trade status
        if (!"TRADE_SUCCESS".equals(tradeStatus) && !"TRADE_FINISHED".equals(tradeStatus)) {
            return Map.of("success", false, "message", "Trade status not success");
        }
        
        try {
            Optional<Order> orderOpt = orderRepository.findByTransactionId(outTradeNo);
            if (orderOpt.isEmpty()) {
                return Map.of("success", false, "message", "Order not found");
            }
            
            Order order = orderOpt.get();
            order.setStatus(Order.OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            // Set expiration to 6 months from now
            order.setExpiresAt(LocalDateTime.now().plusMonths(6));
            orderRepository.save(order);
            
            // 🎯 核心逻辑：支付成功后，立即发放会员权益
            // 这是一个原子操作，两个数据库写入在同一个事务中
            membershipService.grantMembership(
                order.getUserId(),
                order.getPlanName(),
                order.getOrderId()
            );
            
            return Map.of("success", true, "message", "Order updated successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to update order");
        }
    }
    
    public List<PricingPlan> getPricingPlans() {
        return new ArrayList<>(PRICING_PLANS.values());
    }
    
    public Map<String, Object> updateUserInfo(String orderId, String bilibiliAccount, String phone) {
        try {
            Optional<Order> orderOpt = orderRepository.findByTransactionId(orderId);
            if (orderOpt.isEmpty()) {
                return Map.of("success", false, "message", "Order not found");
            }
            
            Order order = orderOpt.get();
            order.setBilibiliAccount(bilibiliAccount);
            order.setPhone(phone);
            order.setInfoSubmitted(true);
            orderRepository.save(order);
            
            return Map.of("success", true, "message", "User info updated successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to update user info");
        }
    }
}
