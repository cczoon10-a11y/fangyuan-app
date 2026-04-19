#!/bin/bash
cd "$(dirname "$0")/.."
DC="docker compose"
if ! docker compose version >/dev/null 2>&1; then
  DC="docker-compose"
fi
$DC down
echo "✓ 已停止所有服务"
