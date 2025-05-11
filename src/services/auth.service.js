import { request } from '../utils/request';
import { CONFIG } from '../utils';
import { TApiResponse, TLoginResponse, TRegisterData } from '../types/index';

// 用户认证服务
class AuthService {
  // 登录
  login(account, password) {
    return request({
      url: '/api/auth/login',
      method: 'POST',
      data: { account, password }
    });
  }
  
  // 注册
  register(userData) {
    return request({
      url: '/api/auth/register',
      method: 'POST',
      data: userData
    });
  }
  
  // 清除本地登录状态
  clearLoginState() {
    uni.removeStorageSync(CONFIG.STORAGE.TOKEN);
    uni.removeStorageSync(CONFIG.STORAGE.USER_ID);
    uni.removeStorageSync(CONFIG.STORAGE.IS_LOGGED_IN);
    uni.removeStorageSync(CONFIG.STORAGE.USER_INFO);
  }
  
  // 检查是否已登录
  isLoggedIn() {
    return !!uni.getStorageSync(CONFIG.STORAGE.IS_LOGGED_IN);
  }
  
  // 获取当前用户ID
  getCurrentUserId() {
    return uni.getStorageSync(CONFIG.STORAGE.USER_ID);
  }
}

export const authService = new AuthService(); 