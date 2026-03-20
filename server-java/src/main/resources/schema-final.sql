-- ========================================
-- 最终数据库初始化脚本
-- 仅支持一年期普通会员
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS us_job_hunt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE us_job_hunt;

-- ========================================
-- 1. 本地用户表
-- ========================================
CREATE TABLE IF NOT EXISTS local_users (
    id INT AUTO_INCREMENT UNIQUE COMMENT 'Physical ID for database optimization',
    user_id BIGINT PRIMARY KEY COMMENT 'Snowflake ID - Global unique identifier',
    email VARCHAR(320) NOT NULL UNIQUE COMMENT 'User email address',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password (BCrypt)',
    name VARCHAR(100) COMMENT 'User full name',
    phone VARCHAR(20) COMMENT 'User phone number',
    target_companies LONGTEXT COMMENT 'JSON array of target companies',
    experience_years INT COMMENT 'Years of work experience',
    is_verified TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Email verification status',
    verification_token VARCHAR(255) COMMENT 'Email verification token',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation time',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Local user accounts';

-- ========================================
-- 2. 订单表
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT UNIQUE COMMENT 'Physical ID for database optimization',
    order_id BIGINT PRIMARY KEY COMMENT 'Snowflake ID - Global unique identifier for orders',
    user_id BIGINT NOT NULL COMMENT 'Reference to local_users.user_id',
    plan_name VARCHAR(50) NOT NULL COMMENT 'Plan name: starter, pro, elite',
    price DECIMAL(10, 2) NOT NULL COMMENT 'Order price',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD' COMMENT 'Currency code',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT 'Order status: PENDING, PAID, FAILED, REFUNDED',
    payment_method VARCHAR(50) COMMENT 'Payment method: alipay, wechat, etc',
    transaction_id VARCHAR(100) UNIQUE COMMENT 'Third-party payment transaction ID',
    bilibili_account VARCHAR(100) COMMENT 'User Bilibili account',
    phone VARCHAR(20) COMMENT 'User phone number',
    info_submitted TINYINT(1) DEFAULT 0 COMMENT 'Whether user info has been submitted',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Order creation time',
    paid_at TIMESTAMP NULL COMMENT 'Payment completion time',
    expires_at TIMESTAMP NULL COMMENT 'Course expiration time',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User orders and payments';

-- ========================================
-- 3. 用户会员权益表（极简版）
-- ========================================
CREATE TABLE IF NOT EXISTS user_memberships (
    user_id BIGINT PRIMARY KEY COMMENT 'Reference to local_users.user_id',
    membership_expiry_time DATETIME NOT NULL COMMENT 'Membership expiration time (1 year from purchase)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'First membership creation time',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last membership update time (renewal time)',
    INDEX idx_expiry_time (membership_expiry_time),
    FOREIGN KEY (user_id) REFERENCES local_users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User membership (1-year ordinary membership only)';

-- ========================================
-- 4. 审计日志表（可选）
-- ========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Log ID',
    user_id BIGINT COMMENT 'User ID who performed the action',
    action VARCHAR(100) NOT NULL COMMENT 'Action type: LOGIN, REGISTER, PURCHASE, etc',
    entity_type VARCHAR(50) COMMENT 'Entity type: USER, ORDER, etc',
    entity_id BIGINT COMMENT 'Entity ID',
    details LONGTEXT COMMENT 'Action details in JSON format',
    ip_address VARCHAR(45) COMMENT 'User IP address',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Log creation time',
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit logs for important operations';

-- ========================================
-- 完成！
-- ========================================
-- 现在您可以执行以下命令启动后端：
-- cd server-java
-- mvn clean compile
-- mvn spring-boot:run
