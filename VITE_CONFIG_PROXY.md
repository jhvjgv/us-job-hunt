# Vite 代理配置指南

为了在开发环境中避免 CORS 问题，需要在 Vite 配置中添加 API 代理。

## 修改 vite.config.ts

打开 `vite.config.ts`，添加以下代理配置：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
```

## 环境变量配置

### 开发环境 (.env.development)

```env
VITE_API_URL=http://localhost:5173/api
```

### 生产环境 (.env.production)

```env
VITE_API_URL=https://your-production-domain.com/api
```

## 使用方法

在前端代码中，API 调用会自动使用配置的 `VITE_API_URL`：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

## 启动开发服务器

```bash
npm run dev
```

此时，前端运行在 `http://localhost:5173`，所有 `/api` 请求会被代理到 `http://localhost:8080`。

## 生产环境部署

在生产环境中，通常有两种方式：

### 方式 1：同源部署

将前端和后端部署在同一个域名下，后端服务器配置 `/api` 路由指向 Java 应用。

### 方式 2：CORS 配置

确保 Java 后端的 CORS 配置允许前端的域名：

```yaml
cors:
  allowed-origins: https://your-frontend-domain.com
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: '*'
  allow-credentials: true
  max-age: 3600
```

## 常见问题

### Q: 为什么需要代理？

A: 在开发环境中，前端运行在 `localhost:5173`，后端运行在 `localhost:8080`，这是跨域请求。代理可以避免 CORS 问题。

### Q: 生产环境需要代理吗？

A: 不需要。通常通过 Nginx 或其他反向代理服务器来处理，或者前后端部署在同一个域名下。

### Q: 如何调试 API 请求？

A: 在浏览器开发者工具的 Network 标签中查看请求，或使用 Postman 直接测试后端 API。
