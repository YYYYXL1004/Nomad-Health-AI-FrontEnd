<template>
  <view class="register-container">
    <!-- 顶部状态栏模拟 -->
    <view class="status-bar">
      <text>12:30</text>
      <text>📶 📊 🔋</text>
    </view>
    
    <!-- 返回按钮 -->
    <view class="back-btn" @tap="handleBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- 品牌展示 -->
    <view class="brand">
      <view class="logo">
        <text class="logo-text">A</text>
      </view>
      <text class="app-name">App Name</text>
      <text class="welcome-text">创建一个新账户</text>
    </view>
    
    <!-- 注册表单 -->
    <view class="register-form">
      <view class="form-item">
        <text class="form-label">账号</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="formData.username" 
          placeholder="请输入账号" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input 
          class="form-input" 
          type="number" 
          maxlength="11"
          v-model="formData.mobile" 
          placeholder="请输入手机号" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="formData.nickname" 
          placeholder="请输入昵称(选填)" 
          placeholder-class="input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">密码</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="formData.password" 
          placeholder="请输入密码" 
          placeholder-class="input-placeholder"
          password
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">确认密码</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="formData.confirmPassword" 
          placeholder="请再次输入密码" 
          placeholder-class="input-placeholder"
          password
        />
      </view>
      
      <button class="register-button" @tap="handleRegister">注 册</button>
    </view>
    
    <!-- 登录链接 -->
    <view class="login-link">
      <text>已有账号? </text>
      <text class="link" @tap="handleLogin">立即登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authApi } from '@/api/index.js';

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
  // 检查是否已登录，如果已登录直接跳转到首页
  const isLoggedIn = uni.getStorageSync('isLoggedIn');
  if (isLoggedIn) {
    console.log('注册页检测到已登录状态，自动跳转到首页');
    uni.reLaunch({
      url: '/pages/index/index'
    });
    return;
  }
  
  // 自动填入测试数据方便测试
  formData.value.username = 'newuser';
  formData.value.password = '123456';
  formData.value.confirmPassword = '123456';
  formData.value.mobile = '13800138000';
  formData.value.nickname = '新用户';
});

// 处理注册
const handleRegister = () => {
  // 验证表单
  if (!formData.value.username) {
    uni.showToast({
      title: '请输入账号',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.value.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  // 显示注册中提示
  uni.showLoading({
    title: '注册中...'
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
        title: res.message || '注册失败',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 显示注册成功
    uni.showToast({
      title: '注册成功',
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
      title: err.message || '注册失败',
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
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32rpx;
  box-shadow: 0 16rpx 32rpx rgba(37, 99, 235, 0.2);
}

.logo-text {
  color: white;
  font-size: 72rpx;
  font-weight: bold;
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