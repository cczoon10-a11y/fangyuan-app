import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/theme/app_colors.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;
  const MainScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final currentIndex = _indexOf(location);

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (i) => _onTap(context, i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: '首页'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite_border), activeIcon: Icon(Icons.favorite), label: '收藏'),
          BottomNavigationBarItem(icon: Icon(Icons.article_outlined), activeIcon: Icon(Icons.article), label: '资讯'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }

  int _indexOf(String path) {
    if (path.startsWith('/favorites')) return 1;
    if (path.startsWith('/news')) return 2;
    if (path.startsWith('/profile')) return 3;
    return 0;
  }

  void _onTap(BuildContext context, int i) {
    switch (i) {
      case 0: context.go('/home'); break;
      case 1: context.go('/favorites'); break;
      case 2: context.go('/news'); break;
      case 3: context.go('/profile'); break;
    }
  }
}
