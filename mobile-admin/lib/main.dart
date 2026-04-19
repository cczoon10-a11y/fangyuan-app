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

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const ProviderScope(child: FangyuanAdminApp()));
}

class FangyuanAdminApp extends StatelessWidget {
  const FangyuanAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '方·苑 管理端',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const AdminLoginScreen(),
      supportedLocales: const [
        Locale('zh', 'CN'),
        Locale('en', 'US'),
      ],
    );
  }
}

/// 占位登录页(真实版本参考 mobile-user/features/auth/login_screen.dart)
class AdminLoginScreen extends StatelessWidget {
  const AdminLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFF7A00), Color(0xFFE65100)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.admin_panel_settings,
                      size: 80, color: Colors.white),
                  const SizedBox(height: 16),
                  const Text(
                    '方·苑 管理端',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const Text(
                    'FANGYUAN ADMIN',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white70,
                      letterSpacing: 4,
                    ),
                  ),
                  const SizedBox(height: 48),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Column(
                      children: [
                        TextField(
                          decoration: InputDecoration(
                            labelText: '手机号',
                            prefixText: '+855 ',
                            border: OutlineInputBorder(),
                          ),
                        ),
                        SizedBox(height: 16),
                        TextField(
                          obscureText: true,
                          decoration: InputDecoration(
                            labelText: '密码',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFFE65100),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      onPressed: () {},
                      child: const Text('登 录',
                          style: TextStyle(fontSize: 16, letterSpacing: 8)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
