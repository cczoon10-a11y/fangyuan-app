import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  
  // 模拟历史记录
  final List<String> _history = ['The Peak', 'BKK1', '太子中央广场', '钻石岛 别墅'];
  // 模拟热门搜索
  final List<String> _hotSearch = ['金边塔', 'BKK1 公寓', '金边新房', '森速区', 'TK星公馆'];

  void _performSearch(String keyword) {
    if (keyword.trim().isEmpty) return;
    // 实际项目中这里需要将 keyword 存入本地历史记录
    context.go('/listings');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        titleSpacing: 0,
        title: Container(
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(18),
          ),
          child: TextField(
            controller: _searchController,
            autofocus: true,
            textInputAction: TextInputAction.search,
            onSubmitted: _performSearch,
            decoration: InputDecoration(
              hintText: '搜索房源、区域、小区',
              hintStyle: const TextStyle(fontSize: 14, color: AppColors.textHint),
              prefixIcon: const Icon(Icons.search, size: 18, color: AppColors.textMuted),
              suffixIcon: IconButton(
                icon: const Icon(Icons.close, size: 16, color: AppColors.textMuted),
                onPressed: () => _searchController.clear(),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => _performSearch(_searchController.text),
            child: const Text('搜索', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 历史搜索
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('历史搜索', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                IconButton(
                  icon: const Icon(Icons.delete_outline, size: 20, color: AppColors.textMuted),
                  onPressed: () {
                    // 实际项目需弹窗确认
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('历史记录已清空')));
                  },
                ),
              ],
            ),
            Wrap(
              spacing: 8,
              runSpacing: 12,
              children: _history.map((tag) => _buildTag(tag)).toList(),
            ),
            
            const SizedBox(height: 32),
            
            // 热门搜索
            const Text('热门搜索', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 12,
              children: _hotSearch.map((tag) => _buildTag(tag, isHot: true)).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTag(String text, {bool isHot = false}) {
    return GestureDetector(
      onTap: () => _performSearch(text),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isHot ? AppColors.primarySoft : AppColors.background,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 13,
            color: isHot ? AppColors.primaryDark : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
