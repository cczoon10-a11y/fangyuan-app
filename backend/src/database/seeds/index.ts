import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config as dotenvConfig } from 'dotenv';
import dataSource from './data-source';

dotenvConfig({ path: '.env' });

async function seed() {
  console.log('🌱 开始注入种子数据...');

  const ds = await dataSource.initialize();

  try {
    await ds.transaction(async (mgr) => {
      // ========== 管理员 ==========
      const adminPassword = await bcrypt.hash('admin123', 12);
      await mgr.query(
        `INSERT INTO admins (phone, password_hash, name, role) VALUES
         ('+85512000000', $1, '超级管理员', 'super_admin')
         ON CONFLICT (phone) DO NOTHING`,
        [adminPassword],
      );
      console.log('  ✓ 初始管理员 +85512000000 / admin123');

      // ========== 板块 ==========
      await mgr.query(`
        INSERT INTO sections (name, name_en, subtitle, icon, theme_color, sort_order) VALUES
        ('买房', 'Buy', 'FOR · SALE', '🏠', '#FF7A00', 1),
        ('租房', 'Rent', 'FOR · RENT', '🔑', '#1E88E5', 2),
        ('捡漏房', 'Deals', 'BARGAINS', '💎', '#FB8C00', 3),
        ('商铺写字楼', 'Commercial', 'COMMERCIAL', '🏢', '#546E7A', 4)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 四大板块');

      // ========== 区域 ==========
      await mgr.query(`
        INSERT INTO areas (name, name_en, is_hot, latitude, longitude, sort_order) VALUES
        ('BKK1', 'BKK1', true, 11.5617, 104.9224, 1),
        ('Toul Kork', 'Toul Kork', true, 11.5837, 104.8983, 2),
        ('Daun Penh', 'Daun Penh', false, 11.5680, 104.9282, 3),
        ('Chroy Changvar', 'Chroy Changvar', false, 11.5828, 104.9345, 4),
        ('Sen Sok', 'Sen Sok', false, 11.5685, 104.8921, 5),
        ('7 Makara', '7 Makara', false, 11.5678, 104.9154, 6),
        ('Russey Keo', 'Russey Keo', false, 11.6017, 104.8989, 7)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 7 大金边区域');

      // ========== 首页板块按钮 ==========
      await mgr.query(`
        INSERT INTO home_entries (name, name_en, icon, bg_color, jump_type, jump_target, sort_order) VALUES
        ('买房', 'Buy', '🏠', '#FFF3E0', 'section', '1', 1),
        ('租房', 'Rent', '🔑', '#E3F2FD', 'section', '2', 2),
        ('捡漏房', 'Deals', '💎', '#FFF8E1', 'section', '3', 3),
        ('商铺写字楼', 'Commercial', '🏢', '#ECEFF1', 'section', '4', 4),
        ('别墅', 'Villa', '🏡', '#FFE0B2', 'section', '1', 5),
        ('新房', 'New', '✨', '#BBDEFB', 'section', '1', 6),
        ('贷款', 'Loan', '💰', '#FFECB3', 'link', '/loan', 7),
        ('VR 看房', 'VR Tour', '🔎', '#E1F5FE', 'link', '/vr', 8)
        ON CONFLICT DO NOTHING
      `);
      await mgr.query(
        `INSERT INTO home_layout(id, layout, entries_per_row) VALUES(1, '4-column', 4) ON CONFLICT DO NOTHING`,
      );
      console.log('  ✓ 8 个首页按钮 + 布局');

      // ========== 关键字 ==========
      await mgr.query(`
        INSERT INTO keywords (name, name_en, type, style, show_on_home, show_on_search) VALUES
        ('学区房', 'School District', 'hot_search', 'hot', true, true),
        ('精装修', 'Furnished', 'listing_tag', 'gold', true, true),
        ('地铁口', 'Near Transit', 'hot_search', 'jade', true, true),
        ('河景', 'River View', 'listing_tag', 'jade', false, true),
        ('学区', 'School', 'listing_tag', 'gold', false, true),
        ('海景', 'Sea View', 'listing_tag', 'jade', false, true),
        ('公寓', 'Apartment', 'filter', 'ink', false, true),
        ('别墅', 'Villa', 'filter', 'ink', false, true)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 关键字');

      // ========== 筛选选项 ==========
      await mgr.query(`
        INSERT INTO filter_options (category, label, label_en, value_min, value_max, is_hot, sort_order) VALUES
        ('price', '不限', 'Any', NULL, NULL, false, 1),
        ('price', '$50K 以下', 'Under $50K', 0, 50000, false, 2),
        ('price', '$50K-$100K', '$50K-$100K', 50000, 100000, false, 3),
        ('price', '$100K-$200K', '$100K-$200K', 100000, 200000, true, 4),
        ('price', '$200K-$500K', '$200K-$500K', 200000, 500000, true, 5),
        ('price', '$500K-$1M', '$500K-$1M', 500000, 1000000, false, 6),
        ('price', '$1M+', '$1M+', 1000000, NULL, false, 7),
        ('bedroom', '不限', 'Any', NULL, NULL, false, 1),
        ('bedroom', '1BR', '1BR', NULL, NULL, true, 2),
        ('bedroom', '2BR', '2BR', NULL, NULL, true, 3),
        ('bedroom', '3BR', '3BR', NULL, NULL, true, 4),
        ('bedroom', '4BR', '4BR', NULL, NULL, false, 5),
        ('bedroom', '5BR+', '5BR+', NULL, NULL, false, 6),
        ('area', '不限', 'Any', NULL, NULL, false, 1),
        ('area', '< 50㎡', '< 50㎡', 0, 50, false, 2),
        ('area', '50-80㎡', '50-80㎡', 50, 80, true, 3),
        ('area', '80-120㎡', '80-120㎡', 80, 120, true, 4),
        ('area', '120-180㎡', '120-180㎡', 120, 180, false, 5),
        ('area', '180㎡+', '180㎡+', 180, NULL, false, 6)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 筛选选项');

      // ========== 配套 ==========
      await mgr.query(`
        INSERT INTO amenities (name, name_en, icon, type, sort_order) VALUES
        ('精装修', 'Furnished', '🛋', 'indoor', 1),
        ('中央空调', 'Central AC', '❄', 'indoor', 2),
        ('家具齐全', 'Full Furniture', '🛏', 'indoor', 3),
        ('智能家居', 'Smart Home', '📱', 'indoor', 4),
        ('电梯', 'Elevator', '🛗', 'indoor', 5),
        ('车位', 'Parking', '🚗', 'indoor', 6),
        ('泳池', 'Pool', '🏊', 'indoor', 7),
        ('健身房', 'Gym', '🏋', 'indoor', 8),
        ('学校', 'School', '🏫', 'nearby', 1),
        ('医院', 'Hospital', '🏥', 'nearby', 2),
        ('商超', 'Mall', '🛒', 'nearby', 3),
        ('公园', 'Park', '🌳', 'nearby', 4),
        ('地铁', 'Metro', '🚇', 'nearby', 5),
        ('银行', 'Bank', '🏦', 'nearby', 6)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 配套选项');

      // ========== 积分规则 ==========
      await mgr.query(`
        INSERT INTO points_rules (action, points, description) VALUES
        ('listing_approved', 2, '房源审核通过'),
        ('agent_onboard', 50, '入驻奖励'),
        ('monthly_signin', 5, '月度签到')
        ON CONFLICT (action) DO NOTHING
      `);
      console.log('  ✓ 积分规则');

      // ========== 礼品 ==========
      await mgr.query(`
        INSERT INTO gifts (name, name_en, category, points_cost, stock, tags) VALUES
        ('星巴克咖啡券 $5', 'Starbucks Voucher $5', 'voucher', 200, 100, ARRAY['热销']),
        ('普洱茶礼盒', 'Pu-erh Tea Set', 'tea', 600, 50, ARRAY[]::text[]),
        ('蓝牙耳机', 'Bluetooth Earbuds', 'electronics', 800, 30, ARRAY['热销']),
        ('京东卡 $20', 'JD Card $20', 'voucher', 800, 200, ARRAY[]::text[]),
        ('真皮公文包', 'Leather Briefcase', 'business', 1500, 10, ARRAY['限量']),
        ('iPad mini', 'iPad mini', 'electronics', 5000, 5, ARRAY['限量','新'])
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 礼品');

      // ========== 资讯分类 ==========
      await mgr.query(`
        INSERT INTO news_categories (name, name_en, sort_order) VALUES
        ('楼市分析', 'Market Analysis', 1),
        ('政策解读', 'Policy', 2),
        ('看房指南', 'Viewing Guide', 3),
        ('生活方式', 'Lifestyle', 4)
        ON CONFLICT DO NOTHING
      `);
      console.log('  ✓ 资讯分类');

      // ========== 汇率 ==========
      await mgr.query(`
        INSERT INTO exchange_rates (base_currency, target_currency, rate, source) VALUES
        ('USD', 'KHR', 4100, 'manual'),
        ('USD', 'CNY', 7.2, 'manual'),
        ('USD', 'USD', 1, 'manual')
      `);
      console.log('  ✓ 汇率');
    });

    console.log('✅ 种子数据注入完成');
    console.log('');
    console.log('=== 登录信息 ===');
    console.log('  管理员: +85512000000 / admin123');
    console.log('  Swagger: http://localhost:3000/api/docs');
  } finally {
    await ds.destroy();
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
