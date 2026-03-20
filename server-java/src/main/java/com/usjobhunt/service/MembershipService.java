package com.usjobhunt.service;

import com.usjobhunt.entity.UserMembership;
import com.usjobhunt.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 会员权益管理服务（极简版）
 * 
 * 职责：
 * - 发放一年期普通会员权益
 * - 支持会员续费（在现有到期时间上累加 1 年）
 * - 检查用户是否为活跃会员
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MembershipService {
    
    private final UserMembershipRepository membershipRepository;
    
    /**
     * 发放/续费会员权益
     * 
     * 逻辑：
     * 1. 如果用户已是会员，则在现有过期时间基础上累加 1 年（续费）
     * 2. 如果用户不是会员，则创建新的会员记录，有效期为 1 年
     * 
     * @param userId 用户 ID
     */
    public UserMembership grantMembership(Long userId) {
        Optional<UserMembership> existingMembership = membershipRepository.findByUserId(userId);
        
        UserMembership membership;
        if (existingMembership.isPresent()) {
            // 用户已是会员，执行续费逻辑：在现有到期时间上累加 1 年
            membership = existingMembership.get();
            LocalDateTime newExpiryTime = membership.getMembershipExpiryTime().plusYears(1);
            membership.setMembershipExpiryTime(newExpiryTime);
        } else {
            // 用户不是会员，创建新的会员记录：有效期为 1 年
            LocalDateTime expiryTime = LocalDateTime.now().plusYears(1);
            membership = UserMembership.builder()
                .userId(userId)
                .membershipExpiryTime(expiryTime)
                .build();
        }
        
        return membershipRepository.save(membership);
    }
    
    /**
     * 检查用户是否为活跃会员
     * @return true: 用户已支付且会员未过期；false: 用户未支付或会员已过期
     */
    public boolean isActiveMember(Long userId) {
        Optional<UserMembership> membership = membershipRepository.findByUserId(userId);
        return membership.isPresent() && membership.get().isValid();
    }
    
    /**
     * 获取用户的会员信息
     */
    public Optional<UserMembership> getMembershipInfo(Long userId) {
        return membershipRepository.findByUserId(userId);
    }
}
