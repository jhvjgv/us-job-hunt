-- 数据库迁移脚本：重构用户表主键为 userId
-- 执行此脚本以将 local_users 表的主键从 auto_increment id 改为 userId（雪花算法生成）

-- 步骤 1: 添加 user_id 列（如果还没有的话）
-- 注意：如果您的表中已经有 user_id 列，请跳过此步骤
ALTER TABLE local_users ADD COLUMN user_id BIGINT UNIQUE COMMENT 'Snowflake ID - Global unique identifier' AFTER id;

-- 步骤 2: 为现有数据生成 user_id（使用时间戳 + 随机数生成）
-- 这是一个临时方案，用于为现有用户分配 user_id
UPDATE local_users 
SET user_id = CAST(CONCAT(UNIX_TIMESTAMP(created_at) * 1000, LPAD(id, 4, '0')) AS UNSIGNED)
WHERE user_id IS NULL;

-- 步骤 3: 将 user_id 设置为非空
ALTER TABLE local_users MODIFY user_id BIGINT NOT NULL;

-- 步骤 4: 更改主键
-- 首先删除旧的自增主键
ALTER TABLE local_users DROP PRIMARY KEY;

-- 然后添加新的主键
ALTER TABLE local_users ADD PRIMARY KEY (user_id);

-- 步骤 5: 将 id 改为普通列（用于数据库优化和向后兼容）
ALTER TABLE local_users MODIFY id INT AUTO_INCREMENT UNIQUE;

-- 步骤 6: 更新 orders 表中的 user_id 类型
ALTER TABLE orders MODIFY user_id BIGINT NOT NULL;

-- 步骤 7: 创建索引以提高查询性能
CREATE INDEX idx_user_email ON local_users(email);
CREATE INDEX idx_user_created_at ON local_users(created_at);
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);

-- 步骤 8: 验证迁移结果
-- 运行以下查询检查迁移是否成功
-- SELECT id, user_id, email, created_at FROM local_users LIMIT 5;
-- SELECT id, user_id, plan_name, status FROM orders LIMIT 5;
