package com.usjobhunt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "local_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true, length = 320)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Column(length = 100)
    private String name;
    
    @Column(length = 20)
    private String phone;
    
    @Column(columnDefinition = "LONGTEXT")
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
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
