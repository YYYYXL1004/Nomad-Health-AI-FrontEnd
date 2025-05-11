import { ref, onMounted } from 'vue';
import { authService, userService } from '../services';
import { showToast, CONFIG, redirectTo } from '../utils';
import { TUserInfo } from '../types/index';

// 用户认证Hook
export function useAuth() {
  const userInfo = ref(null);
  const isLoggedIn = ref(false);
  const isLoading = ref(false);
  
  // 初始化检查登录状态
  onMounted(() => {
    checkLoginStatus();
  });
  
  // 检查登录状态
  const checkLoginStatus = () => {
    isLoggedIn.value = authService.isLoggedIn();
    userInfo.value = userService.getUserInfoFromStorage();
  };
  
  // 登录方法
  const login = async (account, password) => {
    isLoading.value = true;
    try {
      const res = await authService.login(account, password);
      
      if (res.code === 200) {
        // 保存登录状态
        uni.setStorageSync(CONFIG.STORAGE.TOKEN, res.data.token);
        uni.setStorageSync(CONFIG.STORAGE.USER_ID, res.data.userId);
        uni.setStorageSync(CONFIG.STORAGE.IS_LOGGED_IN, true);
        
        // 保存用户信息
        const userInfoData = {
          userId: res.data.userId,
          nickname: res.data.nickname,
          avatar: res.data.avatar,
          account: account
        };
        userService.saveUserInfoToStorage(userInfoData);
        
        // 更新状态
        userInfo.value = userInfoData;
        isLoggedIn.value = true;
        
        // 登录成功提示
        showToast('登录成功', 'success');
        
        return true;
      } else {
        showToast(res.message || '登录失败，请稍后重试');
        return false;
      }
    } catch (error) {
      console.error('登录失败:', error);
      showToast('登录失败，请检查网络连接');
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 注册方法
  const register = async (userData) => {
    isLoading.value = true;
    try {
      const res = await authService.register(userData);
      
      if (res.code === 200) {
        showToast('注册成功，请登录', 'success');
        return true;
      } else {
        showToast(res.message || '注册失败，请稍后重试');
        return false;
      }
    } catch (error) {
      console.error('注册失败:', error);
      showToast('注册失败，请检查网络连接');
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 退出登录
  const logout = async () => {
    isLoading.value = true;
    try {
      await authService.logout();
      // 清除登录状态
      authService.clearLoginState();
      
      // 更新状态
      userInfo.value = null;
      isLoggedIn.value = false;
      
      // 跳转到登录页
      redirectTo('/pages/login/index');
      
      return true;
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使API调用失败，也清除本地登录状态
      authService.clearLoginState();
      userInfo.value = null;
      isLoggedIn.value = false;
      redirectTo('/pages/login/index');
      return true;
    } finally {
      isLoading.value = false;
    }
  };
  
  // 获取最新用户信息
  const refreshUserInfo = async () => {
    isLoading.value = true;
    try {
      const res = await userService.getUserInfo();
      
      if (res.code === 200) {
        // 更新用户信息
        userService.saveUserInfoToStorage(res.data);
        userInfo.value = res.data;
        return true;
      } else {
        console.error('获取用户信息失败:', res.message);
        return false;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    userInfo,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    refreshUserInfo,
    checkLoginStatus
  };
} 