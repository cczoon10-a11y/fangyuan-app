import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class ListingDetailScreen extends StatefulWidget {
  final String id;
  const ListingDetailScreen({super.key, required this.id});

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  bool _isFavorite = false;

  void _showContactDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('联系经纪人', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 24),
                ListTile(
                  leading: const Icon(Icons.phone, color: AppColors.primary),
                  title: const Text('0963935594', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                  subtitle: const Text('点击复制电话号码'),
                  trailing: const Icon(Icons.copy, size: 20),
                  onTap: () {
                    Clipboard.setData(const ClipboardData(text: '0963935594'));
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('电话号码已复制到剪贴板')));
                  },
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.chat, color: Colors.green),
                  title: const Text('JYW0777', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                  subtitle: const Text('点击复制微信号'),
                  trailing: const Icon(Icons.copy, size: 20),
                  onTap: () {
                    Clipboard.setData(const ClipboardData(text: 'JYW0777'));
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('微信号已复制到剪贴板')));
                  },
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // 顶部图片与 AppBar
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: Colors.white,
            iconTheme: const IconThemeData(color: AppColors.textPrimary),
            actions: [
              IconButton(
                icon: const Icon(Icons.share_outlined),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.more_horiz),
                onPressed: () {},
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                fit: BoxFit.cover,
              ),
            ),
          ),
          
          // 房源内容
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      const Text('\$', style: TextStyle(fontSize: 18, color: Colors.redAccent, fontWeight: FontWeight.bold)),
                      const Text('388,000', style: TextStyle(fontSize: 28, color: Colors.redAccent, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      // 价格折算按钮
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('多币种折算', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      )
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'The Peak BKK1 · 精装三居观景房 拎包入住',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildInfoItem('户型', '3室2厅2卫'),
                      Container(width: 1, height: 24, color: AppColors.border),
                      _buildInfoItem('面积', '118 ㎡'),
                      Container(width: 1, height: 24, color: AppColors.border),
                      _buildInfoItem('楼层', '中楼层/45层'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: AppColors.border),
                  const SizedBox(height: 16),
                  
                  // 小区与位置
                  const Text('位置信息', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Icon(Icons.location_on, color: AppColors.primary, size: 20),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text('金边市 BKK1区 莫尼旺大道 288号', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                      ),
                      Icon(Icons.chevron_right, color: AppColors.textMuted)
                    ],
                  ),
                  const SizedBox(height: 16),
                  // 假地图
                  Container(
                    height: 150,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(child: Text('地图加载中...', style: TextStyle(color: AppColors.textHint))),
                  ),
                  const SizedBox(height: 100), // 底部留白
                ],
              ),
            ),
          )
        ],
      ),
      // 底部操作栏
      bottomNavigationBar: SafeArea(
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -2))
            ],
          ),
          child: Row(
            children: [
              // 收藏
              GestureDetector(
                onTap: () {
                  setState(() => _isFavorite = !_isFavorite);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(_isFavorite ? '收藏成功' : '已取消收藏')),
                  );
                },
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: _isFavorite ? Colors.redAccent : AppColors.textSecondary,
                      size: 24,
                    ),
                    const Text('收藏', style: TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              // 分享
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.share_outlined, color: AppColors.textSecondary, size: 24),
                  Text('分享', style: TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                ],
              ),
              const Spacer(),
              // 在线咨询
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () => _showContactDialog(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFF3E0),
                    foregroundColor: const Color(0xFFF57F17),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('在线咨询', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 12),
              // 电话
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () => _showContactDialog(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('电话联系', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoItem(String title, String value) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
      ],
    );
  }
}
