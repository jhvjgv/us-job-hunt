-- 🛠️ 订单表迁移脚本：重构订单表主键为 orderId
-- 适配 MySQL 8.0.19 以下版本，移除 IF NOT EXISTS 语法

SET FOREIGN_KEY_CHECKS = 0;

-- 步骤 1: 添加 order_id 列 (不使用 IF NOT EXISTS)
-- 如果这一步报错说列已存在，请忽略并继续。
ALTER TABLE orders ADD COLUMN order_id BIGINT AFTER id;

-- 步骤 2: 为现有数据生成唯一的 order_id
UPDATE orders 
SET order_id = CAST(CONCAT(UNIX_TIMESTAMP(created_at), LPAD(id, 4, '0')) AS UNSIGNED)
WHERE order_id IS NULL OR order_id = 0;

-- 步骤 3: 处理主键重构
-- 1. 先去掉 id 的自增属性
ALTER TABLE orders MODIFY id INT NOT NULL;

-- 2. 删除旧的主键
ALTER TABLE orders DROP PRIMARY KEY;

-- 3. 将 order_id 设置为新的主键
ALTER TABLE orders MODIFY order_id BIGINT NOT NULL;
ALTER TABLE orders ADD PRIMARY KEY (order_id);

-- 4. 重新为 id 添加自增和唯一索引
ALTER TABLE orders MODIFY id INT AUTO_INCREMENT UNIQUE;

-- 步骤 4: 确保 user_id 是 BIGINT 类型
ALTER TABLE orders MODIFY user_id BIGINT NOT NULL;

-- 步骤 5: 创建索引 (不使用 IF NOT EXISTS)
-- 如果索引已存在，MySQL 会报错，可以忽略这些报错。
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created_at ON orders(created_at);

SET FOREIGN_KEY_CHECKS = 1;

-- ✅ 验证查询
-- SELECT id, order_id, user_id, plan_name FROM orders LIMIT 5;
