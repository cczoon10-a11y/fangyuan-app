import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            // ========== 顶部 Hero(橙色渐变)==========
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                decoration: const BoxDecoration(
                  gradient: AppColors.heroGradient,
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          '方·苑',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 2,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'FANGYUAN',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            letterSpacing: 2,
                          ),
                        ),
                        const Spacer(),
                        _LangSwitch(),
                        const SizedBox(width: 8),
                        _IconBtn(icon: Icons.notifications_none, onTap: () {}),
                      ],
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      '找一处\n理想居所',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        height: 1.3,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'PHNOM PENH · HOME',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.85),
                        fontSize: 12,
                        letterSpacing: 4,
                      ),
                    ),
                    const SizedBox(height: 18),
                    _SearchBar(),
                  ],
                ),
              ),
            ),

            // ========== 板块按钮网格(从API加载)==========
            const SliverPadding(
              padding: EdgeInsets.fromLTRB(16, 20, 16, 8),
              sliver: SliverToBoxAdapter(child: _EntryGrid()),
            ),

            // ========== 区域快选 ==========
            const SliverToBoxAdapter(child: _AreaRow()),

            // ========== 优选房源标题 ==========
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
              sliver: SliverToBoxAdapter(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      '优选房源',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'P R E M I U M',
                      style: TextStyle(
                        fontSize: 12,
                        letterSpacing: 3,
                        color: AppColors.primary.withOpacity(0.7),
                      ),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => context.go('/listings'),
                      child: const Row(
                        children: [
                          Text('更多', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                          Icon(Icons.chevron_right, color: AppColors.textMuted, size: 18),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ========== No.1 大卡(示例)==========
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverToBoxAdapter(child: _FeaturedCard()),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 30)),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// 组件
// ============================================================================
class _LangSwitch extends StatefulWidget {
  @override
  State<_LangSwitch> createState() => _LangSwitchState();
}

class _LangSwitchState extends State<_LangSwitch> {
  String current = '中';
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: ['中', 'EN', 'KH'].map((v) {
          final active = current == v;
          return GestureDetector(
            onTap: () => setState(() => current = v),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: active ? Colors.white : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                v,
                style: TextStyle(
                  color: active ? AppColors.primary : Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _IconBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  const _IconBtn({required this.icon, this.onTap});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.18),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white, size: 18),
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go('/search'),
      child: Container(
        height: 46,
        padding: const EdgeInsets.symmetric(horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(23),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Row(
          children: [
            const SizedBox(width: 12),
            const Icon(Icons.search, color: AppColors.textMuted, size: 20),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                '输入区域、楼盘、地标… BKK1',
                style: TextStyle(color: AppColors.textHint, fontSize: 14),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [AppColors.secondary, AppColors.secondaryDark]),
                borderRadius: BorderRadius.circular(18),
              ),
              child: const Text('搜索', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }
}

class _EntryGrid extends StatelessWidget {
  const _EntryGrid();
  @override
  Widget build(BuildContext context) {
    // 示例数据,生产从 /public/home-entries 加载
    final entries = [
      ('🏠', '买房', AppColors.primarySoft, AppColors.primary),
      ('🔑', '租房', AppColors.secondarySoft, AppColors.secondary),
      ('💎', '捡漏房', const Color(0xFFFFF8E1), const Color(0xFFF9A825)),
      ('🏢', '商铺写字楼', const Color(0xFFECEFF1), const Color(0xFF546E7A)),
      ('🏡', '别墅', const Color(0xFFFFE0B2), AppColors.primaryDark),
      ('✨', '新房', const Color(0xFFBBDEFB), AppColors.secondaryDark),
      ('💰', '贷款', const Color(0xFFFFECB3), const Color(0xFFF57F17)),
      ('🔎', 'VR 看房', const Color(0xFFE1F5FE), const Color(0xFF01579B)),
    ];
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      crossAxisSpacing: 8,
      mainAxisSpacing: 12,
      childAspectRatio: 0.88,
      children: entries.map((e) => _EntryCell(icon: e.$1, label: e.$2, bg: e.$3, accent: e.$4)).toList(),
    );
  }
}

class _EntryCell extends StatelessWidget {
  final String icon, label;
  final Color bg, accent;
  const _EntryCell({required this.icon, required this.label, required this.bg, required this.accent});
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => context.go('/listings'),
      borderRadius: BorderRadius.circular(14),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(13)),
            child: Center(child: Text(icon, style: const TextStyle(fontSize: 24))),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppColors.textPrimary, fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _AreaRow extends StatelessWidget {
  const _AreaRow();
  @override
  Widget build(BuildContext context) {
    final areas = ['全部', 'BKK1', 'Toul Kork', 'Daun Penh', 'Chroy Changvar', 'Sen Sok', '7 Makara'];
    return SizedBox(
      height: 40,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: areas.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (ctx, i) {
          final active = i == 0;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: active ? AppColors.primary : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: active ? AppColors.primary : AppColors.border),
            ),
            child: Text(
              areas[i],
              style: TextStyle(
                color: active ? Colors.white : AppColors.textSecondary,
                fontWeight: active ? FontWeight.w600 : FontWeight.normal,
                fontSize: 13,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _FeaturedCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go('/listings/1'),
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: const LinearGradient(
            colors: [Color(0xFF546E7A), Color(0xFF263238)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              top: 20,
              left: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text('No.1 · 优选', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
              ),
            ),
            Positioned(
              left: 0, right: 0, bottom: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'The Peak BKK1 · 精装三居',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '3BR · 118㎡ · BKK1 · 金边塔',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        const Text('\$', style: TextStyle(color: AppColors.primaryLight, fontSize: 14, fontWeight: FontWeight.w500)),
                        const Text('388,000', style: TextStyle(color: AppColors.primaryLight, fontSize: 22, fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
