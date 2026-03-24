# 雅典娜编程部署（双子域名）

## 目标
- member.athenaprogramming.com：$1 入口站（站内路由 `/price`）
- job.athenaprogramming.com：$39 体系课站（站内 `/pricing`，或可选外部结账）

## 前端构建
```bash
pnpm install
set VITE_API_URL=/api
set VITE_SITE_ENTRY=
set VITE_MEMBER_SITE_ORIGIN=https://member.athenaprogramming.com
set VITE_JOB_SITE_ORIGIN=https://job.athenaprogramming.com
set VITE_FULL_PROGRAM_CHECKOUT_URL=
pnpm run build
```

说明：
- `$1` 不再依赖外链，Join 统一进 member 站内 `/price`。
- `$39` 若不填 `VITE_FULL_PROGRAM_CHECKOUT_URL`，按钮走站内 `/pricing`。

## Nginx 关键点
- 两个子域名各用一个独立的 `server { }`，`server_name` 分别为 `member.athenaprogramming.com` 与 `job.athenaprogramming.com`，避免重复声明导致 `conflicting server name … ignored`。
- 两个块共用同一前端目录（同一个 `dist/public` 部署路径，示例里为 `/var/www/us-job-hunt`）。
- `/api` 反代到 Spring Boot（`http://127.0.0.1:8080/api/`）。
- SPA 必须 `try_files $uri $uri/ /index.html`。

仓库内现成示例（可复制到服务器后再 `nginx -t` / reload）：

`deploy/nginx/athenaprogramming-dual-server.conf`

启用前请检查 `sites-enabled`：不要有多余文件仍对同一域名再写一遍 `server_name`。

## 验收
1. 打开 https://member.athenaprogramming.com 显示 $1 首页。
2. 点 Join Now 到 https://member.athenaprogramming.com/price。
3. 打开 https://job.athenaprogramming.com 显示 $39 页面。
4. 点 $39 按钮进入 `/pricing`（或你配置的外部结账页）。
