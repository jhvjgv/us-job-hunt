# SOP：云服务器部署后端并连接 Supabase（云数据库）

本文档汇总常见问题与操作步骤，**核心目标**：在云服务器上稳定运行 Spring Boot 后端，并**持久保存数据库连接配置**，避免每次手动输入密码。

---

## 一、背景说明

| 概念 | 说明 |
|------|------|
| **Supabase 数据库** | 托管 **PostgreSQL**，不是 MySQL。项目已使用 `DATABASE_URL` 等环境变量连接。 |
| **本地 MySQL** | 仅开发机使用；云上运行时 `localhost` 指云服务器本机，**不会**连到你家里的数据库。 |
| **环境变量持久化** | 数据库密码等放在 **`/etc/us-job-hunt/backend.env`**，由 **systemd** 在启动服务时自动加载，无需每次 `export`。 |

---

## 二、前置条件

- 云服务器：Ubuntu（示例路径 `/root/us-job-hunt`）
- 已安装：**JDK 21**（`java` 与 `javac` 主版本一致）、**Maven 3.6+**
- Supabase 项目已创建，可在 **Connect** 中查看连接信息
- 代码已 `git clone` / `git pull` 到服务器

---

## 三、在 Supabase 获取连接信息

1. 打开 Supabase 项目 → **Project Settings** → **Database**，记录或重置 **Database password**。
2. 打开 **Connect**（或 **Connection info**），选择 **URI**、**Direct connection**（或 **Session pooler**，见下节）。
3. 控制台给出的多为：

   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

4. Spring Boot 需要使用 **JDBC** 形式（注意前缀与 `sslmode`）：

   `jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres?sslmode=require`

### IPv4 与连接方式

若页面提示 **Direct connection 不支持 IPv4**，而云主机仅有 IPv4，请改用 **Session pooler** 的连接串，并以控制台为准填写 **主机、端口、用户名**（有时用户名为 `postgres.xxx`）。再按同样规则写成 `jdbc:postgresql://...` 格式。

---

## 四、持久保存云数据库环境（推荐）

**目的**：把连接信息写在一个文件里，**systemd 每次启动服务时自动读取**，无需每次登录后 `export`。

### 1. 创建目录与文件

```bash
sudo mkdir -p /etc/us-job-hunt
sudo cp /root/us-job-hunt/server-java/deploy/backend.env.example /etc/us-job-hunt/backend.env
sudo nano /etc/us-job-hunt/backend.env
```

### 2. 编辑内容（示例）

```text
DATABASE_URL=jdbc:postgresql://db.wzseyhykuyqjxffdbxwc.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=你的Supabase数据库密码
```

- 将 **主机名**、**密码** 换成你自己的；若使用 Pooler，以 Supabase 页面为准修改 `DATABASE_URL` 与 `DATABASE_USERNAME`。
- `#` 开头的行是注释，可删可留。
- 保存：`Ctrl+O` 回车；退出：`Ctrl+X`。

### 3. 限制文件权限（避免密码被其他用户读取）

```bash
sudo chmod 600 /etc/us-job-hunt/backend.env
```

### 4. 修改连接信息后

**无需**改代码，只需在更新 `backend.env` 后重启服务：

```bash
sudo systemctl restart us-job-hunt-backend
```

---

## 五、后端构建与 systemd 常驻运行

### 1. 打包

```bash
cd /root/us-job-hunt/server-java
mvn clean package -DskipTests
```

确认存在：`target/us-job-hunt-backend-1.0.0.jar`。

### 2. 安装 systemd 单元（首次或单元文件变更时）

```bash
sudo cp /root/us-job-hunt/server-java/deploy/us-job-hunt-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable us-job-hunt-backend
sudo systemctl start us-job-hunt-backend
```

### 3. 查看状态与日志

```bash
sudo systemctl status us-job-hunt-backend
journalctl -u us-job-hunt-backend -n 80 --no-pager
```

期望：`Active: active (running)`，日志中无数据库连接失败。

### 4. 日常更新代码后

```bash
cd /root/us-job-hunt
git pull
cd server-java
mvn clean package -DskipTests
sudo systemctl restart us-job-hunt-backend
```

**数据库密码未变时**，无需再改 `backend.env`。

---

## 六、验证「云服务器真的连上云数据库」

### 方法 A：看服务日志

```bash
journalctl -u us-job-hunt-backend -n 50 --no-pager
```

无 `Connection refused`、`password authentication failed`、`timeout` 等即通常正常。

### 方法 B：本机访问端口（仅说明网络是否通）

```bash
nc -zv db.你的项目.supabase.co 5432
```

### 方法 C：用 psql 直接测账号（最直观）

```bash
sudo apt install -y postgresql-client
PGPASSWORD='你的数据库密码' psql -h db.wzseyhykuyqjxffdbxwc.supabase.co -p 5432 -U postgres -d postgres -c "SELECT 1;"
```

能返回 `1` 即认证与网络成功。

### 方法 D：HTTP 探活（应用已监听时）

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/api/
```

返回非 `000` 一般表示进程在监听（具体 HTTP 码受安全配置影响）。

---

## 七、常见问题与处理

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| `No plugin found for prefix 'spring-boot'` | 在仓库根目录执行 `mvn` | `cd server-java` 再执行 |
| `release version 17 not supported` | JDK 过旧或 `java`/`javac` 混用 | 安装 JDK 17+，`update-alternatives` 对齐；或已用 `pom` 中 `fork`+`javac` 配置 |
| `Unknown lifecycle phase "spring-boot"` | 命令写错 | 使用 `mvn spring-boot:run`（**冒号**） |
| `spring-boot:run` 与数据库相关崩溃 | JDBC URL 中 `characterEncoding=utf8mb4`（已修复为 UTF-8）或连错库 | 使用 PostgreSQL JDBC；检查 Supabase 地址与密码 |
| `inactive (dead)` 且无日志 | 未 `start` | `sudo systemctl start us-job-hunt-backend` |
| 外网访问不到 | 安全组未放行 | 云控制台放行 **8080**（或你配置的端口） |
| **`Connection to localhost:5432 refused`** | 直接执行 `mvn spring-boot:run`，**未带环境变量** | `application.yml` 里默认是 `localhost:5432`；须先 `export DATABASE_*` 或见下方「与 systemd 共用 env 文件」 |

---

## 八、临时调试（不用 systemd）

**重要**：`systemd` 会读 `/etc/us-job-hunt/backend.env`，但你在终端里敲的 **`mvn spring-boot:run` 不会自动读这个文件**。若不带环境变量，程序会退回默认 **`localhost:5432`**，云服务器上通常没有本机 PostgreSQL，就会 **`Connection refused`**。

### 方式 A：手动 export（与 `backend.env` 内容一致）

```bash
export DATABASE_URL='jdbc:postgresql://...'
export DATABASE_USERNAME='postgres'
export DATABASE_PASSWORD='你的密码'
cd /root/us-job-hunt/server-java
mvn spring-boot:run
```

### 方式 B：与 systemd 共用同一份 `backend.env`（推荐）

```bash
cd /root/us-job-hunt/server-java
chmod +x deploy/run-dev-with-env.sh
./deploy/run-dev-with-env.sh
```

脚本会 `source /etc/us-job-hunt/backend.env` 再执行 `mvn spring-boot:run`。

关闭 SSH 后进程通常结束；**生产环境请用 systemd + `backend.env`**。

---

## 九、相关文件

| 路径 | 说明 |
|------|------|
| `server-java/src/main/resources/application.yml` | 数据源读 `DATABASE_*` 环境变量 |
| `server-java/deploy/backend.env.example` | 环境变量模板 |
| `server-java/deploy/us-job-hunt-backend.service` | systemd 单元（含 `EnvironmentFile=/etc/us-job-hunt/backend.env`） |
| `server-java/deploy/run-dev-with-env.sh` | 终端调试时加载同一 `backend.env` 再 `mvn spring-boot:run` |
| `/etc/us-job-hunt/backend.env` | **服务器上**真实密码（不提交 Git） |

---

## 十、修订记录

- 2026-03：初稿（Supabase、PostgreSQL、systemd、IPv4/Pooler、环境变量持久化）。
