-- 创建 user_memberships 表
-- 这是一张独立的会员权益表，与订单表解耦
-- 支付成功后，通过事务同步更新此表

CREATE TABLE IF NOT EXISTS user_memberships (
    user_id BIGINT PRIMARY KEY COMMENT 'Reference to local_users.user_id',
    membership_tier VARCHAR(50) NOT NULL COMMENT 'Membership tier: BRONZE, SILVER, GOLD, PLATINUM',
    membership_expiry_time DATETIME NOT NULL COMMENT 'Membership expiration time',
    vip_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' COMMENT 'VIP status: ACTIVE, INACTIVE, EXPIRED',
    last_purchase_order_id BIGINT COMMENT 'Last purchase order ID (for reconciliation)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'First membership creation time',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last membership update time',
    INDEX idx_vip_status (vip_status),
    INDEX idx_expiry_time (membership_expiry_time),
    FOREIGN KEY (user_id) REFERENCES local_users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User membership and benefits';

-- 一次性同步脚本：将已支付的订单同步到会员表
-- 这个脚本只需要执行一次，用于初始化会员表
-- 如果您的订单表中已经有已支付的订单，执行此脚本会自动为这些用户创建会员记录

INSERT INTO user_memberships (user_id, membership_tier, membership_expiry_time, vip_status, last_purchase_order_id, created_at, updated_at)
SELECT 
    o.user_id,
    CASE 
        WHEN o.plan_name = 'starter' THEN 'BRONZE'
        WHEN o.plan_name = 'pro' THEN 'SILVER'
        WHEN o.plan_name = 'elite' THEN 'GOLD'
        ELSE 'BRONZE'
    END AS membership_tier,
    o.paid_at + INTERVAL 1 YEAR AS membership_expiry_time,
    CASE 
        WHEN o.paid_at + INTERVAL 1 YEAR > NOW() THEN 'ACTIVE'
        ELSE 'EXPIRED'
    END AS vip_status,
    o.order_id,
    o.paid_at,
    o.paid_at
FROM orders o
WHERE o.status = 'PAID' 
  AND o.paid_at IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM user_memberships um WHERE um.user_id = o.user_id
  )
ON DUPLICATE KEY UPDATE 
    membership_tier = VALUES(membership_tier),
    membership_expiry_time = VALUES(membership_expiry_time),
    vip_status = VALUES(vip_status),
    last_purchase_order_id = VALUES(last_purchase_order_id),
    updated_at = NOW();
