package com.usjobhunt.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    /** 雪花 ID，JSON 中输出为字符串，避免前端 Number 精度丢失 */
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;
    private String email;
    private String name;
    private String token;
}
