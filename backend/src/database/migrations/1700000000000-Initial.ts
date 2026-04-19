import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700000000000 implements MigrationInterface {
  name = 'Initial1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== 扩展 ==========
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);

    // ========== users 普通用户 ==========
    await queryRunner.query(`
      CREATE TABLE users (
        id BIGSERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        nickname VARCHAR(50),
        avatar_url VARCHAR(500),
        gender SMALLINT DEFAULT 0,
        language VARCHAR(10) DEFAULT 'zh-CN',
        is_vip BOOLEAN DEFAULT false,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_users_phone ON users(phone)`);
    await queryRunner.query(`CREATE INDEX idx_users_created_at ON users(created_at)`);

    // ========== admins 管理员 ==========
    await queryRunner.query(`
      CREATE TABLE admins (
        id BIGSERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        name VARCHAR(50) NOT NULL,
        avatar_url VARCHAR(500),
        role VARCHAR(20) DEFAULT 'operator',
        permissions JSONB,
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== agents 经纪人 ==========
    await queryRunner.query(`
      CREATE TABLE agents (
        id BIGSERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        name VARCHAR(50) NOT NULL,
        avatar_url VARCHAR(500),
        organization VARCHAR(100),
        experience_years INT DEFAULT 0,
        bio TEXT,
        skill_areas INT[] DEFAULT '{}',
        level VARCHAR(20) DEFAULT 'normal',
        status VARCHAR(20) DEFAULT 'pending',
        rejection_reason TEXT,
        id_card_front_url VARCHAR(500),
        id_card_back_url VARCHAR(500),
        license_url VARCHAR(500),
        rating NUMERIC(3,1) DEFAULT 0,
        service_count INT DEFAULT 0,
        listings_count INT DEFAULT 0,
        approved_at TIMESTAMPTZ,
        approved_by BIGINT REFERENCES admins(id),
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_agents_phone ON agents(phone)`);
    await queryRunner.query(`CREATE INDEX idx_agents_status ON agents(status)`);
    await queryRunner.query(`CREATE INDEX idx_agents_level ON agents(level)`);

    // ========== sections 四大板块 ==========
    await queryRunner.query(`
      CREATE TABLE sections (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        subtitle VARCHAR(100),
        description TEXT,
        icon VARCHAR(20),
        icon_url VARCHAR(500),
        theme_color VARCHAR(20),
        banner_url VARCHAR(500),
        is_enabled BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT true,
        show_count BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        listings_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== areas 区域 ==========
    await queryRunner.query(`
      CREATE TABLE areas (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        name_km VARCHAR(50),
        description VARCHAR(200),
        description_en VARCHAR(200),
        icon VARCHAR(20),
        latitude NUMERIC(10,6),
        longitude NUMERIC(10,6),
        level VARCHAR(20) DEFAULT 'normal',
        is_hot BOOLEAN DEFAULT false,
        is_enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        listings_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_areas_enabled_hot ON areas(is_enabled, is_hot, sort_order)`);

    // ========== listings 房源 ==========
    await queryRunner.query(`
      CREATE TABLE listings (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        title_en VARCHAR(200),
        title_km VARCHAR(200),
        description TEXT,
        description_en TEXT,
        description_km TEXT,
        section_id BIGINT REFERENCES sections(id),
        area_id BIGINT REFERENCES areas(id),
        bedroom VARCHAR(10),
        bathroom SMALLINT,
        area_sqm NUMERIC(10,2),
        floor VARCHAR(20),
        orientation VARCHAR(10),
        price NUMERIC(15,2) NOT NULL,
        price_usd NUMERIC(15,2) NOT NULL,
        price_khr NUMERIC(20,2),
        price_cny NUMERIC(15,2),
        price_per_sqm NUMERIC(10,2),
        currency VARCHAR(10) DEFAULT 'USD',
        ownership VARCHAR(50),
        developer VARCHAR(100),
        completion_year INT,
        property_fee NUMERIC(8,2),
        indoor_amenities INT[] DEFAULT '{}',
        nearby_amenities INT[] DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        latitude NUMERIC(10,6),
        longitude NUMERIC(10,6),
        address VARCHAR(200),
        landmark VARCHAR(100),
        nearby_poi JSONB,
        cover_image VARCHAR(500),
        images_count INT DEFAULT 0,
        has_vr BOOLEAN DEFAULT false,
        has_video BOOLEAN DEFAULT false,
        vr_url VARCHAR(500),
        video_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'draft',
        rejection_reason TEXT,
        reviewed_at TIMESTAMPTZ,
        reviewed_by BIGINT REFERENCES admins(id),
        publisher_type VARCHAR(10) NOT NULL,
        publisher_id BIGINT NOT NULL,
        badges TEXT[] DEFAULT '{}',
        is_featured BOOLEAN DEFAULT false,
        featured_order INT,
        view_count INT DEFAULT 0,
        favorite_count INT DEFAULT 0,
        contact_count INT DEFAULT 0,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_listings_status ON listings(status) WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE INDEX idx_listings_section ON listings(section_id) WHERE status='online'`);
    await queryRunner.query(`CREATE INDEX idx_listings_area ON listings(area_id) WHERE status='online'`);
    await queryRunner.query(`CREATE INDEX idx_listings_price ON listings(price_usd) WHERE status='online'`);
    await queryRunner.query(`CREATE INDEX idx_listings_publisher ON listings(publisher_type, publisher_id)`);
    await queryRunner.query(`CREATE INDEX idx_listings_featured ON listings(is_featured, featured_order) WHERE status='online'`);
    await queryRunner.query(`CREATE INDEX idx_listings_published_at ON listings(published_at DESC) WHERE status='online'`);

    // ========== listing_images ==========
    await queryRunner.query(`
      CREATE TABLE listing_images (
        id BIGSERIAL PRIMARY KEY,
        listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        url VARCHAR(500) NOT NULL,
        type VARCHAR(20),
        caption VARCHAR(200),
        sort_order INT DEFAULT 0,
        is_cover BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_listing_images_listing ON listing_images(listing_id, sort_order)`);

    // ========== keywords 关键字 ==========
    await queryRunner.query(`
      CREATE TABLE keywords (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        name_km VARCHAR(50),
        type VARCHAR(20) DEFAULT 'hot_search',
        style VARCHAR(20) DEFAULT 'gold',
        show_on_home BOOLEAN DEFAULT false,
        show_on_search BOOLEAN DEFAULT true,
        is_enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        related_listings_count INT DEFAULT 0,
        monthly_searches INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== amenities 配套 ==========
    await queryRunner.query(`
      CREATE TABLE amenities (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        name_km VARCHAR(50),
        icon VARCHAR(20),
        type VARCHAR(20) NOT NULL,
        is_enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== filter_options 筛选选项 ==========
    await queryRunner.query(`
      CREATE TABLE filter_options (
        id BIGSERIAL PRIMARY KEY,
        category VARCHAR(30) NOT NULL,
        label VARCHAR(50) NOT NULL,
        label_en VARCHAR(50),
        label_km VARCHAR(50),
        value_min NUMERIC(15,2),
        value_max NUMERIC(15,2),
        value_str VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        is_hot BOOLEAN DEFAULT false,
        is_enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        monthly_clicks INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_filter_options_category ON filter_options(category, sort_order)`);

    // ========== home_entries 首页板块按钮 ==========
    await queryRunner.query(`
      CREATE TABLE home_entries (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        name_km VARCHAR(50),
        icon VARCHAR(20),
        icon_url VARCHAR(500),
        bg_color VARCHAR(20) NOT NULL,
        badge VARCHAR(20),
        jump_type VARCHAR(20) NOT NULL,
        jump_target VARCHAR(500),
        jump_extra JSONB,
        is_enabled BOOLEAN DEFAULT true,
        login_required BOOLEAN DEFAULT false,
        show_count BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 50,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_home_entries_enabled ON home_entries(is_enabled, sort_order)`);

    // ========== home_layout 布局配置 ==========
    await queryRunner.query(`
      CREATE TABLE home_layout (
        id SMALLSERIAL PRIMARY KEY,
        layout VARCHAR(20) DEFAULT '4-column',
        entries_per_row INT DEFAULT 4,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== favorites ==========
    await queryRunner.query(`
      CREATE TABLE favorite_groups (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        sort_order INT DEFAULT 50,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE favorites (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        group_id BIGINT REFERENCES favorite_groups(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, listing_id)
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC)`);

    // ========== news ==========
    await queryRunner.query(`
      CREATE TABLE news_categories (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        name_en VARCHAR(50),
        sort_order INT DEFAULT 50,
        is_enabled BOOLEAN DEFAULT true
      )
    `);
    await queryRunner.query(`
      CREATE TABLE news (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        title_en VARCHAR(200),
        title_km VARCHAR(200),
        summary VARCHAR(500),
        summary_en VARCHAR(500),
        content TEXT NOT NULL,
        content_en TEXT,
        content_km TEXT,
        cover_image VARCHAR(500),
        category_id BIGINT REFERENCES news_categories(id),
        tags TEXT[] DEFAULT '{}',
        author_id BIGINT REFERENCES admins(id),
        status VARCHAR(20) DEFAULT 'draft',
        is_featured BOOLEAN DEFAULT false,
        is_top BOOLEAN DEFAULT false,
        published_at TIMESTAMPTZ,
        view_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_news_status ON news(status, published_at DESC)`);

    // ========== points ==========
    await queryRunner.query(`
      CREATE TABLE points_balance (
        agent_id BIGINT PRIMARY KEY REFERENCES agents(id),
        balance INT DEFAULT 0,
        lifetime_earned INT DEFAULT 0,
        lifetime_spent INT DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE points_history (
        id BIGSERIAL PRIMARY KEY,
        agent_id BIGINT NOT NULL REFERENCES agents(id),
        delta INT NOT NULL,
        balance_after INT NOT NULL,
        type VARCHAR(30) NOT NULL,
        related_id BIGINT,
        description TEXT,
        admin_id BIGINT REFERENCES admins(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_points_history_agent ON points_history(agent_id, created_at DESC)`);
    await queryRunner.query(`
      CREATE TABLE points_rules (
        id BIGSERIAL PRIMARY KEY,
        action VARCHAR(30) UNIQUE NOT NULL,
        points INT NOT NULL,
        description TEXT,
        is_enabled BOOLEAN DEFAULT true,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== gifts ==========
    await queryRunner.query(`
      CREATE TABLE gifts (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_en VARCHAR(100),
        description TEXT,
        image_url VARCHAR(500),
        category VARCHAR(30),
        points_cost INT NOT NULL,
        stock INT DEFAULT 0,
        tags TEXT[] DEFAULT '{}',
        is_enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 50,
        total_exchanged INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE exchanges (
        id BIGSERIAL PRIMARY KEY,
        agent_id BIGINT NOT NULL REFERENCES agents(id),
        gift_id BIGINT NOT NULL REFERENCES gifts(id),
        gift_snapshot JSONB NOT NULL,
        points_cost INT NOT NULL,
        status VARCHAR(30) DEFAULT 'pending_fulfillment',
        tracking_no VARCHAR(100),
        fulfilled_by BIGINT REFERENCES admins(id),
        fulfilled_at TIMESTAMPTZ,
        received_at TIMESTAMPTZ,
        cancelled_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_exchanges_agent ON exchanges(agent_id, created_at DESC)`);

    // ========== notifications ==========
    await queryRunner.query(`
      CREATE TABLE notifications (
        id BIGSERIAL PRIMARY KEY,
        recipient_type VARCHAR(10) NOT NULL,
        recipient_id BIGINT NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        body TEXT,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_notifications_recipient ON notifications(recipient_type, recipient_id, created_at DESC)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_unread ON notifications(recipient_type, recipient_id) WHERE is_read=false`);

    // ========== devices ==========
    await queryRunner.query(`
      CREATE TABLE devices (
        id BIGSERIAL PRIMARY KEY,
        owner_type VARCHAR(10) NOT NULL,
        owner_id BIGINT NOT NULL,
        fcm_token VARCHAR(500) UNIQUE NOT NULL,
        platform VARCHAR(10) NOT NULL,
        locale VARCHAR(10),
        app_version VARCHAR(20),
        device_model VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== operation_logs ==========
    await queryRunner.query(`
      CREATE TABLE operation_logs (
        id BIGSERIAL PRIMARY KEY,
        operator_type VARCHAR(10) NOT NULL,
        operator_id BIGINT NOT NULL,
        action VARCHAR(50) NOT NULL,
        target_type VARCHAR(30),
        target_id BIGINT,
        before JSONB,
        after JSONB,
        ip VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== uploads ==========
    await queryRunner.query(`
      CREATE TABLE uploads (
        id BIGSERIAL PRIMARY KEY,
        uploader_type VARCHAR(10),
        uploader_id BIGINT,
        url VARCHAR(500) UNIQUE NOT NULL,
        original_name VARCHAR(200),
        mime_type VARCHAR(50),
        size_bytes BIGINT,
        purpose VARCHAR(30),
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== exchange_rates ==========
    await queryRunner.query(`
      CREATE TABLE exchange_rates (
        id BIGSERIAL PRIMARY KEY,
        base_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
        target_currency VARCHAR(10) NOT NULL,
        rate NUMERIC(15,6) NOT NULL,
        source VARCHAR(50),
        fetched_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ========== app_config ==========
    await queryRunner.query(`
      CREATE TABLE app_config (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        updated_by BIGINT REFERENCES admins(id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'app_config', 'exchange_rates', 'uploads', 'operation_logs',
      'devices', 'notifications', 'exchanges', 'gifts',
      'points_rules', 'points_history', 'points_balance',
      'news', 'news_categories', 'favorites', 'favorite_groups',
      'home_layout', 'home_entries', 'filter_options', 'amenities',
      'keywords', 'listing_images', 'listings', 'areas', 'sections',
      'agents', 'admins', 'users',
    ];
    for (const t of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS ${t} CASCADE`);
    }
  }
}
