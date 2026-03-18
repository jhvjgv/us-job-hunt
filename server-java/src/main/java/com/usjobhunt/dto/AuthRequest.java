package com.usjobhunt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {
    
    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, message = "密码至少 8 个字符")
    private String password;
    
    @Size(min = 2, message = "名字至少 2 个字符")
    private String name;
    
    private List<String> targetCompanies;
    
    private Integer experienceYears;
}
