# 用户信息收集功能说明

## 功能概述

本功能实现了在用户支付成功后，自动弹出一个对话框，收集用户的 B 站账号和手机号，并展示企业微信二维码的完整流程。

## 🎯 功能流程

```
用户完成支付
    ↓
跳转到支付成功页面
    ↓
自动弹出信息收集弹窗
    ↓
用户填写 B 站账号和手机号
    ↓
提交信息到后端
    ↓
显示成功提示和企业微信二维码
    ↓
弹窗自动关闭
```

## 📱 前端实现

### 1. 新增组件：`UserInfoDialog.tsx`

位置：`client/src/components/UserInfoDialog.tsx`

**功能**：
- 显示信息收集对话框
- 验证 B 站账号和手机号
- 提交信息到后端
- 显示成功提示和企业微信二维码

**主要特性**：
- 实时表单验证
- 手机号格式验证（中国大陆）
- 加载状态管理
- 成功后自动关闭

### 2. 更新页面：`PaymentSuccessWithDialog.tsx`

位置：`client/src/pages/PaymentSuccessWithDialog.tsx`

**功能**：
- 显示支付成功页面
- 获取订单信息
- 自动弹出信息收集对话框
- 展示后续步骤和常见问题

**集成点**：
```typescript
// 自动弹出弹窗（如果订单已支付且用户信息未提交）
if (orderData.status === "PAID" && !orderData.infoSubmitted) {
  setTimeout(() => {
    setShowDialog(true);
  }, 500);
}
```

### 3. API 客户端更新：`api.ts`

新增 API 调用方法：

```typescript
paymentApi.updateUserInfo({
  orderId: string;
  bilibiliAccount: string;
  phone: string;
})
```

## 🔧 后端实现

### 1. 数据库更新

**新增字段到 `orders` 表**：

```sql
ALTER TABLE orders ADD COLUMN bilibili_account VARCHAR(100);
ALTER TABLE orders ADD COLUMN phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN info_submitted BOOLEAN DEFAULT FALSE;
```

或运行迁移脚本：
```bash
mysql -u root -p us_job_hunt < server-java/src/main/resources/migration-add-user-info.sql
```

### 2. 实体类更新：`Order.java`

新增字段：
```java
@Column(length = 100)
private String bilibiliAccount;  // Bilibili account

@Column(length = 20)
private String phone;  // Phone number

@Column
private Boolean infoSubmitted = false;  // Whether user info has been submitted
```

### 3. DTO 类：`UpdateUserInfoRequest.java`

```java
@Data
public class UpdateUserInfoRequest {
    @NotBlank(message = "订单 ID 不能为空")
    private String orderId;
    
    @NotBlank(message = "B 站账号不能为空")
    private String bilibiliAccount;
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
}
```

### 4. Service 层：`PaymentService.java`

新增方法：
```java
public Map<String, Object> updateUserInfo(String orderId, String bilibiliAccount, String phone) {
    // 查找订单
    // 更新用户信息
    // 标记信息已提交
    // 返回结果
}
```

### 5. Controller 层：`PaymentController.java`

新增端点：
```
POST /api/payment/updateUserInfo
```

请求体：
```json
{
  "orderId": "ORDER_xxx",
  "bilibiliAccount": "用户的B站账号",
  "phone": "13800138000"
}
```

响应：
```json
{
  "success": true,
  "message": "User info updated successfully"
}
```

## 🖼️ UI 设计

### 信息收集弹窗

```
┌─────────────────────────────────────┐
│  完善您的信息                        │
├─────────────────────────────────────┤
│                                     │
│  B 站账号 *                         │
│  [________________]                 │
│  例如：你的用户名或 UID             │
│                                     │
│  手机号 *                           │
│  [________________]                 │
│  用于企业微信和知识星球邀请         │
│                                     │
│  ℹ️ 提交后，我们会：               │
│  • 将您拉入知识星球社群             │
│  • 通过企业微信与您联系             │
│  • 提供专业的求职指导服务           │
│                                     │
│  [稍后填写]  [提交信息]             │
└─────────────────────────────────────┘
```

### 成功提示

```
┌─────────────────────────────────────┐
│  提交成功！                          │
├─────────────────────────────────────┤
│                                     │
│           ✓ (绿色圆形)              │
│                                     │
│  感谢您的信息提交！                 │
│  我们会尽快通过企业微信与您联系，   │
│  并将您拉入知识星球社群。           │
│                                     │
│  您也可以扫码添加企业微信           │
│  ┌─────────────────┐               │
│  │                 │               │
│  │  [二维码图片]   │               │
│  │                 │               │
│  └─────────────────┘               │
│                                     │
│  窗口将在 3 秒后自动关闭...        │
└─────────────────────────────────────┘
```

## 🔐 验证规则

### B 站账号
- 不能为空
- 支持用户名或 UID

### 手机号
- 不能为空
- 必须是中国大陆手机号格式（11位，以1开头）
- 正则表达式：`^1[3-9]\d{9}$`

## 📋 配置说明

### 1. 企业微信二维码

**位置**：`client/public/qrcode-wechat.png`

需要将您的企业微信二维码图片放在此位置。如果文件不存在，用户会看到一个占位符。

**替换方法**：
1. 获取您的企业微信二维码
2. 将其保存为 PNG 格式
3. 放在 `client/public/` 目录下，命名为 `qrcode-wechat.png`
4. 重启前端应用

### 2. 环境变量

在 `.env` 或 `.env.local` 中配置（可选）：

```env
# 企业微信二维码 URL（如果托管在 CDN 上）
VITE_WECHAT_QR_CODE_URL=https://your-cdn.com/qrcode-wechat.png
```

## 🚀 部署步骤

### 1. 后端部署

```bash
# 1. 进入后端目录
cd server-java

# 2. 重新编译
mvn clean compile

# 3. 执行数据库迁移
mysql -u root -p us_job_hunt < src/main/resources/migration-add-user-info.sql

# 4. 重启应用
mvn spring-boot:run
```

### 2. 前端部署

```bash
# 1. 进入前端目录
cd client

# 2. 更新路由（如果使用新的 PaymentSuccessWithDialog 页面）
# 在 App.tsx 中更新路由配置

# 3. 重新构建
npm run build

# 4. 启动开发服务器
npm run dev
```

## 📊 数据查询

### 查看已提交信息的订单

```sql
SELECT id, user_id, plan_name, bilibili_account, phone, info_submitted, created_at
FROM orders
WHERE info_submitted = TRUE
ORDER BY created_at DESC;
```

### 查看未提交信息的订单

```sql
SELECT id, user_id, plan_name, info_submitted, created_at
FROM orders
WHERE status = 'PAID' AND info_submitted = FALSE
ORDER BY created_at DESC;
```

## 🐛 常见问题

### Q: 企业微信二维码不显示怎么办？

A: 检查以下几点：
1. 确保 `client/public/qrcode-wechat.png` 文件存在
2. 确保文件格式正确（PNG）
3. 检查浏览器控制台是否有错误信息
4. 尝试清除浏览器缓存

### Q: 手机号验证失败怎么办？

A: 确保输入的是有效的中国大陆手机号（11位，以1开头）。如需支持其他地区，修改正则表达式。

### Q: 如何修改弹窗的自动关闭时间？

A: 在 `UserInfoDialog.tsx` 中修改：
```typescript
setTimeout(() => {
  onSuccess();
  onClose();
}, 3000);  // 改为需要的毫秒数
```

### Q: 如何让弹窗不自动弹出？

A: 在 `PaymentSuccessWithDialog.tsx` 中注释掉：
```typescript
// setTimeout(() => {
//   setShowDialog(true);
// }, 500);
```

## 📈 后续改进

1. **邮件通知**：提交信息后发送确认邮件
2. **短信通知**：通过短信通知用户已收到信息
3. **自动拉群**：自动将用户拉入知识星球和企业微信
4. **信息编辑**：允许用户编辑已提交的信息
5. **数据导出**：导出所有用户提交的信息为 Excel

## 📞 技术支持

如有问题，请：
1. 查看本文档
2. 检查浏览器控制台错误
3. 查看后端日志
4. 提交 GitHub Issue

---

**最后更新**：2026-03-18  
**版本**：1.0.0
