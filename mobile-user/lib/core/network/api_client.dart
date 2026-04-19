import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// FANGYUAN API 客户端封装
/// - 自动携带 token
/// - 401 自动刷新
/// - 统一错误处理
class ApiClient {
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  static const String _tokenKey = 'auth_token';
  static const String _refreshTokenKey = 'auth_refresh_token';

  ApiClient({String baseUrl = 'http://kh-home.com/api/v1'}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      sendTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // 拦截器:注入 token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: _tokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        // 401 尝试刷新 token
        if (error.response?.statusCode == 401 && !_isAuthEndpoint(error.requestOptions.path)) {
          final refreshed = await _tryRefreshToken();
          if (refreshed) {
            try {
              final cloneReq = await _dio.fetch(error.requestOptions);
              return handler.resolve(cloneReq);
            } catch (e) {
              return handler.reject(error);
            }
          }
        }
        handler.next(error);
      },
    ));

    // 开发日志
    assert(() {
      _dio.interceptors.add(PrettyDioLogger(
        requestHeader: false,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: true,
      ));
      return true;
    }());
  }

  Dio get dio => _dio;

  bool _isAuthEndpoint(String path) =>
      path.contains('/auth/login') ||
      path.contains('/auth/register') ||
      path.contains('/auth/refresh');

  Future<bool> _tryRefreshToken() async {
    try {
      final refreshToken = await _storage.read(key: _refreshTokenKey);
      if (refreshToken == null) return false;

      final res = await Dio().post(
        '${_dio.options.baseUrl}/user/auth/refresh-token',
        data: {'refresh_token': refreshToken},
      );

      final data = res.data['data'];
      await _storage.write(key: _tokenKey, value: data['token']);
      await _storage.write(key: _refreshTokenKey, value: data['refresh_token']);
      return true;
    } catch (_) {
      await _storage.delete(key: _tokenKey);
      await _storage.delete(key: _refreshTokenKey);
      return false;
    }
  }

  Future<void> setTokens(String token, String refreshToken) async {
    await _storage.write(key: _tokenKey, value: token);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }

  Future<bool> isLoggedIn() async {
    return (await _storage.read(key: _tokenKey)) != null;
  }

  // ========== 统一请求方法 ==========
  Future<T> get<T>(String path, {Map<String, dynamic>? query}) async {
    final res = await _dio.get(path, queryParameters: query);
    return res.data['data'] as T;
  }

  Future<T> post<T>(String path, {dynamic data}) async {
    final res = await _dio.post(path, data: data);
    return res.data['data'] as T;
  }

  Future<T> patch<T>(String path, {dynamic data}) async {
    final res = await _dio.patch(path, data: data);
    return res.data['data'] as T;
  }

  Future<T> delete<T>(String path) async {
    final res = await _dio.delete(path);
    return res.data['data'] as T;
  }
}
