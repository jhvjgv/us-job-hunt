# US Job Hunt - Java Spring Boot Backend

这是 US Job Hunt 项目的 Java Spring Boot 后端实现，用于替代原始的 Node.js + tRPC 后端。

## 项目概述

本项目是一个为华人程序员打造的美国求职产品介绍网站的后端服务，提供用户认证、订单管理和支付宝集成功能。

## 技术栈

- **框架**：Spring Boot 3.2.0
- **数据库**：MySQL 8.0+
- **ORM**：Spring Data JPA + Hibernate
- **认证**：JWT (JSON Web Token)
- **密码加密**：BCrypt
- **支付集成**：支付宝 SDK
- **构建工具**：Maven
- **Java 版本**：17+

## 项目结构

```
src/main/java/com/usjobhunt/
├── controller/           # REST API 控制器
│   ├── AuthController.java
│   └── PaymentController.java
├── service/              # 业务逻辑层
│   ├── AuthService.java
│   └── PaymentService.java
├── entity/               # JPA 实体类
│   ├── LocalUser.java
│   └── Order.java
├── repository/           # 数据访问层
│   ├── LocalUserRepository.java
│   └── OrderRepository.java
├── dto/                  # 数据传输对象
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── PaymentRequest.java
│   ├── PaymentResponse.java
│   └── PricingPlan.java
├── util/                 # 工具类
│   ├── PasswordUtil.java
│   ├── JwtUtil.java
│   └── AlipayUtil.java
├── exception/            # 异常处理
│   └── GlobalExceptionHandler.java
└── UsJobHuntApplication.java  # 主应用类
```

## 安装和运行

### 前置条件

- Java 17 或更高版本
- Maven 3.6+
- MySQL 8.0+

### 步骤

1. **克隆或下载项目**

```bash
cd us-job-hunt-java-backend
```

2. **配置数据库**

创建 MySQL 数据库：

```sql
CREATE DATABASE us_job_hunt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **配置环境变量**

编辑 `src/main/resources/application.yml`，设置数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/us_job_hunt?useSSL=false&serverTimezone=UTC&characterEncoding=utf8mb4
    username: your_mysql_username
    password: your_mysql_password
```

4. **配置支付宝信息**

在 `application.yml` 中设置支付宝相关配置：

```yaml
alipay:
  app-id: your_alipay_app_id
  merchant-private-key: your_merchant_private_key
  alipay-public-key: your_alipay_public_key
```

或通过环境变量设置：

```bash
export ALIPAY_APP_ID=your_alipay_app_id
export ALIPAY_MERCHANT_PRIVATE_KEY=your_merchant_private_key
export ALIPAY_PUBLIC_KEY=your_alipay_public_key
export JWT_SECRET=your_jwt_secret
```

5. **构建项目**

```bash
mvn clean package
```

6. **运行应用**

```bash
mvn spring-boot:run
```

或

```bash
java -jar target/us-job-hunt-backend-1.0.0.jar
```

应用将在 `http://localhost:8080` 启动。

## API 端点

### 认证相关

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/auth/check-email` | 检查邮箱是否已注册 |
| POST | `/api/auth/logout` | 用户登出 |

### 支付相关

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/payment/createOrder` | 创建订单并生成支付链接 |
| GET | `/api/payment/order/{orderId}` | 获取订单详情 |
| POST | `/api/payment/notifyAlipay` | 支付宝回调通知 |
| GET | `/api/payment/plans` | 获取定价方案列表 |

## API 请求示例

### 用户注册

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "张三",
    "targetCompanies": ["Google", "Meta"],
    "experienceYears": 3
  }'
```

### 用户登录

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 创建订单

```bash
curl -X POST http://localhost:8080/api/payment/createOrder \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "pro",
    "email": "user@example.com",
    "name": "张三"
  }'
```

### 获取定价方案

```bash
curl -X GET http://localhost:8080/api/payment/plans
```

## 数据库 Schema

### local_users 表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| email | VARCHAR(320) | 邮箱，唯一 |
| passwordHash | VARCHAR(255) | 密码哈希 |
| name | VARCHAR(100) | 用户名 |
| phone | VARCHAR(20) | 电话号码 |
| targetCompanies | LONGTEXT | 目标公司（JSON 数组） |
| experienceYears | INT | 工作经验年数 |
| isVerified | BOOLEAN | 是否已验证 |
| verificationToken | VARCHAR(255) | 验证令牌 |
| createdAt | TIMESTAMP | 创建时间 |
| updatedAt | TIMESTAMP | 更新时间 |

### orders 表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| userId | INT | 用户 ID |
| planName | VARCHAR(50) | 套餐名称 |
| price | DECIMAL(10,2) | 价格 |
| currency | VARCHAR(10) | 货币单位 |
| status | ENUM | 订单状态 |
| paymentMethod | VARCHAR(50) | 支付方式 |
| transactionId | VARCHAR(100) | 交易 ID |
| createdAt | TIMESTAMP | 创建时间 |
| paidAt | TIMESTAMP | 支付时间 |
| expiresAt | TIMESTAMP | 过期时间 |

## 定价方案

当前为**单一价位**（美元），`starter` / `pro` / `elite` / `annual` 在业务上均映射同一 `PricingPlan`，标价以 `PaymentService` 为准（例如 **$39 USD**）。`/api/payment/plans` 仅返回一条，避免重复展示。

## 前端适配

前端需要从 tRPC 调用改为 REST API 调用。详见 `FRONTEND_ADAPTATION.md`。

## 安全性考虑

- 所有密码使用 BCrypt 加密
- JWT 令牌用于用户认证
- 支付宝签名验证确保交易安全
- 所有输入进行验证
- CORS 配置限制跨域请求

## 常见问题

### 如何修改 JWT 过期时间？

编辑 `application.yml` 中的 `jwt.expiration` 属性（单位：毫秒）。

### 如何配置支付宝沙箱环境？

修改 `application.yml` 中的 `alipay.gateway-url` 为：

```yaml
alipay:
  gateway-url: https://openapi.alipaydev.com/gateway.do
```

### 如何添加新的 API 端点？

1. 在 `service` 包中创建业务逻辑
2. 在 `controller` 包中创建对应的控制器方法
3. 定义必要的 DTO 类

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request。

## 联系方式

如有问题，请联系项目维护者。
