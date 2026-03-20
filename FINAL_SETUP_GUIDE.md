# 🚀 最终完整启动指南

## 📋 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      用户购买会员                             │
│                  (仅支持一年期普通会员)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    支付宝支付成功                             │
│              (orders.status = 'PAID')                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │   事务级权益同步            │
        │  (Transactional Update)    │
        └────┬───────────────────┬───┘
             │                   │
             ↓                   ↓
    ┌──────────────┐      ┌──────────────────┐
    │  orders 表   │      │ user_memberships │
    │ status=PAID  │      │   表创建/更新    │
    │expires_at=   │      │ expiry_time=     │
    │now+1year     │      │ now+1year        │
    └──────────────┘      └──────────────────┘
             │                   │
             └────────┬──────────┘
                      │
                      ↓
        ┌──────────────────────────┐
        │  用户立刻成为活跃会员     │
        │  (isActiveMember=true)   │
        └──────────────────────────┘
```

---

## ⚡ 一键启动（5 分钟）

### 第 1 步：初始化数据库

#### 选项 A：全新数据库（推荐）
```bash
# 一条命令创建所有表
mysql -u root -p < server-java/src/main/resources/schema-final.sql
```

#### 选项 B：已有数据库（基于之前的步骤）
```bash
# 1. 创建会员表
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

# 2. 同步订单表
mysql -u root -p us_job_hunt < server-java/src/main/resources/migration-finalize-orders.sql
```

### 第 2 步：验证数据库

```sql
-- 检查所有表
SHOW TABLES;

-- 检查表结构
DESCRIBE local_users;
DESCRIBE orders;
DESCRIBE user_memberships;

-- 检查数据一致性
SELECT COUNT(*) FROM local_users;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM user_memberships;
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

## 🔄 完整业务流程

### 1️⃣ 用户浏览定价页面

```
GET /api/payment/plans
↓
返回所有套餐（starter, pro, elite）
但所有套餐都映射到同一个"年度会员"
价格统一为 ¥599
```

### 2️⃣ 用户选择套餐并支付

```
POST /api/payment/createOrder
{
    "planId": "starter",  // 或 "pro", "elite"
    "email": "user@example.com",
    "name": "张三"
}
↓
后端返回：
{
    "orderId": 1765432198765,
    "paymentUrl": "https://alipay.com/...",
    "plan": {
        "id": "annual",
        "name": "年度会员",
        "price": 599,
        "description": "一年期普通会员 - 享受全部 VIP 功能"
    }
}
↓
用户跳转到支付宝支付
```

### 3️⃣ 支付宝回调（自动）

```
支付宝 → POST /api/payment/notifyAlipay
{
    "out_trade_no": "ORDER_1234567890",
    "trade_status": "TRADE_SUCCESS"
}
↓
[事务开始]
├─ 更新 orders：
│  ├─ status = 'PAID'
│  ├─ paid_at = NOW()
│  ├─ plan_name = 'annual'
│  └─ expires_at = NOW() + 1 YEAR
│
└─ 调用 membershipService.grantMembership(userId)
   ├─ 如果用户已是会员：续费（expiry_time += 1 year）
   └─ 如果用户不是会员：创建新记录（expiry_time = now + 1 year）
[事务提交]
↓
用户立刻成为活跃会员
```

### 4️⃣ 用户提交个人信息（支付成功后弹窗）

```
POST /api/payment/updateUserInfo
{
    "orderId": "ORDER_1234567890",
    "bilibiliAccount": "user_bilibili_id",
    "phone": "13800138000"
}
↓
后端更新 orders 表：
├─ bilibili_account = "user_bilibili_id"
├─ phone = "13800138000"
└─ info_submitted = true
↓
前端展示企业微信二维码
```

### 5️⃣ 用户访问 VIP 功能

```
GET /api/vip/resume-service
↓
后端检查：membershipService.isActiveMember(userId)
↓
true  → 返回 VIP 内容
false → 返回 403，提示用户购买会员
```

---

## 💻 代码示例

### 在 Controller 中保护 VIP 接口

```java
@RestController
@RequestMapping("/api/vip")
public class VipController {
    
    @Autowired
    private MembershipService membershipService;
    
    @GetMapping("/resume-optimization")
    public ResponseEntity<?> getResumeService(@RequestAttribute Long userId) {
        // 检查用户是否为活跃会员
        if (!membershipService.isActiveMember(userId)) {
            return ResponseEntity.status(403)
                .body(Map.of(
                    "success", false,
                    "message", "您还不是会员，请先购买套餐"
                ));
        }
        
        // 用户是会员，返回 VIP 内容
        return ResponseEntity.ok(Map.of(
            "success", true,
            "content", "这是简历优化的 VIP 内容"
        ));
    }
}
```

### 获取用户会员信息

```java
@Autowired
private MembershipService membershipService;

// 检查用户是否为活跃会员
boolean isActive = membershipService.isActiveMember(userId);

// 获取会员详细信息
Optional<UserMembership> membership = membershipService.getMembershipInfo(userId);
if (membership.isPresent()) {
    UserMembership m = membership.get();
    System.out.println("到期时间：" + m.getMembershipExpiryTime());
    System.out.println("剩余天数：" + m.getRemainingDays());
}
```

---

## 🧪 测试支付流程

### 使用 curl 模拟支付宝回调

```bash
# 模拟支付成功回调
curl -X POST http://localhost:8080/api/payment/notifyAlipay \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "out_trade_no=ORDER_1234567890&trade_status=TRADE_SUCCESS"
```

### 检查数据库

```sql
-- 查看所有订单
SELECT order_id, user_id, plan_name, status, expires_at FROM orders;

-- 查看所有活跃会员
SELECT user_id, membership_expiry_time, remaining_days 
FROM user_memberships 
WHERE membership_expiry_time > NOW();

-- 查看已过期会员
SELECT user_id, membership_expiry_time 
FROM user_memberships 
WHERE membership_expiry_time <= NOW();

-- 验证订单与会员表的一致性
SELECT 
    o.order_id,
    o.user_id,
    o.expires_at as order_expires_at,
    m.membership_expiry_time,
    CASE 
        WHEN o.expires_at = m.membership_expiry_time THEN '✅ 一致'
        ELSE '❌ 不一致'
    END as consistency
FROM orders o
LEFT JOIN user_memberships m ON o.user_id = m.user_id
WHERE o.status = 'PAID';
```

---

## 📊 数据库表结构

### local_users 表
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INT | Physical ID（唯一索引） |
| **user_id** | BIGINT (PRI) | Snowflake ID（业务主键） |
| email | VARCHAR(320) | 邮箱（唯一） |
| password_hash | VARCHAR(255) | 密码哈希 |
| name | VARCHAR(100) | 用户名 |
| phone | VARCHAR(20) | 电话 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### orders 表
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INT | Physical ID（唯一索引） |
| **order_id** | BIGINT (PRI) | Snowflake ID（业务主键） |
| user_id | BIGINT | 用户 ID（FK） |
| **plan_name** | VARCHAR(50) | 套餐名（统一为 'annual'） |
| price | DECIMAL(10,2) | 价格 |
| status | VARCHAR(50) | 订单状态（PENDING, PAID） |
| transaction_id | VARCHAR(100) | 支付宝交易 ID |
| **expires_at** | TIMESTAMP | 会员到期时间（paid_at + 1 year） |
| created_at | TIMESTAMP | 创建时间 |
| paid_at | TIMESTAMP | 支付时间 |

### user_memberships 表
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **user_id** | BIGINT (PRI) | 用户 ID（FK） |
| **membership_expiry_time** | DATETIME | 会员到期时间 |
| created_at | TIMESTAMP | 首次成为会员 |
| updated_at | TIMESTAMP | 最后续费时间 |

---

## 🎯 关键设计决策

### 1. 为什么所有套餐都指向同一个会员等级？
- **简化业务**：用户只需要选择"购买"，不需要选择"等级"。
- **统一体验**：所有用户都获得相同的 VIP 权益。
- **易于扩展**：未来如果需要多个等级，只需修改 `PRICING_PLANS` 映射。

### 2. 为什么 orders 表和 user_memberships 表都要保存过期时间？
- **订单维度**：`orders.expires_at` 记录该订单对应的会员有效期。
- **用户维度**：`user_memberships.membership_expiry_time` 记录用户当前的会员有效期。
- **对账**：两个表的数据应该保持一致，便于审计和排查问题。

### 3. 为什么使用 Snowflake ID？
- **分布式**：支持未来的多数据中心部署。
- **安全**：订单号难以被枚举，竞争对手无法推断业务数据。
- **高性能**：趋势递增，数据库索引效率高。

---

## 🚨 常见问题

### Q: 用户支付后多久能成为会员？
A: **立刻！** 支付成功回调后，后端在同一个事务中更新订单和会员表，用户秒级成为会员。

### Q: 用户续费时会发生什么？
A: 后端检查 `user_memberships` 表。如果用户已存在，则在现有 `membership_expiry_time` 基础上累加 1 年。

### Q: 如何检查用户是否为会员？
A: 调用 `membershipService.isActiveMember(userId)`。返回 `true` 表示用户已支付且会员未过期。

### Q: 支持多个会员等级吗？
A: 当前版本仅支持一年期普通会员。如果未来需要多个等级，可以在 `UserMembership` 实体中添加 `tier` 字段，并更新 `PRICING_PLANS` 映射。

### Q: 如何处理会员过期？
A: 
- **被动过期**：在查询时，检查 `membership_expiry_time > NOW()`。
- **主动过期**：使用定时任务（Spring Task）每天扫描过期会员。

---

## 📞 需要帮助？

如果启动过程中遇到问题，请按以下顺序检查：

1. **MySQL 是否运行**：`mysql -u root -p -e "SELECT 1;"`
2. **Java 版本**：`java -version`（需要 Java 17+）
3. **Maven 是否安装**：`mvn -version`
4. **数据库表是否创建**：`mysql -u root -p us_job_hunt -e "SHOW TABLES;"`
5. **检查错误日志**：查看 Spring Boot 启动时的控制台输出

---

**祝您启动顺利！🎉**

**最后更新**：2026-03-20  
**版本**：1.0.0（生产就绪）
