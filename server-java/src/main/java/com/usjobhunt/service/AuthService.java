package com.usjobhunt.service;

import com.usjobhunt.dto.AuthRequest;
import com.usjobhunt.dto.AuthResponse;
import com.usjobhunt.entity.LocalUser;
import com.usjobhunt.repository.LocalUserRepository;
import com.usjobhunt.util.JwtUtil;
import com.usjobhunt.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final LocalUserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    
    public AuthResponse register(AuthRequest request) {
        // Validate email format
        if (!passwordUtil.isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("邮箱格式不正确");
        }
        
        // Validate password strength
        if (!passwordUtil.isStrongPassword(request.getPassword())) {
            throw new IllegalArgumentException("密码必须至少 8 个字符，包含大小写字母和数字");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("该邮箱已被注册");
        }
        
        // Create new user
        String passwordHash = passwordUtil.hashPassword(request.getPassword());
        LocalUser newUser = LocalUser.builder()
            .email(request.getEmail())
            .passwordHash(passwordHash)
            .name(request.getName())
            .targetCompanies(request.getTargetCompanies() != null ? 
                String.join(",", request.getTargetCompanies()) : null)
            .experienceYears(request.getExperienceYears())
            .isVerified(false)
            .build();
        
        LocalUser savedUser = userRepository.save(newUser);
        
        String token = jwtUtil.generateToken(savedUser.getUserId(), savedUser.getEmail());
        
        return AuthResponse.builder()
            .id(savedUser.getUserId())
            .email(savedUser.getEmail())
            .name(savedUser.getName())
            .token(token)
            .build();
    }
    
    public AuthResponse login(AuthRequest request) {
        Optional<LocalUser> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("邮箱或密码错误");
        }
        
        LocalUser user = userOpt.get();
        
        if (!passwordUtil.verifyPassword(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("邮箱或密码错误");
        }
        
        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail());
        
        return AuthResponse.builder()
            .id(user.getUserId())
            .email(user.getEmail())
            .name(user.getName())
            .token(token)
            .build();
    }
    
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public Optional<LocalUser> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    
    public Optional<LocalUser> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
