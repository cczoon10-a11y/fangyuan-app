import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/home/home_screen.dart';
import '../../features/search/search_screen.dart';
import '../../features/listings/listings_screen.dart';
import '../../features/listings/listing_detail_screen.dart';
import '../../features/favorites/favorites_screen.dart';
import '../../features/news/news_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../app/main_scaffold.dart';

final appRouter = GoRouter(
  initialLocation: '/home',
  routes: [
    // 主 Tab 页
    ShellRoute(
      builder: (ctx, state, child) => MainScaffold(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/favorites', builder: (_, __) => const FavoritesScreen()),
        GoRoute(path: '/news', builder: (_, __) => const NewsScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),
    // 全屏页
    GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
    GoRoute(
      path: '/listings',
      builder: (ctx, state) => const ListingsScreen(),
    ),
    GoRoute(
      path: '/listings/:id',
      builder: (ctx, state) => ListingDetailScreen(
        id: state.pathParameters['id']!,
      ),
    ),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
  ],
  errorBuilder: (ctx, state) => Scaffold(
    body: Center(child: Text('页面不存在: ${state.uri.path}')),
  ),
);
