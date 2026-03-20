# 🚀 一键启动指南

## 您已经完成的步骤

✅ 已执行：`migration-refactor-user-id.sql`  
✅ 已执行：`migration-refactor-order-id.sql`  

## 现在只需一步

### 执行最后的业务同步脚本

```bash
mysql -u root -p us_job_hunt < server-java/src/main/resources/final_business_sync.sql
```

**就这样！** 您的数据库现在已经完全就绪。

---

## 验证数据库

执行脚本后，您会看到 4 个验证查询的结果，显示：
- 订单表的统计信息
- 会员表的统计信息
- 订单与会员表的一致性检查

如果所有数据都显示正常，说明同步成功！

---

## 启动后端

```bash
cd server-java
mvn clean compile
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动。

---

## 启动前端（可选）

```bash
cd client
npm install
npm run dev
```

前端将在 `http://localhost:3000` 启动。

---

## 🎉 完成！

您的系统现在已经完全就绪，可以立刻开始测试支付流程了！

---

## 📊 脚本做了什么？

### 升级 orders 表
- 添加 `plan_name` 列（统一为 'annual'）
- 添加 `expires_at` 列（自动计算为 paid_at + 1 year）
- 添加 `bilibili_account`、`phone`、`info_submitted` 列（用于用户信息收集）

### 创建 user_memberships 表
- `user_id`：用户 ID（主键）
- `membership_expiry_time`：会员到期时间
- `created_at`：首次成为会员的时间
- `updated_at`：最后续费时间

### 同步现有数据
- 将所有已支付订单自动转为会员
- 每个用户的会员到期时间 = 最后一笔已支付订单的 expires_at

### 验证数据一致性
- 检查订单表和会员表的数据是否同步
- 确保没有数据不一致的情况

---

## 🚨 如果出现错误

### 错误：`Table 'user_memberships' already exists`
说明会员表已经存在，这是正常的。脚本会跳过创建，继续执行后续步骤。

### 错误：`Column 'plan_name' already exists`
说明该列已经存在，这也是正常的。脚本会跳过添加，继续执行后续步骤。

### 其他错误
请检查：
1. MySQL 是否正在运行
2. 数据库 `us_job_hunt` 是否存在
3. 您是否有足够的权限执行 ALTER TABLE

---

## ✨ 现在您可以：

1. **测试支付流程**：用户购买会员 → 自动发放权益
2. **检查会员状态**：查询 `user_memberships` 表
3. **验证权限系统**：使用 `membershipService.isActiveMember(userId)` 检查权限
4. **收集用户信息**：支付成功后弹窗收集 B 站账号和手机号

---

**祝您启动顺利！🎉**
