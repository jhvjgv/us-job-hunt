-- ========================================
-- 最终业务同步脚本
-- 执行此脚本后，您的数据库将完全就绪
-- ========================================
-- 
-- 前置条件：
-- 1. 已执行 migration-refactor-user-id.sql
-- 2. 已执行 migration-refactor-order-id.sql
-- 3. 现在执行此脚本完成会员系统集成
--
-- ========================================

USE us_job_hunt;

-- ========================================
-- 第一步：升级 orders 表
-- ========================================

-- 1.1 添加 plan_name 列（如果不存在）
ALTER TABLE orders ADD COLUMN IF NOT EXISTS plan_name VARCHAR(50) DEFAULT 'annual' COMMENT 'Plan name: always annual for 1-year membership';

-- 1.2 添加 expires_at 列（如果不存在）
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP NULL COMMENT 'Membership expiration time (paid_at + 1 year)';

-- 1.3 添加 bilibili_account 列（如果不存在）
ALTER TABLE orders ADD COLUMN IF NOT EXISTS bilibili_account VARCHAR(100) COMMENT 'User Bilibili account';

-- 1.4 添加 phone 列（如果不存在）
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(20) COMMENT 'User phone number';

-- 1.5 添加 info_submitted 列（如果不存在）
ALTER TABLE orders ADD COLUMN IF NOT EXISTS info_submitted TINYINT(1) DEFAULT 0 COMMENT 'Whether user info has been submitted';

-- 1.6 统一所有订单的 plan_name 为 'annual'
UPDATE orders SET plan_name = 'annual' WHERE plan_name IS NULL OR plan_name != 'annual';

-- 1.7 为已支付的订单计算 expires_at（如果为空）
UPDATE orders 
SET expires_at = DATE_ADD(paid_at, INTERVAL 1 YEAR) 
WHERE status = 'PAID' AND expires_at IS NULL AND paid_at IS NOT NULL;

-- 1.8 为未支付但已创建的订单设置默认 expires_at（创建时间 + 1 年）
UPDATE orders 
SET expires_at = DATE_ADD(created_at, INTERVAL 1 YEAR) 
WHERE expires_at IS NULL;

-- ========================================
-- 第二步：创建 user_memberships 表
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
-- 第三步：同步已支付订单到会员表
-- ========================================

-- 3.1 清空会员表（可选，如果您想重新同步）
-- TRUNCATE TABLE user_memberships;

-- 3.2 将所有已支付订单同步到会员表
-- 逻辑：对于每个用户，取最后一笔已支付订单的 expires_at 作为会员到期时间
INSERT INTO user_memberships (user_id, membership_expiry_time, created_at, updated_at)
SELECT 
    o.user_id,
    MAX(o.expires_at) as membership_expiry_time,
    MIN(o.paid_at) as created_at,
    MAX(o.paid_at) as updated_at
FROM orders o
WHERE o.status = 'PAID' AND o.paid_at IS NOT NULL
GROUP BY o.user_id
ON DUPLICATE KEY UPDATE
    membership_expiry_time = VALUES(membership_expiry_time),
    updated_at = VALUES(updated_at);

-- ========================================
-- 第四步：数据验证
-- ========================================

-- 4.1 检查订单表更新情况
SELECT 
    '订单表统计' as check_item,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_orders,
    COUNT(CASE WHEN plan_name = 'annual' THEN 1 END) as annual_plan_orders,
    COUNT(CASE WHEN expires_at IS NOT NULL THEN 1 END) as orders_with_expiry
FROM orders;

-- 4.2 检查会员表
SELECT 
    '会员表统计' as check_item,
    COUNT(*) as total_members,
    COUNT(CASE WHEN membership_expiry_time > NOW() THEN 1 END) as active_members,
    COUNT(CASE WHEN membership_expiry_time <= NOW() THEN 1 END) as expired_members
FROM user_memberships;

-- 4.3 检查订单与会员表的一致性
SELECT 
    '一致性检查' as check_item,
    COUNT(*) as total_checks,
    COUNT(CASE WHEN o.expires_at = m.membership_expiry_time THEN 1 END) as consistent_records,
    COUNT(CASE WHEN o.expires_at != m.membership_expiry_time THEN 1 END) as inconsistent_records
FROM (
    SELECT DISTINCT user_id, MAX(expires_at) as expires_at 
    FROM orders 
    WHERE status = 'PAID'
    GROUP BY user_id
) o
LEFT JOIN user_memberships m ON o.user_id = m.user_id;

-- ========================================
-- 第五步：创建索引以优化查询性能
-- ========================================

-- 5.1 为 orders 表添加索引
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_user_id_status (user_id, status);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_expires_at (expires_at);

-- 5.2 为 user_memberships 表的索引已在创建表时添加

-- ========================================
-- 完成！
-- ========================================
-- 
-- 现在您的数据库已经完全就绪：
-- 
-- ✅ local_users 表：
--    - user_id (Snowflake ID) 作为主键
--    - 支持分布式架构
--
-- ✅ orders 表：
--    - order_id (Snowflake ID) 作为主键
--    - plan_name 统一为 'annual'
--    - expires_at 自动计算为 paid_at + 1 year
--    - 支持用户信息收集（bilibili_account, phone）
--
-- ✅ user_memberships 表：
--    - user_id 作为主键
--    - membership_expiry_time 记录会员到期时间
--    - 自动同步已支付订单
--    - 支持续费（更新 membership_expiry_time）
--
-- 现在您可以启动后端了：
-- cd server-java
-- mvn clean compile
-- mvn spring-boot:run
--
-- ========================================
