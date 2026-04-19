#!/bin/bash
# ============================================================================
# 方·苑 FANGYUAN - 一键启动脚本
# ============================================================================
set -e

cd "$(dirname "$0")/.."
ROOT=$(pwd)

echo "🏠 方·苑 FANGYUAN - 一键启动"
echo "================================"
echo ""

# 检查依赖
command -v docker >/dev/null 2>&1 || {
  echo "❌ 请先安装 Docker: https://docs.docker.com/get-docker/"
  exit 1
}
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || {
  echo "❌ 请先安装 Docker Compose"
  exit 1
}

# .env 文件
if [ ! -f "$ROOT/.env" ]; then
  echo "📝 创建 .env 文件..."
  cp "$ROOT/backend/.env.example" "$ROOT/.env" 2>/dev/null || {
    cat > "$ROOT/.env" << 'EOF'
NODE_ENV=development
DB_USERNAME=fangyuan
DB_PASSWORD=fangyuan_dev_pwd_change_me
DB_DATABASE=fangyuan
DB_PORT=5432
REDIS_PORT=6379
BACKEND_PORT=3000
NGINX_PORT=80
JWT_SECRET=dev_secret_change_in_production_at_least_64_chars_long_123456789abcdef
CORS_ORIGINS=*
EOF
  }
  echo "   ✓ 已生成 .env"
fi

# 选择命令
DC="docker compose"
if ! docker compose version >/dev/null 2>&1; then
  DC="docker-compose"
fi

echo ""
echo "🐳 启动 Docker 服务..."
$DC up -d postgres redis
echo "   等待数据库就绪..."

# 等待 postgres
for i in {1..30}; do
  if $DC exec -T postgres pg_isready -U fangyuan >/dev/null 2>&1; then
    echo "   ✓ PostgreSQL 已就绪"
    break
  fi
  sleep 1
done

# 构建并启动后端
echo ""
echo "🔨 构建后端..."
$DC build backend

echo ""
echo "🚀 启动后端..."
$DC up -d backend nginx

# 等待后端
echo "   等待后端就绪..."
for i in {1..30}; do
  if curl -s http://localhost:3000/api/v1 >/dev/null 2>&1 || curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "   ✓ 后端已就绪"
    break
  fi
  sleep 1
done

# 首次运行:迁移 + 种子
echo ""
echo "📦 执行数据库迁移..."
$DC exec -T backend npm run migration:run 2>&1 | tail -3 || echo "   (若已迁移请忽略此警告)"

echo ""
echo "🌱 注入种子数据..."
$DC exec -T backend node dist/database/seeds/index.js 2>&1 | tail -5 || echo "   (若已注入请忽略此警告)"

echo ""
echo "================================"
echo "✅ 所有服务已启动"
echo "================================"
echo ""
echo "📌 访问地址:"
echo "   • API 网关:  http://localhost"
echo "   • API 直连:  http://localhost:3000/api/v1"
echo "   • Swagger:   http://localhost:3000/api/docs"
echo ""
echo "📌 管理员登录:"
echo "   • 手机号:    +85512000000"
echo "   • 密码:      admin123"
echo ""
echo "📌 常用命令:"
echo "   • 查看日志:   $DC logs -f backend"
echo "   • 停止:       $DC down"
echo "   • 完全清理:   $DC down -v"
echo ""
