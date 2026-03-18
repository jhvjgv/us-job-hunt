-- 数据库迁移脚本：添加用户信息字段
-- 执行此脚本以添加 B 站账号、手机号和信息提交状态字段

ALTER TABLE orders ADD COLUMN bilibili_account VARCHAR(100) COMMENT 'Bilibili account' AFTER expires_at;
ALTER TABLE orders ADD COLUMN phone VARCHAR(20) COMMENT 'Phone number' AFTER bilibili_account;
ALTER TABLE orders ADD COLUMN info_submitted BOOLEAN DEFAULT FALSE COMMENT 'Whether user info has been submitted' AFTER phone;

-- 创建索引以提高查询性能
CREATE INDEX idx_info_submitted ON orders(info_submitted);
