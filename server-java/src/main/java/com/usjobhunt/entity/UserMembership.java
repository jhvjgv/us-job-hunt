package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 用户会员权益表
 * 
 * 设计理念：
 * - 独立的会员权益表，与订单表解耦
 * - 支付成功后，通过事务同步更新此表
 * - 查询用户权益时，只需查询此表，性能最优
 * - 支持会员续费：续费时，expiryTime 在原基础上累加
 */
@Entity
@Table(name = "user_memberships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMembership {
    
    @Id
    @Column(name = "user_id")
    private Long userId;  // 与 local_users.user_id 一一对应
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MembershipTier membershipTier;  // 会员等级：BRONZE, SILVER, GOLD, PLATINUM
    
    @Column(nullable = false)
    private LocalDateTime membershipExpiryTime;  // 会员到期时间
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VipStatus vipStatus = VipStatus.ACTIVE;  // 会员状态：ACTIVE, INACTIVE, EXPIRED
    
    @Column
    private Long lastPurchaseOrderId;  // 最后一次购买的订单 ID（用于对账）
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 首次成为会员的时间
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;  // 最后一次权益更新时间
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * 检查会员是否有效
     */
    public boolean isValidMember() {
        return vipStatus == VipStatus.ACTIVE && membershipExpiryTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * 获取会员剩余天数
     */
    public long getRemainingDays() {
        if (!isValidMember()) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), membershipExpiryTime);
    }
    
    /**
     * 会员等级枚举
     * BRONZE: 青铜会员（基础套餐）
     * SILVER: 白银会员（标准套餐）
     * GOLD: 黄金会员（高级套餐）
     * PLATINUM: 铂金会员（VIP 套餐）
     */
    public enum MembershipTier {
        BRONZE("青铜会员", 1),
        SILVER("白银会员", 2),
        GOLD("黄金会员", 3),
        PLATINUM("铂金会员", 4);
        
        private final String displayName;
        private final int level;
        
        MembershipTier(String displayName, int level) {
            this.displayName = displayName;
            this.level = level;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public int getLevel() {
            return level;
        }
    }
    
    /**
     * VIP 状态枚举
     * ACTIVE: 正常会员
     * INACTIVE: 未激活（已购买但未激活）
     * EXPIRED: 已过期
     */
    public enum VipStatus {
        ACTIVE("正常"),
        INACTIVE("未激活"),
        EXPIRED("已过期");
        
        private final String displayName;
        
        VipStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}
