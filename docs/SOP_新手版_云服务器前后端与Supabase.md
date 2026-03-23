# 新手版 SOP：让网站在云服务器可访问（前端 + 后端 + Supabase）

这份文档只讲你现在要做的事，不讲原理。  
按顺序做，哪里报错就停在那一步处理。

---

## 0. 你最终要达到的结果

1. 浏览器打开：`http://job.athenaprogramming.com/` 能看到前端页面。  
2. 后端服务状态：`active (running)`。  
3. 后端日志里没有 `Connection to localhost:5432 refused`。

---

## 1. 先准备数据库连接（只做一次）

### 1.1 编辑环境变量文件

```bash
sudo mkdir -p /etc/us-job-hunt
sudo nano /etc/us-job-hunt/backend.env
```

把下面三行填进去（按你自己的 Supabase 信息改）：

```text
DATABASE_URL=jdbc:postgresql://db.wzseyhykuyqjxffdbxwc.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=你的Supabase数据库密码
```

保存并退出：
- 保存：`Ctrl + O`，回车
- 退出：`Ctrl + X`

设置权限：

```bash
sudo chmod 600 /etc/us-job-hunt/backend.env
```

---

## 2. 打包后端并启动（每次后端代码变更后执行）

```bash
cd /root/us-job-hunt/server-java
mvn clean package -DskipTests
sudo systemctl restart us-job-hunt-backend
sudo systemctl status us-job-hunt-backend
```

你应该看到：`Active: active (running)`。

如果不是 running，立刻看日志：

```bash
journalctl -u us-job-hunt-backend -n 80 --no-pager
```

---

## 3. 构建并发布前端（每次前端代码变更后执行）

```bash
cd /root/us-job-hunt
pnpm build
sudo mkdir -p /var/www/us-job-hunt
sudo cp -r /root/us-job-hunt/dist/public/* /var/www/us-job-hunt/
```

检查是否有前端文件：

```bash
ls -la /var/www/us-job-hunt
```

应看到 `index.html` 和 `assets` 目录。

---

## 4. Nginx 配置（只做一次，改错时重做）

编辑：

```bash
sudo nano /etc/nginx/sites-available/default
```

确保 `server_name job.athenaprogramming.com;` 这个 `server {}` 块中有以下关键内容：

```nginx
root /var/www/us-job-hunt;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://127.0.0.1:8080/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

保存后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. 一键检查（打不开时直接跑）

```bash
sudo systemctl status us-job-hunt-backend
journalctl -u us-job-hunt-backend -n 50 --no-pager
sudo nginx -t
curl -I http://127.0.0.1:8080/api/
curl -I http://127.0.0.1/api/
```

如何判断：
- 第 1 条：后端必须 `active (running)`  
- 第 4 条：返回 `200/401/403/404` 都可以（说明后端活着）  
- 第 5 条：不要是 `502`（`502` 说明 Nginx 转发不到后端）

---

## 6. 你这次最容易踩的坑（记住这 4 条）

1. `mvn spring boot:run` 是错的，正确是 `mvn spring-boot:run`。  
2. `mvn spring-boot:run` 默认不读 `/etc/us-job-hunt/backend.env`，会退回 `localhost:5432`。  
3. 前端构建输出目录是 `/root/us-job-hunt/dist/public`，不是 `client/dist`。  
4. Nginx 的 `root` 必须是 `/var/www/us-job-hunt`，不要拼错成 `/va/...` 或多/少字母。

---

## 7. 日常最短流程（你以后基本只用这几条）

```bash
cd /root/us-job-hunt && git pull
cd /root/us-job-hunt/server-java && mvn clean package -DskipTests
sudo systemctl restart us-job-hunt-backend
cd /root/us-job-hunt && pnpm build
sudo cp -r /root/us-job-hunt/dist/public/* /var/www/us-job-hunt/
sudo systemctl reload nginx
```

