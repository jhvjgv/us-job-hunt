package com.usjobhunt.repository;

import com.usjobhunt.entity.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {
    
    /**
     * 根据用户 ID 查询会员权益
     */
    Optional<UserMembership> findByUserId(Long userId);
    
    /**
     * 检查用户是否为活跃会员
     */
    boolean existsByUserIdAndVipStatusAndMembershipExpiryTimeAfter(
        Long userId, 
        UserMembership.VipStatus vipStatus,
        java.time.LocalDateTime expiryTime
    );
}
