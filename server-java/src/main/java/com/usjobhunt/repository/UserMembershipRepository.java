package com.usjobhunt.repository;

import com.usjobhunt.entity.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {
    
    /**
     * 根据用户 ID 查询会员权益
     */
    Optional<UserMembership> findByUserId(Long userId);
    
    /**
     * 检查用户是否为活跃会员（到期时间在当前时间之后）
     */
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END " +
           "FROM UserMembership m " +
           "WHERE m.userId = :userId AND m.membershipExpiryTime > :now")
    boolean isActiveMember(Long userId, LocalDateTime now);
}
