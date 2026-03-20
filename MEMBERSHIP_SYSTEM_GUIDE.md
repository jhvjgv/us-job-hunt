# 🎯 会员权益系统设计文档

## 概述

本文档说明了如何实现一个**企业级的会员权益管理系统**。核心设计理念是：

1.  **表解耦**：独立的 `user_memberships` 表，与订单表分离。
2.  **事务驱动**：支付成功后，通过数据库事务同步更新订单表和会员表。
3.  **高性能**：查询用户权益时，只需查询会员表，无需关联订单表。
4.  **强一致性**：使用 `@Transactional` 确保两个表的数据同步。

---

## 📊 表结构设计

### user_memberships 表

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| **user_id** | BIGINT (PRI) | 用户唯一标识（Snowflake ID） |
| **membership_tier** | VARCHAR(50) | 会员等级（BRONZE, SILVER, GOLD, PLATINUM） |
| **membership_expiry_time** | DATETIME | 会员到期时间 |
| **vip_status** | VARCHAR(50) | VIP 状态（ACTIVE, INACTIVE, EXPIRED） |
| **last_purchase_order_id** | BIGINT | 最后一次购买的订单 ID（用于对账） |
| **created_at** | TIMESTAMP | 首次成为会员的时间 |
| **updated_at** | TIMESTAMP | 最后一次权益更新时间 |

### 会员等级定义

| 等级 | 英文名 | 对应套餐 | 有效期 | 权益 |
| :--- | :--- | :--- | :--- | :--- |
| **青铜会员** | BRONZE | Starter | 1 个月 | 基础求职辅导 |
| **白银会员** | SILVER | Pro | 3 个月 | 专业求职辅导 |
| **黄金会员** | GOLD | Elite | 12 个月 | 精英求职辅导 |
| **铂金会员** | PLATINUM | 自定义 | 自定义 | VIP 专属权益 |

---

## 🔄 支付流程与权益同步

### 完整流程图

```
用户支付
    ↓
支付宝回调 (notifyAlipay)
    ↓
[事务开始]
    ├─ 更新 orders 表：status = 'PAID'
    ├─ 更新 orders 表：paid_at = NOW()
    └─ 调用 membershipService.grantMembership()
        ├─ 查询 user_memberships 表
        ├─ 如果用户已是会员 → 续费（expiryTime 累加）
        └─ 如果用户不是会员 → 创建新记录
[事务提交]
    ↓
用户立即获得会员权益
```

### 核心代码示例

在 `PaymentService.notifyAlipay()` 中：

```java
@Transactional  // 🔑 关键：使用事务注解
public Map<String, Object> notifyAlipay(Map<String, String> params) {
    // ... 验证支付状态 ...
    
    Order order = orderOpt.get();
    order.setStatus(Order.OrderStatus.PAID);
    order.setPaidAt(LocalDateTime.now());
    orderRepository.save(order);
    
    // 🎯 核心逻辑：支付成功后，立即发放会员权益
    // 这是一个原子操作，两个数据库写入在同一个事务中
    membershipService.grantMembership(
        order.getUserId(),
        order.getPlanName(),
        order.getOrderId()
    );
    
    return Map.of("success", true, "message", "Order updated successfully");
}
```

---

## 💡 会员续费逻辑

### 场景 1：用户首次购买

```
用户购买 Pro 套餐（3 个月）
    ↓
user_memberships 表插入新记录：
{
    user_id: 1765432198765,
    membership_tier: 'SILVER',
    membership_expiry_time: 2026-06-20 14:30:00,  // NOW() + 3 months
    vip_status: 'ACTIVE'
}
```

### 场景 2：用户续费

```
用户已是会员，到期时间是 2026-06-20
用户再次购买 Pro 套餐（3 个月）
    ↓
user_memberships 表更新：
{
    membership_expiry_time: 2026-09-20 14:30:00,  // 原有时间 + 3 months
    vip_status: 'ACTIVE'
}
```

### 场景 3：用户升级套餐

```
用户已是 BRONZE（1 个月），到期时间是 2026-04-20
用户升级到 GOLD（12 个月）
    ↓
user_memberships 表更新：
{
    membership_tier: 'GOLD',  // 升级等级
    membership_expiry_time: 2027-04-20 14:30:00,  // 原有时间 + 12 months
    vip_status: 'ACTIVE'
}
```

---

## 🛠️ 使用 MembershipService

### 1. 检查用户是否为活跃会员

```java
@Autowired
private MembershipService membershipService;

// 在 Controller 或其他 Service 中使用
if (membershipService.isActiveMember(userId)) {
    // 用户是活跃会员，可以访问 VIP 功能
} else {
    // 用户不是会员，提示升级
}
```

### 2. 获取用户会员等级

```java
UserMembership.MembershipTier tier = membershipService.getUserMembershipTier(userId);
if (tier != null) {
    System.out.println("用户会员等级：" + tier.getDisplayName());
} else {
    System.out.println("用户不是会员");
}
```

### 3. 检查用户是否为特定等级会员

```java
// 检查用户是否为黄金会员或以上
if (membershipService.isMemberOfTier(userId, UserMembership.MembershipTier.GOLD)) {
    // 用户可以访问黄金会员功能
}
```

### 4. 获取用户会员详细信息

```java
Optional<UserMembership> membership = membershipService.getMembershipInfo(userId);
if (membership.isPresent()) {
    UserMembership m = membership.get();
    System.out.println("等级：" + m.getMembershipTier().getDisplayName());
    System.out.println("到期时间：" + m.getMembershipExpiryTime());
    System.out.println("剩余天数：" + m.getRemainingDays());
}
```

---

## 📋 部署步骤

### 第一步：执行数据库脚本

```bash
# 创建 user_memberships 表
mysql -u root -p us_job_hunt < server-java/src/main/resources/migration-add-user-memberships.sql
```

### 第二步：验证表创建

```sql
-- 检查表是否创建成功
DESCRIBE user_memberships;

-- 检查是否有现有会员记录（如果您有已支付的订单）
SELECT * FROM user_memberships LIMIT 5;
```

### 第三步：编译并启动后端

```bash
cd server-java
mvn clean compile
mvn spring-boot:run
```

---

## 🔍 常见问题

### Q: 为什么要独立的 user_memberships 表？

A: 
1. **性能**：查询用户权益时，只需查询一张小表，速度快。
2. **解耦**：会员表与订单表逻辑分离，便于维护和扩展。
3. **缓存友好**：会员信息可以轻松缓存到 Redis。
4. **对账**：`last_purchase_order_id` 字段方便与订单表对账。

### Q: 如果支付成功但会员表更新失败怎么办？

A: 使用 `@Transactional` 注解，如果会员表更新失败，整个事务会回滚，订单状态也会恢复为 PENDING。这确保了**强一致性**。

### Q: 用户可以同时拥有多个会员吗？

A: 不可以。`user_memberships` 表以 `user_id` 为主键，一个用户只能有一条记录。如果用户续费或升级，只会更新现有记录。

### Q: 如何处理会员过期？

A: 有两种方式：
1. **被动过期**：在查询时，检查 `membership_expiry_time > NOW()`。
2. **主动过期**：使用定时任务（Spring Task）每天扫描过期会员，更新 `vip_status` 为 `EXPIRED`。

### Q: 支持多个订阅吗（如月卡 + 年卡同时持有）？

A: 当前设计不支持。如果需要支持，可以修改 `user_memberships` 表为一对多关系（添加自增 ID），但这会增加复杂性。

---

## 📈 后续扩展

### 1. 会员等级权益细节化

创建 `membership_benefits` 表，存储每个等级的具体权益：

```sql
CREATE TABLE membership_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier VARCHAR(50),
    benefit_name VARCHAR(100),
    benefit_value VARCHAR(255)
);
```

### 2. 会员续费提醒

在用户登录时，检查会员是否即将过期（如 7 天内），发送提醒。

### 3. 会员降级处理

如果用户购买的新套餐等级低于现有等级，保持原有等级，但重新计算过期时间。

### 4. 会员积分系统

为每个会员等级分配不同的积分，用于兑换额外权益。

### 5. Redis 缓存集成

将会员信息缓存到 Redis，减少数据库查询：

```java
@Cacheable(value = "memberships", key = "#userId")
public Optional<UserMembership> getMembershipInfo(Long userId) {
    return membershipRepository.findByUserId(userId);
}
```

---

## 📚 相关文档

- [USERID_REFACTORING_GUIDE.md](./USERID_REFACTORING_GUIDE.md) - 用户 ID 重构指南
- [ORDERID_REFACTORING_GUIDE.md](./ORDERID_REFACTORING_GUIDE.md) - 订单 ID 重构指南
- [DEPLOYMENT_AND_TESTING_TUTORIAL.md](./DEPLOYMENT_AND_TESTING_TUTORIAL.md) - 部署和测试教程

---

**更新时间**：2026-03-20  
**版本**：1.0.0
