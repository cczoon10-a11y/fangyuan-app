import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const ProviderScope(child: FangyuanAgentApp()));
}

class FangyuanAgentApp extends StatelessWidget {
  const FangyuanAgentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '方·苑 经纪人端',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const AgentHomeScreen(),
    );
  }
}

/// 占位工作台页
class AgentHomeScreen extends StatelessWidget {
  const AgentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFFFF7A00), Color(0xFFE65100)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const CircleAvatar(
                              radius: 28,
                              backgroundColor: Colors.white,
                              child: Icon(Icons.person, color: Color(0xFFE65100), size: 32),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text('金牌经纪人',
                                    style: TextStyle(color: Colors.white70, fontSize: 12)),
                                SizedBox(height: 4),
                                Text('李雪晴',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const Spacer(),
                            IconButton(
                              icon: const Icon(Icons.notifications_outlined,
                                  color: Colors.white),
                              onPressed: () {},
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        const Text('我的积分',
                            style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const Text('1,240',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 36,
                                fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // 发布卡
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF9A3D), Color(0xFFFF7A00)],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.add_home_outlined,
                          size: 40, color: Colors.white),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('发布新房源',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold)),
                            SizedBox(height: 4),
                            Text('每发 1 套房源 · +2 积分',
                                style:
                                    TextStyle(color: Colors.white70, fontSize: 12)),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios,
                          color: Colors.white, size: 16),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const _StatsGrid(),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFFFF7A00),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: '工作台'),
          BottomNavigationBarItem(icon: Icon(Icons.card_giftcard), label: '商城'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid();
  @override
  Widget build(BuildContext context) {
    final data = [
      {'title': '已发布', 'value': '48', 'color': const Color(0xFF1976D2)},
      {'title': '本月', 'value': '12', 'color': const Color(0xFFFF7A00)},
      {'title': '待审核', 'value': '3', 'color': const Color(0xFFD32F2F)},
    ];
    return Row(
      children: data
          .map((item) => Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE1E5EB)),
                  ),
                  child: Column(
                    children: [
                      Text(item['value'] as String,
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: item['color'] as Color)),
                      const SizedBox(height: 4),
                      Text(item['title'] as String,
                          style: const TextStyle(
                              fontSize: 12, color: Color(0xFF5E6C84))),
                    ],
                  ),
                ),
              ))
          .toList(),
    );
  }
}
