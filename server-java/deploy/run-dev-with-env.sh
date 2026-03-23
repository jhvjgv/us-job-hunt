#!/usr/bin/env bash
# 本地/SSH 调试：先加载与 systemd 相同的环境文件，再启动 Spring Boot
# 用法：chmod +x deploy/run-dev-with-env.sh && ./deploy/run-dev-with-env.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ -f /etc/us-job-hunt/backend.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source /etc/us-job-hunt/backend.env
  set +a
else
  echo "未找到 /etc/us-job-hunt/backend.env，请先创建并填写 DATABASE_*（见 deploy/backend.env.example）" >&2
  exit 1
fi
exec mvn spring-boot:run
