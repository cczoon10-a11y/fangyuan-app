-- PostgreSQL 初始化 (Docker 首次启动自动执行)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 字符集
ALTER DATABASE fangyuan SET timezone TO 'Asia/Phnom_Penh';
