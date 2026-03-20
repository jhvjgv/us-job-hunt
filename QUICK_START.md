# ⚡ 快速启动指南（极简版）

## 🎯 系统现状

- **后端**：Java Spring Boot
- **数据库**：MySQL
- **会员系统**：仅支持一年期普通会员
- **支付流程**：支付成功 → 自动发放会员权益（有效期 1 年）
- **续费逻辑**：再次支付 → 在现有到期时间上累加 1 年

---

## 📋 一键启动步骤

### 第 1 步：初始化数据库（仅需执行一次）

```bash
# 如果您的数据库还没有创建过表，执行此脚本
mysql -u root -p < server-java/src/main/resources/schema-final.sql
```

**如果您已经创建过表**（按照之前的步骤），执行此脚本创建会员表：

```bash
# 仅创建 user_memberships 表
mysql -u root -p us_job_hunt << 'EOF'
CREATE TABLE IF NOT EXISTS user_memberships (
    user_id BIGINT PRIMARY KEY,
    membership_expiry_time DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_expiry_time (membership_expiry_time),
    FOREIGN KEY (user_id) REFERENCES local_users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOF
```

### 第 2 步：验证数据库

```sql
-- 检查表是否创建成功
SHOW TABLES;

-- 检查 user_memberships 表结构
DESCRIBE user_memberships;
```

### 第 3 步：启动后端

```bash
cd server-java
mvn clean compile
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动。

### 第 4 步：启动前端（可选）

```bash
cd client
npm install
npm run dev
```

前端将在 `http://localhost:3000` 启动。

---

## 🔄 完整支付流程

### 1. 用户购买会员

```
前端 → POST /api/payment/createOrder
{
    "planId": "starter",  // 或 "pro", "elite"
    "email": "user@example.com",
    "name": "张三"
}
↓
后端返回支付链接
↓
用户跳转到支付宝支付
```

### 2. 支付成功

```
支付宝 → POST /api/payment/notifyAlipay
↓
后端更新订单状态为 PAID
↓
后端自动调用 membershipService.grantMembership(userId)
↓
user_memberships 表插入/更新记录
↓
用户自动成为会员（有效期 1 年）
```

### 3. 用户访问 VIP 功能

```
前端 → GET /api/vip/some-feature
↓
后端检查：membershipService.isActiveMember(userId)
↓
true  → 允许访问
false → 返回 403，提示用户购买会员
```

---

## 💻 代码示例

### 在 Controller 中检查会员身份

```java
@RestController
@RequestMapping("/api/vip")
public class VipController {
    
    @Autowired
    private MembershipService membershipService;
    
    @GetMapping("/resume-service")
    public ResponseEntity<?> getResumeService(@RequestAttribute Long userId) {
        // 检查用户是否为活跃会员
        if (!membershipService.isActiveMember(userId)) {
            return ResponseEntity.status(403)
                .body("您还不是会员，请先购买套餐");
        }
        
        // 用户是会员，返回 VIP 内容
        return ResponseEntity.ok("欢迎使用简历优化服务！");
    }
}
```

### 获取用户会员信息

```java
Optional<UserMembership> membership = membershipService.getMembershipInfo(userId);
if (membership.isPresent()) {
    UserMembership m = membership.get();
    System.out.println("到期时间：" + m.getMembershipExpiryTime());
    System.out.println("剩余天数：" + m.getRemainingDays());
}
```

---

## 🧪 测试支付流程

### 模拟支付成功回调

```bash
# 使用 curl 模拟支付宝回调
curl -X POST http://localhost:8080/api/payment/notifyAlipay \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "out_trade_no=ORDER_1234567890&trade_status=TRADE_SUCCESS"
```

### 检查会员表

```sql
-- 查看所有会员
SELECT user_id, membership_expiry_time, created_at, updated_at 
FROM user_memberships;

-- 查看活跃会员（未过期）
SELECT user_id, membership_expiry_time 
FROM user_memberships 
WHERE membership_expiry_time > NOW();

-- 查看已过期会员
SELECT user_id, membership_expiry_time 
FROM user_memberships 
WHERE membership_expiry_time <= NOW();
```

---

## 📊 数据库表结构

### user_memberships 表

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **user_id** | BIGINT (PRI) | 用户 ID（Snowflake） |
| **membership_expiry_time** | DATETIME | 会员到期时间 |
| **created_at** | TIMESTAMP | 首次成为会员的时间 |
| **updated_at** | TIMESTAMP | 最后续费时间 |

---

## 🚀 常见问题

### Q: 用户支付后多久能成为会员？

A: 立刻！支付成功回调后，后端在同一个事务中更新订单和会员表，用户秒级成为会员。

### Q: 用户续费时会发生什么？

A: 后端检查用户是否已在 `user_memberships` 表中。如果存在，则在现有 `membership_expiry_time` 基础上累加 1 年。

### Q: 如何检查用户是否为会员？

A: 调用 `membershipService.isActiveMember(userId)`。如果返回 `true`，说明用户已支付且会员未过期。

### Q: 支持多个会员等级吗？

A: 当前版本仅支持一年期普通会员。如果未来需要多个等级，可以在 `UserMembership` 实体中添加 `tier` 字段。

---

## 📞 需要帮助？

如果启动过程中遇到问题，请检查：

1. **MySQL 是否运行**：`mysql -u root -p -e "SELECT 1;"`
2. **Java 版本**：`java -version`（需要 Java 17+）
3. **Maven 是否安装**：`mvn -version`
4. **数据库表是否创建**：`mysql -u root -p us_job_hunt -e "SHOW TABLES;"`

---

**祝您启动顺利！🎉**
