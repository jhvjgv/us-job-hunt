-- ========================================
-- 订单表最终同步脚本
-- 确保订单表与会员表逻辑完美同步
-- 仅支持一年期普通会员
-- ========================================

-- 1. 确保 orders 表已存在（如果不存在则创建）
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT UNIQUE COMMENT 'Physical ID for database optimization',
    order_id BIGINT PRIMARY KEY COMMENT 'Snowflake ID - Global unique identifier for orders',
    user_id BIGINT NOT NULL COMMENT 'Reference to local_users.user_id',
    plan_name VARCHAR(50) NOT NULL DEFAULT 'annual' COMMENT 'Plan name: always annual for 1-year membership',
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
    expires_at TIMESTAMP NULL COMMENT 'Membership expiration time (paid_at + 1 year)',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_transaction_id (transaction_id),
    FOREIGN KEY (user_id) REFERENCES local_users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User orders and payments';

-- 2. 如果 plan_name 列不存在，添加它
ALTER TABLE orders ADD COLUMN IF NOT EXISTS plan_name VARCHAR(50) NOT NULL DEFAULT 'annual' COMMENT 'Plan name: always annual for 1-year membership';

-- 3. 如果 expires_at 列不存在，添加它
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP NULL COMMENT 'Membership expiration time (paid_at + 1 year)';

-- 4. 统一所有订单的 plan_name 为 'annual'
UPDATE orders SET plan_name = 'annual' WHERE plan_name IS NULL OR plan_name != 'annual';

-- 5. 对于已支付的订单，自动计算 expires_at（如果为空）
UPDATE orders 
SET expires_at = DATE_ADD(paid_at, INTERVAL 1 YEAR) 
WHERE status = 'PAID' AND expires_at IS NULL AND paid_at IS NOT NULL;

-- 6. 验证数据一致性：检查 orders 表中已支付的订单
SELECT 
    COUNT(*) as total_paid_orders,
    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_memberships,
    COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_memberships
FROM orders
WHERE status = 'PAID';

-- ========================================
-- 完成！
-- ========================================
-- 现在 orders 表与 user_memberships 表的逻辑完全同步：
-- 1. 所有订单的 plan_name 都是 'annual'
-- 2. 所有已支付订单的 expires_at = paid_at + 1 year
-- 3. user_memberships 表中的 membership_expiry_time 与 orders 表中的 expires_at 保持一致
