package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private Integer userId;  // Reference to localUsers.id
    
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
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum OrderStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }
}
