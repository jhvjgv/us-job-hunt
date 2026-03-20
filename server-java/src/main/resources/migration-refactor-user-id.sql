-- 🛠️ 修复版数据库迁移脚本：重构用户表主键为 userId
-- 解决 ERROR 1075, 1068, 3780 等常见 MySQL 迁移错误

SET FOREIGN_KEY_CHECKS = 0; -- 暂时关闭外键检查，允许修改关联列

-- 步骤 1: 确保 user_id 列存在
-- 如果 user_id 已经存在，这一步会静默失败或跳过
ALTER TABLE local_users ADD COLUMN IF NOT EXISTS user_id BIGINT AFTER id;

-- 步骤 2: 为现有数据生成唯一的 user_id（基于时间戳 + 原 id）
-- 如果 user_id 为空，则填充数据
UPDATE local_users 
SET user_id = CAST(CONCAT(UNIX_TIMESTAMP(created_at), LPAD(id, 4, '0')) AS UNSIGNED)
WHERE user_id IS NULL OR user_id = 0;

-- 步骤 3: 处理主键冲突 (核心修复步骤)
-- 1. 先去掉 id 的自增属性（解决 ERROR 1075）
ALTER TABLE local_users MODIFY id INT NOT NULL;

-- 2. 删除旧的主键 (解决 ERROR 1068)
ALTER TABLE local_users DROP PRIMARY KEY;

-- 3. 将 user_id 设置为新的主键
ALTER TABLE local_users MODIFY user_id BIGINT NOT NULL;
ALTER TABLE local_users ADD PRIMARY KEY (user_id);

-- 4. 重新为 id 添加自增和唯一索引（可选，用于物理排序优化）
ALTER TABLE local_users MODIFY id INT AUTO_INCREMENT UNIQUE;

-- 步骤 4: 更新关联表 orders
-- 1. 修改 orders 表中的 user_id 类型为 BIGINT
ALTER TABLE orders MODIFY user_id BIGINT NOT NULL;

-- 2. (可选) 如果需要重新建立物理外键关联
-- ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES local_users(user_id) ON DELETE CASCADE;

-- 步骤 5: 创建业务索引
CREATE INDEX IF NOT EXISTS idx_user_email ON local_users(email);
CREATE INDEX IF NOT EXISTS idx_order_user_id ON orders(user_id);

SET FOREIGN_KEY_CHECKS = 1; -- 重新开启外键检查

-- ✅ 验证查询
-- SELECT id, user_id, email FROM local_users LIMIT 5;
-- SELECT id, user_id, plan_name FROM orders LIMIT 5;
