# 方·苑 FANGYUAN · 金边房产 App · 完整项目

> **Flutter + NestJS + PostgreSQL + Docker · v1.0**
> 三端原生 App(用户/经纪人/管理员) · 橙蓝商务配色 · 中英柬三语 · 美元 + 本地货币双计价

---

## 📦 项目结构

```
fangyuan-project/
├── 📄 README.md                      ← 本文档
├── 📄 docker-compose.yml             ← 一键启动所有服务
│
├── 📁 backend/                       ← NestJS 后端(TypeScript)
│   ├── src/
│   │   ├── main.ts                   入口
│   │   ├── app.module.ts             根模块
│   │   ├── auth/                     三端认证(JWT)
│   │   ├── users/ agents/ admins/    三套账户体系
│   │   ├── listings/                 房源(审核/积分联动)
│   │   ├── sections/ areas/          板块/区域
│   │   ├── home-entries/             首页按钮(可视化管理)
│   │   ├── keywords/ filter-options/ 关键字/筛选选项
│   │   ├── favorites/                收藏
│   │   ├── news/                     资讯
│   │   ├── points/ gifts/            积分系统 + 商城
│   │   ├── notifications/            通知
│   │   ├── uploads/                  文件上传
│   │   ├── websocket/                实时推送
│   │   ├── common/                   过滤器/拦截器/DTO
│   │   ├── config/                   TypeORM 配置
│   │   └── database/
│   │       ├── data-source.ts
│   │       ├── migrations/           ← 数据库迁移
│   │       └── seeds/                ← 种子数据
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 mobile-user/                   ← 用户端 Flutter App
│   ├── lib/
│   │   ├── main.dart                 入口
│   │   ├── app/                      应用级组件(MainScaffold)
│   │   ├── core/
│   │   │   ├── theme/                ← 橙蓝主题(可复用)
│   │   │   ├── network/              Dio + Retrofit
│   │   │   ├── router/               go_router 路由
│   │   │   ├── storage/              本地存储
│   │   │   └── i18n/                 多语言
│   │   └── features/
│   │       ├── home/                 首页(动态板块按钮)
│   │       ├── search/               搜索
│   │       ├── listings/             房源列表/详情
│   │       ├── favorites/            收藏
│   │       ├── news/                 资讯
│   │       ├── profile/              个人中心
│   │       └── auth/                 登录/注册
│   ├── pubspec.yaml
│   ├── assets/
│   └── l10n/                         ← 中/英/柬三语文件
│
├── 📁 mobile-admin/                  ← 管理员端 Flutter App
│   ├── lib/ (同上结构)
│   └── pubspec.yaml
│
├── 📁 mobile-agent/                  ← 经纪人端 Flutter App
│   ├── lib/ (同上结构)
│   └── pubspec.yaml
│
├── 📁 docker/                        ← Docker 辅助
│   ├── postgres/init.sql
│   └── nginx/nginx.conf
│
└── 📁 scripts/                       ← 一键脚本
    ├── start.sh                      启动所有服务
    ├── stop.sh                       停止
    └── reset.sh                      清空重建
```

---

## 🚀 快速启动

### 前置要求

- **Docker 20+** + **Docker Compose v2**
- **Node.js 20+**(仅本地调试后端时需要)
- **Flutter 3.16+**(移动端开发必需)

### 一键启动后端

```bash
cd fangyuan-project
chmod +x scripts/*.sh
./scripts/start.sh
```

脚本自动执行:
1. 生成 `.env`(随机 JWT_SECRET 和 DB_PASSWORD)
2. 启动 PostgreSQL / Redis / Backend / Nginx 容器
3. 等待 Postgres 就绪
4. 执行迁移 `npm run migration:run`
5. 注入种子数据 `npm run seed`

### 验证后端

启动后访问:
- **Swagger API 文档**: http://localhost:3000/api/docs
- **API**: http://localhost:3000/api/v1
- **Nginx**: http://localhost/

### 初始管理员账号

```
手机号: +85512000000
密码:   admin123
```

**⚠ 生产部署前务必修改此密码!**

### 停止服务

```bash
./scripts/stop.sh        # 保留数据
./scripts/reset.sh       # 删库重建
```

---

## 📱 移动端开发

### 一次性配置(每个 App)

```bash
# 用户端
cd mobile-user
flutter pub get

# 管理员端
cd mobile-admin
flutter pub get

# 经纪人端
cd mobile-agent
flutter pub get
```

### 运行(真机或模拟器)

```bash
# 用户端
cd mobile-user
flutter run

# 指定设备
flutter devices
flutter run -d <device_id>
```

### 编译发布包

**Android APK**:
```bash
cd mobile-user
flutter build apk --release
# 产物: build/app/outputs/flutter-apk/app-release.apk
```

**Android AAB(上架 Google Play)**:
```bash
flutter build appbundle --release
```

**iOS IPA**(必须 macOS + Xcode):
```bash
cd mobile-user
flutter build ipa --release
# 需配置 ios/Runner.xcworkspace 的签名
```

---

## ⚙️ 环境变量配置

`.env` 示例在 `backend/.env.example`。生产环境**必须修改**:

```env
# ========== 必改 ==========
JWT_SECRET=生成64位随机字符串
DB_PASSWORD=设置强密码

# ========== 第三方服务 ==========
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
FCM_SERVER_KEY=
GOOGLE_MAPS_API_KEY=

# ========== CORS ==========
CORS_ORIGINS=https://yourdomain.com
```

### 移动端配置

三个 App 的 API 地址在 `lib/core/network/api_client.dart`:
```dart
const String kBaseUrl = 'http://10.0.2.2:3000/api/v1';  // Android 模拟器
// const String kBaseUrl = 'http://localhost:3000/api/v1';  // iOS 模拟器
// const String kBaseUrl = 'https://api.fangyuan.com.kh/api/v1';  // 生产
```

Google Maps Key(金边必需):
- Android: `android/app/src/main/AndroidManifest.xml`
- iOS: `ios/Runner/AppDelegate.swift`

Firebase 推送配置:
- Android: 放置 `google-services.json` 到 `android/app/`
- iOS: 放置 `GoogleService-Info.plist` 到 `ios/Runner/`

---

## 🗄 数据库

### 表清单(25 张)

**账户体系**:`users` · `agents` · `admins` · `devices`
**房源**:`listings` · `listing_images`
**分类**:`sections` · `areas` · `keywords` · `amenities` · `filter_options`
**首页**:`home_entries` · `home_layout`
**收藏**:`favorites` · `favorite_groups`
**资讯**:`news` · `news_categories`
**积分**:`points_balance` · `points_history` · `points_rules`
**礼品**:`gifts` · `exchanges`
**其他**:`notifications` · `operation_logs` · `uploads` · `exchange_rates` · `app_config`

### 常用命令

```bash
cd backend

# 生成新迁移
npm run migration:generate -- -n YourMigrationName

# 执行迁移
npm run migration:run

# 回滚
npm run migration:revert

# 种子
npm run seed
```

---

## 🔐 权限体系

### 三套账户完全分离

| 端 | 能做 | 不能做 |
|---|-----|--------|
| **用户(User)** | 浏览、收藏、联系经纪人 | 发布、管理 |
| **经纪人(Agent)** | 发布自己房源(需审核)、编辑、积分商城 | 删除、管理他人 |
| **管理员(Admin)** | 全站最高权限:CRUD 全部资源、审核、内容管理 | - |

### JWT 使用

登录成功后获得 `token`,每次请求带 Header:
```
Authorization: Bearer <token>
```

后端通过 `AllowTypes / AdminOnly / AgentOnly / UserOnly` 装饰器强制隔离。

---

## 💾 核心业务流程(示例)

### 经纪人发布房源 → 审核通过 → 自动发 2 积分

1. 经纪人调 `POST /api/v1/agent/listings`(状态=pending_review)
2. 管理员看到待审核通知
3. 管理员调 `POST /api/v1/admin/listings/:id/approve`
4. 后端在**同一事务**内:
   - 房源状态 → online
   - `points_balance` +2
   - 写 `points_history`
   - 写 `notifications`
   - WebSocket 推送给经纪人
5. 经纪人 App 实时收到通知

### 礼品兑换(原子事务 SELECT FOR UPDATE)

1. 经纪人调 `POST /api/v1/agent/exchanges { gift_id }`
2. 后端在事务内:
   - `SELECT ... FOR UPDATE` 锁定 gift 和 points_balance
   - 校验库存 + 积分充足
   - 扣库存、扣积分、写流水、建兑换记录
3. 管理员收到新兑换通知
4. 管理员调 `POST /api/v1/admin/exchanges/:id/fulfill { tracking_no }`
5. 经纪人收到发货通知

---

## 🧪 本地开发模式(不用 Docker)

只启动 Postgres + Redis 容器,本地直接跑 NestJS:

```bash
# 只启动依赖
docker compose up -d postgres redis

# 本地运行后端(热重载)
cd backend
npm install
cp .env.example .env
# 编辑 .env: DB_HOST=localhost
npm run migration:run
npm run seed
npm run start:dev
```

---

## 📚 完整 API 文档

启动后访问:**http://localhost:3000/api/docs**

主要端点:

```
公共:
  GET  /public/home-entries          首页板块按钮
  GET  /public/sections              板块
  GET  /public/areas                 区域
  GET  /public/keywords              关键字
  GET  /public/filter-options        筛选选项
  GET  /listings                     房源列表
  GET  /listings/:id                 房源详情
  GET  /news                         资讯列表

用户:
  POST /user/auth/sms-code
  POST /user/auth/register
  POST /user/auth/login
  GET  /user/favorites
  POST /user/favorites
  DELETE /user/favorites/:id

经纪人:
  POST /agent/auth/login
  GET  /agent/listings               自己的
  POST /agent/listings               发布(需审核)
  GET  /agent/points/balance
  GET  /agent/gifts
  POST /agent/exchanges              兑换

管理员:
  POST /admin/auth/login
  CRUD /admin/listings               房源全权
  POST /admin/listings/:id/approve   审核通过
  POST /admin/listings/:id/reject    驳回
  CRUD /admin/sections
  CRUD /admin/areas
  CRUD /admin/home-entries
  POST /admin/home-entries/batch-update  可视化保存
  CRUD /admin/keywords
  CRUD /admin/filter-options
  CRUD /admin/gifts
  POST /admin/exchanges/:id/fulfill  核发礼品
  CRUD /admin/news

实时:
  WebSocket /socket.io/realtime
  事件:
    listing_approved
    listing_rejected
    points_changed
    exchange_fulfilled
    new_exchange
```

---

## 🎨 设计系统

### 色彩(橙主蓝辅)

```
主色:
  primary:        #FF7A00 (主橙)
  primaryLight:   #FFB74D
  primaryDark:    #E65100

辅色:
  secondary:      #1976D2 (主蓝)
  secondaryLight: #64B5F6
  secondaryDark:  #0D47A1

功能色:
  success: #2E7D32  warning: #F57C00
  error:   #D32F2F  info:    #0288D1

文字:
  textPrimary:   #1A1F36
  textSecondary: #5E6C84
  textMuted:     #8993A4
```

### 字体

- 中文:PingFang SC(iOS)/ Noto Sans SC(Android)
- 英文:SF Pro(iOS)/ Roboto(Android)
- 柬文:Noto Sans Khmer

---

## 🚢 生产部署

### 云服务器部署步骤

```bash
# 1. 克隆
git clone <your-repo> fangyuan
cd fangyuan

# 2. 配置生产环境变量
cp backend/.env.example backend/.env
vim backend/.env  # 修改 JWT_SECRET / DB_PASSWORD / 第三方 Key

# 3. 修改 docker-compose.yml 中的环境变量(可选)

# 4. 启动
./scripts/start.sh

# 5. 检查
docker compose ps
curl http://localhost/api/v1/public/sections
```

### Nginx + SSL 推荐配置

在云服务器 Nginx 反向代理 Docker 容器(80 端口):
```
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

使用 Let's Encrypt 免费证书(certbot)。

---

## 🧰 技术栈总览

### 后端

| 组件 | 选型 |
|-----|------|
| 语言 | TypeScript |
| 框架 | NestJS 10 |
| ORM | TypeORM 0.3 |
| 数据库 | PostgreSQL 15 |
| 缓存 | Redis 7 |
| 认证 | JWT + Passport |
| 实时 | Socket.IO |
| 文档 | Swagger |
| 限流 | @nestjs/throttler |
| 容器 | Docker |

### 移动端(三个 App)

| 组件 | 选型 |
|-----|------|
| 框架 | Flutter 3.16 |
| 状态 | Riverpod 2 |
| 路由 | go_router |
| 网络 | Dio + Retrofit |
| 图片 | cached_network_image |
| 存储 | hive + secure_storage |
| 地图 | google_maps_flutter |
| 推送 | firebase_messaging |
| 图表 | fl_chart |

---

## ⚠️ 诚实的边界说明(重要)

### 本包提供的是什么

✅ **生产可用的完整脚手架**
- 后端所有模块 + 完整业务逻辑 + Docker 编排 → 可直接运行
- 前端三端 Flutter 项目骨架 + 主题系统 + 核心文件 → 可编译

### 本包的边界

⚠️ **移动端是高质量的"脚手架级"代码**
- 已完成:Flutter 项目结构、主题(橙蓝)、用户端首页/列表等关键页面示例、入口文件
- 需补完:按 PRD 逐页面实现剩下的 UI 业务逻辑(约 30 屏)

这不是"一键产出可发布 App" — 那需要专业团队 8-12 周的工作。我提供的是让团队能立刻开工的**最强起跑线**:
- 不用纠结项目结构
- 不用重写主题系统
- 不用重新设计 API(Swagger 已就绪)
- 不用搭建部署环境

---

## 🐛 常见问题

**Q: docker compose up 失败,提示端口占用**
A: 修改 `.env` 中的 `BACKEND_PORT / DB_PORT / REDIS_PORT / NGINX_PORT`

**Q: 迁移失败 "role fangyuan does not exist"**
A: 删除 postgres 数据卷:`docker compose down -v && ./scripts/start.sh`

**Q: Flutter 提示 Dart SDK 版本不匹配**
A: 确保 Flutter >= 3.16,运行 `flutter upgrade`

**Q: iOS 模拟器连不到后端 localhost**
A: 改为 `http://localhost:3000`;Android 模拟器用 `http://10.0.2.2:3000`;真机用电脑 IP

**Q: Google Maps 不显示**
A: 必须在 Google Cloud Console 启用 Maps SDK for Android / iOS 并配置 API Key

**Q: Firebase 推送不工作**
A: 需要 `google-services.json` 和 `GoogleService-Info.plist`,从 Firebase Console 下载

---

## 📄 许可

本项目源码仅供方·苑 FANGYUAN 内部使用。

---

**© 2026 FANGYUAN · PHNOM PENH**
