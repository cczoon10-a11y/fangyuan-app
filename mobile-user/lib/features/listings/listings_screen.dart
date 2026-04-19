import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class ListingsScreen extends StatefulWidget {
  const ListingsScreen({super.key});

  @override
  State<ListingsScreen> createState() => _ListingsScreenState();
}

class _ListingsScreenState extends State<ListingsScreen> {
  final List<Map<String, dynamic>> _dummyListings = [
    {
      'id': '1',
      'title': 'The Peak BKK1 · 精装三居观景房',
      'price': '388,000',
      'desc': '3BR · 118㎡ · BKK1 · 金边塔',
      'tags': ['精装修', '配套齐全', '可看江'],
      'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      'id': '2',
      'title': '太子中央广场 · 单身公寓出租',
      'price': '650/月',
      'desc': '1BR · 45㎡ · Tonle Bassac',
      'tags': ['近商场', '安保严', '包物业'],
      'image': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      'id': '3',
      'title': '钻石岛顶级江景大平层',
      'price': '1,200,000',
      'desc': '4BR · 220㎡ · 钻石岛',
      'tags': ['江景', '豪装', '私人电梯'],
      'image': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: GestureDetector(
          onTap: () => context.go('/search'),
          child: Container(
            height: 36,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Row(
              children: [
                Icon(Icons.search, size: 18, color: AppColors.textMuted),
                SizedBox(width: 8),
                Text('搜索房源、区域、小区', style: TextStyle(fontSize: 14, color: AppColors.textHint)),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.map_outlined, color: AppColors.textPrimary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('地图找房功能开发中')));
            },
          )
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(44),
          child: Container(
            height: 44,
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(bottom: BorderSide(color: AppColors.border, width: 0.5)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildFilterItem('区域'),
                _buildFilterItem('价格'),
                _buildFilterItem('户型'),
                _buildFilterItem('更多', icon: Icons.filter_alt_outlined),
              ],
            ),
          ),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _dummyListings.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final item = _dummyListings[index];
          return GestureDetector(
            onTap: () => context.go('/listings/${item['id']}'),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 房源图片
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    child: Image.network(
                      item['image'],
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  // 房源信息
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['title'],
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item['desc'],
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: (item['tags'] as List<String>).map((tag) {
                            return Container(
                              margin: const EdgeInsets.only(right: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primarySoft,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                tag,
                                style: const TextStyle(fontSize: 10, color: AppColors.primaryDark),
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            const Text('\$', style: TextStyle(fontSize: 14, color: Colors.redAccent, fontWeight: FontWeight.bold)),
                            Text(item['price'], style: const TextStyle(fontSize: 20, color: Colors.redAccent, fontWeight: FontWeight.bold)),
                          ],
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterItem(String title, {IconData icon = Icons.keyboard_arrow_down}) {
    return Row(
      children: [
        Text(title, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
        const SizedBox(width: 2),
        Icon(icon, size: 16, color: AppColors.textMuted),
      ],
    );
  }
}
