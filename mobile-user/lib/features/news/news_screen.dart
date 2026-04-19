import 'package:flutter/material.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('资讯'), automaticallyImplyLeading: false),
      body: const Center(child: Text('📰 资讯列表 - 待开发')),
    );
  }
}
