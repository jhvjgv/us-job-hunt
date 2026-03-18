package com.usjobhunt.controller;

import com.usjobhunt.dto.PaymentRequest;
import com.usjobhunt.dto.PaymentResponse;
import com.usjobhunt.dto.PricingPlan;
import com.usjobhunt.dto.UpdateUserInfoRequest;
import com.usjobhunt.entity.Order;
import com.usjobhunt.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping("/createOrder")
    public ResponseEntity<?> createOrder(@Valid @RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId) {
        try {
            Order order = paymentService.getOrder(orderId);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/notifyAlipay")
    public ResponseEntity<?> notifyAlipay(@RequestParam Map<String, String> params) {
        Map<String, Object> result = paymentService.notifyAlipay(params);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/plans")
    public ResponseEntity<List<PricingPlan>> getPricingPlans() {
        List<PricingPlan> plans = paymentService.getPricingPlans();
        return ResponseEntity.ok(plans);
    }
    
    @PostMapping("/updateUserInfo")
    public ResponseEntity<?> updateUserInfo(@Valid @RequestBody UpdateUserInfoRequest request) {
        try {
            Map<String, Object> result = paymentService.updateUserInfo(
                request.getOrderId(),
                request.getBilibiliAccount(),
                request.getPhone()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
