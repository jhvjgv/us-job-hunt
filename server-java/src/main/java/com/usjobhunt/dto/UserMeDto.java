package com.usjobhunt.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.usjobhunt.entity.LocalUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 与前端「当前用户」展示字段对齐（原 tRPC auth.me）
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMeDto {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String openId;
    private String email;
    private String name;
    private String loginMethod;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastSignedIn;

    public static UserMeDto fromEntity(LocalUser u) {
        return UserMeDto.builder()
            .id(u.getUserId())
            .openId("local:" + u.getUserId())
            .email(u.getEmail())
            .name(u.getName())
            .loginMethod("password")
            .role("user")
            .createdAt(u.getCreatedAt())
            .updatedAt(u.getUpdatedAt())
            .lastSignedIn(u.getUpdatedAt())
            .build();
    }
}
