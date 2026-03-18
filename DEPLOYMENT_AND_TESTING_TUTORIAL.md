# 🚀 US Job Hunt：Java 后端与支付成功信息收集功能部署及测试教程

本教程将引导您完成 Java Spring Boot 后端的部署、数据库配置、前端适配以及支付成功后信息收集功能的完整测试。

---

## 📋 准备工作

在开始之前，请确保您的本地环境已安装以下工具：
- **Java JDK 17** 或更高版本
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 16+** 和 **npm/pnpm**
- **Git**

---

## 第一阶段：后端部署 (server-java)

### 1. 克隆代码并进入目录
如果您还没有克隆仓库，请执行：
```bash
git clone https://github.com/jhvjgv/us-job-hunt.git
cd us-job-hunt/server-java
```

### 2. 数据库配置
1. **创建数据库**：
   登录 MySQL 并运行：
   ```sql
   CREATE DATABASE us_job_hunt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. **初始化表结构**：
   运行项目中的初始化脚本：
   ```bash
   mysql -u root -p us_job_hunt < src/main/resources/schema.sql
   ```
3. **执行新功能迁移脚本**（添加 B 站账号和手机号字段）：
   ```bash
   mysql -u root -p us_job_hunt < src/main/resources/migration-add-user-info.sql
   ```

### 3. 配置应用属性
编辑 `src/main/resources/application.yml`，填入您的实际配置：
- **数据库连接**：修改 `url`, `username`, `password`
- **JWT 密钥**：设置 `jwt.secret`（建议使用 32 位以上随机字符串）
- **支付宝配置**：填入您的 `app-id`, `merchant-private-key`, `alipay-public-key`

### 4. 编译并运行
```bash
mvn clean package
mvn spring-boot:run
```
后端默认运行在：`http://localhost:8080`

---

## 第二阶段：前端部署 (client)

### 1. 安装依赖
```bash
cd ../client
npm install
```

### 2. 添加企业微信二维码
将您的企业微信二维码图片命名为 **`qrcode-wechat.png`**，并放入以下目录：
`client/public/qrcode-wechat.png`

### 3. 配置路由适配
为了启用新的带弹窗的成功页面，请编辑 `client/src/App.tsx`（或您的路由配置文件）：
1. 导入新页面：
   ```typescript
   import PaymentSuccessWithDialog from '@/pages/PaymentSuccessWithDialog';
   ```
2. 修改路由映射：
   ```tsx
   // 将原来的 /payment/success 路由指向新页面
   <Route path="/payment/success" component={PaymentSuccessWithDialog} />
   ```

### 4. 启动前端
```bash
npm run dev
```
前端默认运行在：`http://localhost:5173`

---

## 第三阶段：功能测试流程

### 1. 测试 API 连接
访问 `http://localhost:8080/api/payment/plans`。
- **预期结果**：返回 JSON 格式的定价方案列表（Starter, Pro, Elite）。

### 2. 模拟完整购买流程
1. **注册/登录**：在前端完成用户注册并登录。
2. **选择套餐**：在 Pricing 页面选择一个套餐（如 Pro），点击购买。
3. **支付跳转**：系统应跳转至支付宝支付页面。
4. **支付成功回调**：
   - **真实环境**：完成支付后，支付宝会回调后端。
   - **测试环境**：您可以手动在浏览器访问成功页模拟（需带上 orderId 参数）：
     `http://localhost:5173/payment/success?orderId=您的订单号`

### 3. 验证信息收集弹窗
1. **弹窗触发**：进入成功页后，约 500ms 后应自动弹出“完善您的信息”对话框。
2. **填写信息**：
   - 输入 B 站账号（如：`jhvjgv_test`）
   - 输入手机号（如：`13800138000`）
3. **提交验证**：
   - 点击提交，观察是否有加载动画。
   - 提交成功后，弹窗应切换至“成功”状态。
4. **查看二维码**：确认弹窗中正确显示了您放入的 `qrcode-wechat.png`。
5. **自动关闭**：等待 3 秒，弹窗应自动关闭。

### 4. 数据库校验
在 MySQL 中运行查询，确认信息已存入：
```sql
SELECT transaction_id, bilibili_account, phone, info_submitted FROM orders WHERE transaction_id = '您的订单号';
```
- **预期结果**：`info_submitted` 为 `1`，且账号和手机号与填写一致。

---

## 🛠️ 常见问题排查 (FAQ)

| 问题 | 原因 | 解决方法 |
| :--- | :--- | :--- |
| **跨域错误 (CORS)** | 前端请求被后端拦截 | 确保 `PaymentController` 上有 `@CrossOrigin` 注解，或在 `vite.config.ts` 配置代理。 |
| **二维码不显示** | 文件路径或名称错误 | 检查 `public/qrcode-wechat.png` 是否存在，注意大小写。 |
| **弹窗未自动弹出** | 订单状态不是 PAID | 检查数据库中该订单的 `status` 是否为 `PAID`。 |
| **手机号提交失败** | 格式校验未通过 | 确保输入的是 11 位中国大陆手机号（以 1 开头）。 |

---

## 📝 维护建议
- **日志监控**：查看 `server-java` 的控制台输出，了解支付回调和信息提交的详细日志。
- **安全建议**：在生产环境部署时，请务必修改 `application.yml` 中的 `jwt.secret`。
- **扩展功能**：如果需要收集更多信息（如微信号、求职意向），可以参考 `UpdateUserInfoRequest.java` 进行扩展。

---
祝您的项目运行顺利！如有疑问请随时联系。
