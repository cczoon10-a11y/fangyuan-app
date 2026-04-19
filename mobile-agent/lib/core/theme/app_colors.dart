import 'package:flutter/material.dart';

/// 方·苑 FANGYUAN 设计系统
/// 主色:活力橙(商务房产配色)
/// 辅色:信任蓝
class AppColors {
  // ========== 主色:橙 ==========
  static const Color primary = Color(0xFFFF7A00);       // 主橙
  static const Color primaryLight = Color(0xFFFFB74D);  // 亮橙
  static const Color primaryDark = Color(0xFFE65100);   // 深橙
  static const Color primarySoft = Color(0xFFFFF3E0);   // 米橙(背景)

  // ========== 辅色:蓝 ==========
  static const Color secondary = Color(0xFF1976D2);      // 主蓝
  static const Color secondaryLight = Color(0xFF64B5F6); // 亮蓝
  static const Color secondaryDark = Color(0xFF0D47A1);  // 深蓝
  static const Color secondarySoft = Color(0xFFE3F2FD);  // 淡蓝(背景)

  // ========== 中性色 ==========
  static const Color background = Color(0xFFF8FAFC);     // 页面背景
  static const Color surface = Color(0xFFFFFFFF);        // 卡片底
  static const Color card = Color(0xFFFFFFFF);

  // ========== 文字 ==========
  static const Color textPrimary = Color(0xFF1A1F36);    // 主文字
  static const Color textSecondary = Color(0xFF5E6C84);  // 次文字
  static const Color textMuted = Color(0xFF8993A4);      // 灰文字
  static const Color textHint = Color(0xFFC1C7D0);       // 占位

  // ========== 功能色 ==========
  static const Color success = Color(0xFF2E7D32);
  static const Color warning = Color(0xFFF57C00);
  static const Color error = Color(0xFFD32F2F);
  static const Color info = Color(0xFF0288D1);

  // ========== 价格/强调 ==========
  static const Color price = Color(0xFFE65100);

  // ========== 边框/分隔 ==========
  static const Color border = Color(0xFFE1E5EB);
  static const Color divider = Color(0xFFEEF1F5);

  // ========== 特殊 ==========
  static const Color badgeHot = Color(0xFFE53935);
  static const Color badgeNew = Color(0xFF43A047);
  static const Color badgeTop = Color(0xFFFF7A00);

  // ========== 渐变 ==========
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFFFF9A3D), Color(0xFFFF7A00)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [Color(0xFF42A5F5), Color(0xFF1976D2)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFFFF7A00), Color(0xFFE65100)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

/// 间距(8pt 网格)
class AppSpacing {
  static const double xxs = 4;
  static const double xs = 8;
  static const double sm = 12;
  static const double md = 16;
  static const double lg = 20;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 40;
}

/// 圆角
class AppRadius {
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double round = 999;
}
