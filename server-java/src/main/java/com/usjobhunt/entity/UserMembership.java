package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 用户会员权益表（极简版）
 * 
 * 设计理念：
 * - 仅支持一年期普通会员
 * - 支付成功后自动发放会员权益
 * - 续费时自动在现有到期时间上累加 1 年
 * - 简洁高效，立刻可用
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
    private LocalDateTime membershipExpiryTime;  // 会员到期时间
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 首次成为会员的时间
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;  // 最后一次续费时间
    
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
    public boolean isValid() {
        return membershipExpiryTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * 获取会员剩余天数
     */
    public long getRemainingDays() {
        if (!isValid()) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), membershipExpiryTime);
    }
}
