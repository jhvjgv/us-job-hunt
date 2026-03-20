-- 🛠️ 标准兼容版数据库迁移脚本：重构用户表主键为 userId
-- 适配 MySQL 8.0.19 以下版本，移除 IF NOT EXISTS 语法，解决 1064 报错

SET FOREIGN_KEY_CHECKS = 0;

-- 步骤 1: 删除现有的外键约束（解决 ERROR 3780）
-- 无论是否存在，先尝试删除。如果报错不存在，可以忽略。
ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;

-- 步骤 2: 添加 user_id 列 (不使用 IF NOT EXISTS)
-- 如果这一步报错说列已存在，请忽略并继续。
ALTER TABLE local_users ADD COLUMN user_id BIGINT AFTER id;

-- 步骤 3: 为现有数据生成唯一的 user_id
UPDATE local_users 
SET user_id = CAST(CONCAT(UNIX_TIMESTAMP(created_at), LPAD(id, 4, '0')) AS UNSIGNED)
WHERE user_id IS NULL OR user_id = 0;

-- 步骤 4: 处理主键重构
-- 1. 先去掉 id 的自增属性
ALTER TABLE local_users MODIFY id INT NOT NULL;

-- 2. 删除旧的主键
ALTER TABLE local_users DROP PRIMARY KEY;

-- 3. 将 user_id 设置为新的主键
ALTER TABLE local_users MODIFY user_id BIGINT NOT NULL;
ALTER TABLE local_users ADD PRIMARY KEY (user_id);

-- 4. 重新为 id 添加自增和唯一索引
ALTER TABLE local_users MODIFY id INT AUTO_INCREMENT UNIQUE;

-- 步骤 5: 同步修改 orders 表中的 user_id 类型
ALTER TABLE orders MODIFY user_id BIGINT NOT NULL;

-- 步骤 6: 创建索引 (不使用 IF NOT EXISTS)
-- 如果索引已存在，MySQL 会报错，可以忽略这些报错。
CREATE INDEX idx_user_email ON local_users(email);
CREATE INDEX idx_order_user_id ON orders(user_id);

SET FOREIGN_KEY_CHECKS = 1;

-- ✅ 验证查询
-- SELECT id, user_id, email FROM local_users LIMIT 5;
-- SELECT id, user_id, plan_name FROM orders LIMIT 5;
