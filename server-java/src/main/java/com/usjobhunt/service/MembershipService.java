package com.usjobhunt.service;

import com.usjobhunt.entity.Order;
import com.usjobhunt.entity.UserMembership;
import com.usjobhunt.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 会员权益管理服务
 * 
 * 职责：
 * - 管理用户会员权益的增删改查
 * - 处理会员续费逻辑
 * - 提供权益检查方法
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MembershipService {
    
    private final UserMembershipRepository membershipRepository;
    
    /**
     * 根据订单信息发放会员权益
     * 
     * 逻辑：
     * 1. 如果用户已是会员，则在现有过期时间基础上累加（续费）
     * 2. 如果用户不是会员，则创建新的会员记录
     * 
     * @param userId 用户 ID
     * @param planName 购买的套餐名称 (starter, pro, elite)
     * @param orderId 订单 ID（用于对账）
     */
    public UserMembership grantMembership(Long userId, String planName, Long orderId) {
        // 根据套餐名称确定会员等级和有效期
        MembershipTierInfo tierInfo = getMembershipTierInfo(planName);
        
        Optional<UserMembership> existingMembership = membershipRepository.findByUserId(userId);
        
        UserMembership membership;
        if (existingMembership.isPresent()) {
            // 用户已是会员，执行续费逻辑
            membership = existingMembership.get();
            
            // 如果新的等级更高，升级会员等级
            if (tierInfo.tier.getLevel() > membership.getMembershipTier().getLevel()) {
                membership.setMembershipTier(tierInfo.tier);
            }
            
            // 在现有过期时间基础上累加有效期
            LocalDateTime newExpiryTime = membership.getMembershipExpiryTime()
                .plusMonths(tierInfo.durationMonths);
            membership.setMembershipExpiryTime(newExpiryTime);
            
        } else {
            // 用户不是会员，创建新的会员记录
            LocalDateTime expiryTime = LocalDateTime.now().plusMonths(tierInfo.durationMonths);
            membership = UserMembership.builder()
                .userId(userId)
                .membershipTier(tierInfo.tier)
                .membershipExpiryTime(expiryTime)
                .vipStatus(UserMembership.VipStatus.ACTIVE)
                .build();
        }
        
        // 记录最后一次购买的订单 ID（用于对账）
        membership.setLastPurchaseOrderId(orderId);
        membership.setVipStatus(UserMembership.VipStatus.ACTIVE);
        
        return membershipRepository.save(membership);
    }
    
    /**
     * 检查用户是否为活跃会员
     */
    public boolean isActiveMember(Long userId) {
        Optional<UserMembership> membership = membershipRepository.findByUserId(userId);
        return membership.isPresent() && membership.get().isValidMember();
    }
    
    /**
     * 获取用户的会员信息
     */
    public Optional<UserMembership> getMembershipInfo(Long userId) {
        return membershipRepository.findByUserId(userId);
    }
    
    /**
     * 获取用户的会员等级
     */
    public UserMembership.MembershipTier getUserMembershipTier(Long userId) {
        return membershipRepository.findByUserId(userId)
            .map(UserMembership::getMembershipTier)
            .orElse(null);  // 非会员返回 null
    }
    
    /**
     * 检查用户是否为特定等级的会员
     */
    public boolean isMemberOfTier(Long userId, UserMembership.MembershipTier tier) {
        Optional<UserMembership> membership = membershipRepository.findByUserId(userId);
        if (membership.isEmpty()) {
            return false;
        }
        UserMembership m = membership.get();
        return m.isValidMember() && m.getMembershipTier().getLevel() >= tier.getLevel();
    }
    
    /**
     * 手动过期用户会员（管理员操作）
     */
    public void expireMembership(Long userId) {
        Optional<UserMembership> membership = membershipRepository.findByUserId(userId);
        if (membership.isPresent()) {
            UserMembership m = membership.get();
            m.setVipStatus(UserMembership.VipStatus.EXPIRED);
            membershipRepository.save(m);
        }
    }
    
    /**
     * 根据套餐名称获取会员等级信息
     */
    private MembershipTierInfo getMembershipTierInfo(String planName) {
        return switch (planName.toLowerCase()) {
            case "starter" -> new MembershipTierInfo(UserMembership.MembershipTier.BRONZE, 1);
            case "pro" -> new MembershipTierInfo(UserMembership.MembershipTier.SILVER, 3);
            case "elite" -> new MembershipTierInfo(UserMembership.MembershipTier.GOLD, 12);
            default -> new MembershipTierInfo(UserMembership.MembershipTier.BRONZE, 1);
        };
    }
    
    /**
     * 会员等级信息内部类
     */
    private static class MembershipTierInfo {
        UserMembership.MembershipTier tier;
        int durationMonths;
        
        MembershipTierInfo(UserMembership.MembershipTier tier, int durationMonths) {
            this.tier = tier;
            this.durationMonths = durationMonths;
        }
    }
}
