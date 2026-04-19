import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // 竖屏锁定(可改)
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // 状态栏样式 - 透明,深色图标
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const ProviderScope(child: FangyuanApp()));
}

class FangyuanApp extends StatelessWidget {
  const FangyuanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '方·苑 FANGYUAN',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: appRouter,
      // 国际化占位 - 后续补充 l10n
      supportedLocales: const [
        Locale('zh', 'CN'),
        Locale('en', 'US'),
        Locale('km', 'KH'), // 柬文
      ],
    );
  }
}
