package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.usjobhunt.util.SnowflakeIdGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    
    @Id
    @Column(name = "order_id")
    private Long orderId;  // 使用雪花算法生成的全局唯一 ID
    
    // 物理主键（保留用于数据库优化）
    @Column(name = "id", insertable = false, updatable = false)
    private Integer id;
    
    @Column(nullable = false)
    private Long userId;  // Reference to localUsers.user_id (Snowflake ID)
    
    @Column(nullable = false, length = 50)
    private String planName;  // "starter", "pro", "elite"
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, length = 10)
    private String currency = "USD";
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(length = 50)
    private String paymentMethod;  // "alipay", "wechat", etc
    
    @Column(length = 100)
    private String transactionId;  // Third-party payment transaction ID
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime paidAt;
    
    @Column
    private LocalDateTime expiresAt;  // Course expiration time
    
    @Column(length = 100)
    private String bilibiliAccount;  // Bilibili account
    
    @Column(length = 20)
    private String phone;  // Phone number
    
    @Column
    private Boolean infoSubmitted = false;  // Whether user info has been submitted
    
    @PrePersist
    protected void onCreate() {
        // 如果 orderId 未设置，自动生成
        if (this.orderId == null) {
            SnowflakeIdGenerator generator = new SnowflakeIdGenerator();
            this.orderId = generator.nextId();
        }
        createdAt = LocalDateTime.now();
    }
    
    public enum OrderStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }
}
