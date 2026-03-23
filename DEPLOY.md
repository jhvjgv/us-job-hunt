# 雅典娜编程 · 云上部署说明

项目结构：**Vite/React 前端** + **Spring Boot 后端**（`/api` context-path）+ **PostgreSQL**。本地开发时 Vite 把 `/api` 代理到后端；**上线后**前端需通过环境变量指向公网 API。

---

## 1. 定价（与代码一致）

- 当前标价：**39 USD**（后端 `PaymentService` 与前端 `client/src/branding.ts` 中 `PRICE_USD`）。
- 修改价格时：**两处都要改**（或以后抽成同一配置），并重新构建/发布。

---

## 2. 构建前端

在项目根目录：

```bash
pnpm install
# 将 https://你的API域名/api 换成实际后端地址（须含 /api，与 Spring 的 context-path 一致）
set VITE_API_URL=https://api.你的域名.com/api
pnpm run build
```

构建产物在 **`dist/public`**。`pnpm run check` 可在提交前跑类型检查。

Linux/macOS 使用 `export VITE_API_URL=...` 代替 `set`。

---

## 3. 构建与运行后端

```bash
cd server-java
mvn -q clean package -DskipTests
java -jar target/us-job-hunt-backend-1.0.0.jar
```

（若 `artifactId` 不同，以 `target/*.jar` 为准。）

### 必配环境变量（示例）

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | JDBC，如 `jdbc:postgresql://主机:5432/数据库?sslmode=require` |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | 数据库账号 |
| `JWT_SECRET` | 生产环境强随机字符串 |
| `FRONTEND_BASE_URL` | 用户浏览器访问的网站根地址，如 `https://www.你的域名.com`（支付宝同步跳转） |
| `BACKEND_PUBLIC_URL` | 后端根 URL，**无** `/api` 后缀，如 `https://api.你的域名.com`，用于支付宝异步通知地址拼接 |
| `ALIPAY_*` | 支付宝应用配置（见 `server-java/README.md`） |

**CORS**：生产环境需在 `application.yml` 或配置类中把 `cors.allowed-origins` 改成你的前端域名（当前默认含 localhost）。

---

## 4. 常见云上架构（任选）

### A. 一台 VPS（适合个人 / 小流量）

1. 安装 **Nginx**、**PostgreSQL**、**Java 17+**。
2. Nginx：
   - `location /` → `root` 指向前端构建目录 `dist/public`（或拷贝到 `/var/www/athena`）。
   - `location /api/` → `proxy_pass` 到 `http://127.0.0.1:8080/api/`（注意与后端 `context-path` 一致）。
3. 用 **systemd** 托管 `java -jar ...`，设置上述环境变量。
4. **HTTPS**：Let’s Encrypt（certbot）为 Nginx 配证书。

### B. 前端与后端分托管

- **前端**：Vercel / Netlify / Cloudflare Pages / 对象存储 + CDN，上传 `dist/public` 内容；在控制台配置 **`VITE_API_URL`**（构建时注入）或若使用纯静态托管，需在构建命令里传入同一变量。
- **后端**：Railway / Render / Fly.io / 云厂商 PaaS / 容器服务，部署 JAR，并设置数据库与 `FRONTEND_BASE_URL`、`BACKEND_PUBLIC_URL`。

要点：**浏览器只访问 https 前端域名**；**API 域名**需 CORS 允许该前端来源。

---

## 5. 支付与货币说明

- 订单里 `currency` 为 **USD**，标价 **39** 与产品描述一致。
- **支付宝国内产品**多以人民币结算；若你面向海外用户收美元，可后续接入 **Stripe** 等，需另改支付流程。
- 支付宝回调地址 **`BACKEND_PUBLIC_URL`** 必须公网可达且 **HTTPS**（生产环境要求以支付宝文档为准）。

---

## 6. 部署后自检清单

- [ ] 打开首页，无控制台 CORS 报错。
- [ ] `GET https://你的API/api/payment/plans` 返回 **39** 美元方案。
- [ ] 注册 / 登录 / 下单跳转支付（沙箱或小额真单）走通。
- [ ] 支付宝异步通知能打到 `.../api/payment/notifyAlipay`（查后端日志）。

更细的 API 与数据库表结构见 **`server-java/README.md`**。
