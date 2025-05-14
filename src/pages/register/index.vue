<template>
  <view class="register-container">
    <!-- 顶部状态栏模拟 -->
    <view class="status-bar">
      <text>📶 📊 🔋</text>
    </view>
    
    <!-- 返回按钮 -->
    <view class="back-btn" @tap="handleBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 品牌展示 -->
    <view class="brand">
      <view class="logo">
        <image class="logo-image" src="/static/images/logo.png" mode="aspectFit"></image>
      </view>
      <text class="app-name">敕勒云诊</text>
      <text class="welcome-text">{{ getTextByLang('创建一个新账户', 'ᠨᠢᠭᠡ ᠰᠢᠨ᠎ᠠ ᠳᠠᠩᠰᠠ ᠨᠡᠭᠡᠭᠡᠬᠦ') }}</text>
    </view>
    
    <!-- 注册表单 -->
    <view class="register-form">
      <view class="form-item">
        <text class="form-label">{{ getTextByLang('账号', 'ᠳᠠᠩᠰᠠ') }}</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="formData.username" 
          :placeholder="getTextByLang('请输入账号', 'ᠳᠠᠩᠰᠠ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ')" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ getTextByLang('手机号', 'ᠭᠠᠷ ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ') }}</text>
        <input 
          class="form-input" 
          type="number" 
          maxlength="11"
          v-model="formData.mobile" 
          :placeholder="getTextByLang('请输入手机号', 'ᠭᠠᠷ ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ ᠢᠢᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ')" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ getTextByLang('昵称', 'ᠬᠣᠴᠣᠷᠬᠠᠢ ᠨᠡᠷ᠎ᠡ') }}</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="formData.nickname" 
          :placeholder="getTextByLang('请输入昵称(选填)', 'ᠬᠣᠴᠣᠷᠬᠠᠢ ᠨᠡᠷ᠎ᠡ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ(ᠰᠣᠩᠭᠣᠵᠤ ᠪᠣᠯᠤᠨ᠎ᠠ)')" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ getTextByLang('密码', 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ') }}</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="formData.password" 
          :placeholder="getTextByLang('请输入密码', 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ')" 
          placeholder-class="input-placeholder"
          password
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ getTextByLang('确认密码', 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠪᠠᠲᠤᠯᠠᠬᠤ') }}</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="formData.confirmPassword" 
          :placeholder="getTextByLang('请再次输入密码', 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠳᠠᠬᠢᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ')" 
          placeholder-class="input-placeholder"
          password
        />
      </view>
      
      <button class="register-button" @tap="handleRegister">{{ getTextByLang('注 册', 'ᠪᠦᠷᠢᠳᠬᠡᠬᠦ') }}</button>
    </view>
    
    <!-- 登录链接 -->
    <view class="login-link">
      <text>{{ getTextByLang('已有账号? ', 'ᠳᠠᠩᠰᠠ ᠪᠠᠢᠬᠤ ᠤᠤ? ') }}</text>
      <text class="link" @tap="handleLogin">{{ getTextByLang('立即登录', 'ᠨᠡᠪᠲᠡᠷᠡᠬᠦ') }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authApi } from '@/api/index.js';
import { getCurrentLang, setLanguage } from '@/i18n/index.js';

// 当前语言
const currentLang = ref('zh');

// 表单数据
const formData = ref({
  username: '',      // 用户名/账号 - 对应后端的account
  password: '',      // 密码
  confirmPassword: '', // 确认密码
  mobile: '',        // 手机号 - 对应后端的phone
  nickname: ''       // 昵称
});

// 页面加载时检查登录状态
onMounted(() => {
  // 获取当前语言设置
  currentLang.value = getCurrentLang();
  
  // 检查是否已登录，如果已登录直接跳转到首页
  const isLoggedIn = uni.getStorageSync('isLoggedIn');
  if (isLoggedIn) {
    console.log('注册页检测到已登录状态，自动跳转到首页');
    uni.reLaunch({
      url: '/pages/index/index'
    });
    return;
  }
  
  // 不再自动填入测试数据
  formData.value.username = '';
  formData.value.password = '';
  formData.value.confirmPassword = '';
  formData.value.mobile = '';
  formData.value.nickname = '';
});

// 处理注册
const handleRegister = () => {
  // 验证表单
  if (!formData.value.username) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '请输入账号' : 'ᠳᠠᠩᠰᠠ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.value.password) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '请输入密码' : 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      icon: 'none'
    });
    return;
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '两次输入的密码不一致' : 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠨᠢ ᠠᠳᠠᠯᠢᠬᠠᠨ ᠪᠢᠰᠢ ᠪᠠᠢᠨ᠎ᠠ',
      icon: 'none'
    });
    return;
  }
  
  // 显示注册中提示
  uni.showLoading({
    title: currentLang.value === 'zh' ? '注册中...' : 'ᠪᠦᠷᠢᠳᠬᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...'
  });
  
  // 调用注册接口
  authApi.register({
    username: formData.value.username,
    password: formData.value.password,
    confirmPassword: formData.value.confirmPassword,
    mobile: formData.value.mobile,
    nickname: formData.value.nickname || formData.value.username
  }).then(res => {
    // 隐藏加载提示
    uni.hideLoading();
    
    // 检查响应是否包含错误码
    if (res.code && res.code !== 200) {
      uni.showToast({
        title: res.message || (currentLang.value === 'zh' ? '注册失败' : 'ᠪᠦᠷᠢᠳᠬᠡᠬᠦ ᠳᠤ ᠠᠮᠵᠢᠯᠲᠠᠥᠬᠡᠢ ᠪᠣᠯᠪᠠ'),
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 显示注册成功
    uni.showToast({
      title: currentLang.value === 'zh' ? '注册成功' : 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠪᠦᠷᠢᠳᠬᠡᠪᠡ',
      icon: 'success',
      duration: 1500
    });
    
    // 延迟跳转，等待提示显示完毕
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/index'
      });
    }, 1500);
  }).catch(err => {
    // 隐藏加载提示
    uni.hideLoading();
    
    // 显示错误信息
    uni.showToast({
      title: err.message || (currentLang.value === 'zh' ? '注册失败' : 'ᠪᠦᠷᠢᠳᠬᠡᠬᠦ ᠳᠤ ᠠᠮᠵᠢᠯᠲᠠᠥᠬᠡᠢ ᠪᠣᠯᠪᠠ'),
      icon: 'none',
      duration: 2000
    });
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 跳转到登录页
const handleLogin = () => {
  uni.redirectTo({
    url: '/pages/login/index'
  });
};

// 获取不同语言的文本
const getTextByLang = (zhText, mnText) => {
  return currentLang.value === 'zh' ? zhText : mnText;
};
</script>

<style>
.register-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
  padding: 0 30rpx;
  position: relative;
}

.status-bar {
  height: 44rpx;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  color: #333;
}

.back-btn {
  position: absolute;
  top: 60rpx;
  left: 30rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.back-icon {
  font-size: 40rpx;
  color: #1F2937;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 60rpx;
}

.logo {
  width: 144rpx;
  height: 144rpx;
  background: transparent;
  border-radius: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32rpx;
  box-shadow: 0 16rpx 32rpx rgba(37, 99, 235, 0.2);
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
}

.app-name {
  color: #1F2937;
  font-size: 48rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.welcome-text {
  color: #6B7280;
  font-size: 28rpx;
}

.register-form {
  width: 100%;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  margin-bottom: 16rpx;
  color: #374151;
  font-size: 28rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 32rpx;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 20rpx;
  font-size: 32rpx;
  color: #1F2937;
}

.input-placeholder {
  color: #9CA3AF;
}

.register-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 20rpx;
  color: white;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.login-link {
  margin-top: 60rpx;
  text-align: center;
  font-size: 28rpx;
  color: #6B7280;
}

.link {
  color: #3B82F6;
  font-weight: 500;
}
</style> 