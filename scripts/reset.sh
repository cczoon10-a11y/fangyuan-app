#!/bin/bash
cd "$(dirname "$0")/.."
DC="docker compose"
if ! docker compose version >/dev/null 2>&1; then
  DC="docker-compose"
fi
read -p "⚠️ 将删除所有数据,不可恢复!确认?(yes/no): " ans
[ "$ans" = "yes" ] || exit 0
$DC down -v
echo "✓ 已清空所有数据和容器"
