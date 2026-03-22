package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.usjobhunt.util.SnowflakeIdGenerator;

@Entity
@Table(name = "local_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalUser {
    
    @Id
    @Column(name = "user_id")
    private Long userId;  // 使用雪花算法生成的全局唯一 ID
    
    // 物理主键（保留用于数据库优化）
    @Column(name = "id", insertable = false, updatable = false)
    private Integer id;
    
    @Column(nullable = false, unique = true, length = 320)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(length = 100)
    private String name;
    
    @Column(length = 20)
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String targetCompanies;  // JSON array: ["Google", "Meta", ...]
    
    @Column
    private Integer experienceYears;
    
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    @Column(length = 255)
    private String verificationToken;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        // 如果 userId 未设置，自动生成
        if (this.userId == null) {
            SnowflakeIdGenerator generator = new SnowflakeIdGenerator();
            this.userId = generator.nextId();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
