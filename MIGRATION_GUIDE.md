# US Job Hunt - Node.js 到 Java Spring Boot 迁移指南

本指南详细说明如何将 US Job Hunt 项目从 Node.js + tRPC 后端迁移到 Java Spring Boot 后端。

## 项目结构对比

### 原始项目（Node.js）

```
us-job-hunt/
├── client/              # React 前端
├── server/              # Node.js 后端（tRPC）
├── drizzle/             # 数据库 Schema
├── shared/              # 共享代码
└── package.json
```

### 新项目（Java）

```
us-job-hunt-java-backend/
├── src/main/java/com/usjobhunt/
│   ├── controller/      # REST API 控制器
│   ├── service/         # 业务逻辑
│   ├── entity/          # JPA 实体
│   ├── repository/      # 数据访问
│   ├── dto/             # 数据传输对象
│   ├── util/            # 工具类
│   └── exception/       # 异常处理
├── src/main/resources/
│   ├── application.yml  # 应用配置
│   └── schema.sql       # 数据库初始化
├── pom.xml              # Maven 配置
└── README.md
```

## 迁移步骤

### 第 1 步：准备环境

#### 安装 Java 和 Maven

```bash
# 检查 Java 版本（需要 17+）
java -version

# 检查 Maven 版本（需要 3.6+）
mvn -version
```

#### 安装 MySQL

确保 MySQL 8.0+ 已安装并运行：

```bash
# 启动 MySQL 服务
sudo systemctl start mysql

# 验证连接
mysql -u root -p
```

### 第 2 步：设置数据库

1. **创建数据库**

```sql
CREATE DATABASE us_job_hunt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **初始化表结构**

运行 `us-job-hunt-java-backend/src/main/resources/schema.sql`：

```bash
mysql -u root -p us_job_hunt < schema.sql
```

### 第 3 步：配置后端

1. **编辑 application.yml**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/us_job_hunt
    username: root
    password: your_password

alipay:
  app-id: your_app_id
  merchant-private-key: your_private_key
  alipay-public-key: your_public_key
```

2. **设置环境变量**

```bash
export JWT_SECRET=your_jwt_secret_key
export ALIPAY_APP_ID=your_alipay_app_id
export ALIPAY_MERCHANT_PRIVATE_KEY=your_merchant_private_key
export ALIPAY_PUBLIC_KEY=your_alipay_public_key
```

### 第 4 步：构建并运行后端

```bash
cd us-job-hunt-java-backend

# 构建项目
mvn clean package

# 运行应用
mvn spring-boot:run

# 或直接运行 JAR
java -jar target/us-job-hunt-backend-1.0.0.jar
```

后端将在 `http://localhost:8080` 启动。

### 第 5 步：适配前端

#### 5.1 安装依赖

```bash
cd us-job-hunt/client
npm install
```

#### 5.2 配置 Vite 代理

编辑 `vite.config.ts`：

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

#### 5.3 创建 API 客户端

已提供 `client/src/lib/api.ts`，包含所有 REST API 调用。

#### 5.4 更新页面组件

使用新的 API 客户端替换 tRPC 调用。示例已提供在 `client/src/pages/PricingAdapted.tsx`。

#### 5.5 启动前端开发服务器

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动。

## API 端点映射表

### 认证模块

| 功能 | tRPC 调用 | REST API | 方法 |
|------|----------|---------|------|
| 注册 | `trpc.auth.local.register` | `/api/auth/register` | POST |
| 登录 | `trpc.auth.local.login` | `/api/auth/login` | POST |
| 检查邮箱 | `trpc.auth.local.checkEmailExists` | `/api/auth/check-email` | GET |
| 登出 | `trpc.auth.logout` | `/api/auth/logout` | POST |
| 获取用户 | `trpc.auth.me` | `/api/auth/me` | GET |

### 支付模块

| 功能 | tRPC 调用 | REST API | 方法 |
|------|----------|---------|------|
| 创建订单 | `trpc.payment.createOrder` | `/api/payment/createOrder` | POST |
| 获取订单 | `trpc.payment.getOrder` | `/api/payment/order/{orderId}` | GET |
| 支付回调 | `trpc.payment.notifyAlipay` | `/api/payment/notifyAlipay` | POST |
| 获取方案 | `trpc.payment.getPricingPlans` | `/api/payment/plans` | GET |

## 请求/响应格式对比

### 注册请求

**原始 tRPC：**

```typescript
await trpc.auth.local.register.mutate({
  email: 'user@example.com',
  password: 'SecurePass123',
  name: '张三',
  targetCompanies: ['Google'],
  experienceYears: 3,
});
```

**新 REST API：**

```typescript
await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: '张三',
    targetCompanies: ['Google'],
    experienceYears: 3,
  }),
});
```

### 登录响应

**原始 tRPC：**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "张三"
}
```

**新 REST API：**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "张三",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 认证流程变更

### 原始流程（Cookie 基础）

1. 用户登录
2. 服务器设置 Cookie
3. 后续请求自动包含 Cookie

### 新流程（JWT Token）

1. 用户登录，获得 JWT Token
2. 前端存储 Token 到 localStorage
3. 后续请求在 Authorization 头中包含 Token

**前端实现：**

```typescript
// 登录
const response = await authApi.login({ email, password });
localStorage.setItem('authToken', response.token);

// 后续请求自动添加 Token
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
};
```

## 数据库迁移

### 表结构对比

#### local_users 表

| 字段 | Node.js | Java | 说明 |
|------|---------|------|------|
| id | INT | INT | 主键 |
| email | VARCHAR | VARCHAR | 邮箱 |
| passwordHash | VARCHAR | VARCHAR | 密码哈希 |
| name | VARCHAR | VARCHAR | 用户名 |
| targetCompanies | TEXT | LONGTEXT | JSON 数组 |
| experienceYears | INT | INT | 工作年数 |
| isVerified | BOOLEAN | BOOLEAN | 验证状态 |
| createdAt | TIMESTAMP | TIMESTAMP | 创建时间 |
| updatedAt | TIMESTAMP | TIMESTAMP | 更新时间 |

#### orders 表

| 字段 | Node.js | Java | 说明 |
|------|---------|------|------|
| id | INT | INT | 主键 |
| userId | INT | INT | 用户 ID |
| planName | VARCHAR | VARCHAR | 套餐名 |
| price | DECIMAL | DECIMAL | 价格 |
| currency | VARCHAR | VARCHAR | 货币 |
| status | ENUM | ENUM | 订单状态 |
| paymentMethod | VARCHAR | VARCHAR | 支付方式 |
| transactionId | VARCHAR | VARCHAR | 交易 ID |
| createdAt | TIMESTAMP | TIMESTAMP | 创建时间 |
| paidAt | TIMESTAMP | TIMESTAMP | 支付时间 |
| expiresAt | TIMESTAMP | TIMESTAMP | 过期时间 |

### 数据迁移

如果有现有数据，可以使用 MySQL 导出/导入功能：

```bash
# 导出原数据
mysqldump -u root -p us_job_hunt > backup.sql

# 导入到新数据库
mysql -u root -p us_job_hunt < backup.sql
```

## 测试清单

- [ ] 后端成功启动，访问 `http://localhost:8080/api/payment/plans` 返回定价方案
- [ ] 前端成功启动，访问 `http://localhost:5173`
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 创建订单功能正常
- [ ] 支付宝支付链接生成正确
- [ ] 支付回调处理正确
- [ ] 数据库记录正确保存

## 常见问题

### Q: 如何处理 CORS 错误？

A: 确保 Java 后端的 CORS 配置正确，或在 Vite 中配置代理。

### Q: JWT Token 过期怎么办？

A: 前端检测到 401 错误时，清除 Token 并重定向到登录页面。

### Q: 如何在生产环境部署？

A: 参考 Java 应用的标准部署流程，使用 Docker、Kubernetes 或传统服务器部署。

### Q: 支付宝配置有问题怎么办？

A: 检查 `application.yml` 中的配置，确保 App ID 和私钥正确。可以使用支付宝沙箱环境测试。

## 性能优化建议

1. **数据库索引**：已在 schema.sql 中添加必要索引
2. **缓存**：考虑使用 Redis 缓存定价方案
3. **连接池**：Spring Boot 默认使用 HikariCP，配置已优化
4. **API 响应压缩**：在 application.yml 中启用 Gzip 压缩

## 安全建议

1. **HTTPS**：生产环境必须使用 HTTPS
2. **环境变量**：敏感信息存储在环境变量中
3. **输入验证**：所有输入进行验证和清理
4. **SQL 注入防护**：使用 JPA 参数化查询
5. **XSS 防护**：前端进行输入转义

## 后续改进

1. **添加更多 API 端点**：如用户资料管理、订单历史等
2. **实现邮件验证**：发送验证邮件给新用户
3. **添加管理后台**：管理用户和订单
4. **集成更多支付方式**：微信支付、信用卡等
5. **添加日志系统**：使用 ELK Stack 或 Splunk

## 支持

如有问题，请参考：

- Java Spring Boot 文档：https://spring.io/projects/spring-boot
- MySQL 文档：https://dev.mysql.com/doc/
- 支付宝开放平台：https://open.alipay.com/

## 许可证

MIT
