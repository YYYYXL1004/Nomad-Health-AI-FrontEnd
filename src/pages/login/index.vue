<template>
  <view class="container">
    <view class="language-switch" @tap="showLanguageSelector">
      <text class="lang-text">{{ currentLang === 'zh' ? '中/蒙' : 'ᠮᠣᠩᠭᠣᠯ/ᠬᠢᠲᠠᠳ' }}</text>
    </view>
    
    <view class="logo-container">
      <view class="logo"></view>
      <text class="app-name">{{ $t('auth.login') }}</text>
    </view>
    
    <view class="form-container">
      <view class="input-group">
        <view class="input-wrapper">
          <text class="input-icon">👤</text>
          <input
            class="input-field"
            type="text"
            v-model="account"
            :placeholder="$t('auth.account')"
          />
        </view>
      </view>
      
      <view class="input-group">
        <view class="input-wrapper">
          <text class="input-icon">🔒</text>
          <input
            class="input-field"
            type="password"
            v-model="password"
            :placeholder="$t('auth.password')"
            password
          />
        </view>
      </view>
      
      <view class="forgot-password" @tap="goToForgotPassword">
        <text>{{ $t('auth.forgotPassword') }}</text>
      </view>
      
      <button class="login-btn" @tap="handleLogin">{{ $t('auth.loginNow') }}</button>
      
      <view class="register-link" @tap="goToRegister">
        <text>{{ $t('auth.noAccount') }}</text>
        <text class="link-text">{{ $t('auth.registerNow') }}</text>
      </view>
    </view>
    
    <!-- 语言选择弹窗 -->
    <view class="language-popup" v-if="showLangPopup">
      <view class="popup-mask" @tap="hideLangPopup"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ $t('settings.selectLanguage') }}</text>
          <text class="popup-close" @tap="hideLangPopup">×</text>
        </view>
        
        <view class="language-list">
          <view 
            class="language-item" 
            :class="{ active: currentLang === 'zh' }"
            @tap="selectLanguage('zh')"
          >
            <text>{{ $t('settings.chinese') }}</text>
            <text v-if="currentLang === 'zh'" class="language-check">✓</text>
          </view>
          
          <view 
            class="language-item" 
            :class="{ active: currentLang === 'mn_trad' }"
            @tap="selectLanguage('mn_trad')"
          >
            <text>{{ $t('settings.mongolian') }}</text>
            <text v-if="currentLang === 'mn_trad'" class="language-check">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentLang, setLanguage } from '@/i18n/index.js';
import { authApi } from '@/api/index.js';

// 用户输入
const account = ref('');
const password = ref('');

// 语言选择
const currentLang = ref('zh');
const showLangPopup = ref(false);

// 页面加载时获取当前语言设置
onMounted(() => {
  currentLang.value = getCurrentLang();
  
  // 检查是否已登录，如果已登录直接跳转到首页
  const isLoggedIn = uni.getStorageSync('isLoggedIn');
  if (isLoggedIn) {
    console.log('登录页检测到已登录状态，自动跳转到首页');
    uni.reLaunch({
      url: '/pages/index/index'
    });
    return;
  }
  
  // 自动填入测试账号方便测试
  account.value = 'test';
  password.value = '123456';
});

// 显示语言选择器
const showLanguageSelector = () => {
  showLangPopup.value = true;
};

// 隐藏语言选择器
const hideLangPopup = () => {
  showLangPopup.value = false;
};

// 选择语言
const selectLanguage = (lang) => {
  currentLang.value = lang;
  setLanguage(lang);
  
  // 关闭弹窗
  showLangPopup.value = false;
  
  // 刷新页面以应用新语言
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/index'
    });
  }, 300);
};

// 登录处理
const handleLogin = () => {
  // 输入验证
  if (!account.value.trim()) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '请输入账号' : 'ᠳᠠᠩᠰᠠ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      icon: 'none'
    });
    return;
  }
  
  if (!password.value.trim()) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '请输入密码' : 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      icon: 'none'
    });
    return;
  }
  
  // 显示登录中提示
  uni.showLoading({
    title: currentLang.value === 'zh' ? '登录中...' : 'ᠨᠡᠪᠲᠡᠷᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...'
  });
  
  console.log('登录流程开始 - 账号:', account.value);
  
  // 调用登录接口
  authApi.login(account.value, password.value)
    .then(res => {
      console.log('登录API响应成功:', res);
      
      // 隐藏加载提示
      uni.hideLoading();
      
      // 检查响应是否包含错误码
      if (res.code && res.code !== 200) {
        uni.showToast({
          title: res.message || '登录失败',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 存储token和用户信息
      uni.setStorageSync('token', res.data.token);
      uni.setStorageSync('userId', res.data.userId);
      uni.setStorageSync('isLoggedIn', true);
      uni.setStorageSync('userInfo', {
        userId: res.data.userId,
        nickname: res.data.nickname || res.data.username,
        avatar: res.data.avatar
      });
      
      // 显示登录成功
      uni.showToast({
        title: currentLang.value === 'zh' ? '登录成功' : 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠨᠡᠪᠲᠡᠷᠡᠯᠡᠭᠡ',
        icon: 'success',
        duration: 1500
      });
      
      // 延迟跳转，等待提示显示完毕
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    }).catch(err => {
      console.error('登录API调用失败:', err);
      
      // 隐藏加载提示
      uni.hideLoading();
      
      // 显示错误信息
      uni.showToast({
        title: err.message || (currentLang.value === 'zh' ? '登录失败，请检查账号密码' : 'Нэвтрэх амжилтгүй болсон'),
        icon: 'none',
        duration: 2000
      });
    });
};

// 跳转到注册页面
const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  });
};

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  uni.navigateTo({
    url: '/pages/login/forgot-password'
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f8f8;
  position: relative;
}

.language-switch {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  padding: 10rpx 20rpx;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 30rpx;
  border: 1px solid #8ab6c8;
  z-index: 10;
}

.lang-text {
  font-size: 26rpx;
  color: #8ab6c8;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 120rpx 0 60rpx;
  background-color: #ecf4f7;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  background-color: #8ab6c8;
  border-radius: 90rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 16rpx rgba(138, 182, 200, 0.3);
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.form-container {
  width: 90%;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 4rpx 30rpx rgba(0, 0, 0, 0.08);
  margin-top: -40rpx;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  padding: 0 20rpx;
  height: 90rpx;
  border: 1px solid #e6e9ed;
}

.input-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  color: #8ab6c8;
}

.input-field {
  flex: 1;
  height: 90rpx;
  font-size: 30rpx;
  color: #333;
  padding-right: 20rpx;
}

.forgot-password {
  text-align: right;
  margin-bottom: 50rpx;
}

.forgot-password text {
  font-size: 26rpx;
  color: #8ab6c8;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  background-color: #8ab6c8;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 45rpx;
  margin-bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 16rpx rgba(138, 182, 200, 0.3);
  border: none;
}

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-link text {
  font-size: 28rpx;
  color: #999;
}

.link-text {
  color: #8ab6c8;
  margin-left: 10rpx;
}

/* 语言选择弹窗 */
.language-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.popup-close {
  font-size: 40rpx;
  color: #999;
}

.language-list {
  padding: 30rpx;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.language-item:last-child {
  border-bottom: none;
}

.language-item.active {
  background-color: #f5f7fa;
}

.language-item text {
  font-size: 30rpx;
  color: #333;
}

.language-check {
  color: #8ab6c8;
  font-weight: bold;
}
</style> 