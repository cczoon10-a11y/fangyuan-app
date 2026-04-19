# ============================================================================
# Stage 1: 构建
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖(利用 Docker 层缓存)
COPY package*.json ./
# 若有 package-lock.json 用 npm ci,否则 npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 复制源码并构建
COPY . .
RUN npm run build

# 清理,只保留生产依赖
RUN npm prune --production

# ============================================================================
# Stage 2: 运行
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# 运行环境
ENV NODE_ENV=production
ENV TZ=Asia/Phnom_Penh

RUN apk add --no-cache tini tzdata && \
    cp /usr/share/zoneinfo/Asia/Phnom_Penh /etc/localtime && \
    echo "Asia/Phnom_Penh" > /etc/timezone

# 非 root 用户运行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# 上传目录
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/api/v1/health || exit 1
