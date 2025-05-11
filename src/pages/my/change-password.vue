<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ currentLang === 'zh' ? '修改密码' : 'Нууц үг солих' }}</text>
      </view>
    </view>
    
    <!-- 表单部分 -->
    <view class="form-container">
      <view class="form-item">
        <text class="form-label">{{ currentLang === 'zh' ? '当前密码' : 'Одоогийн нууц үг' }}</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="form.oldPassword" 
          :placeholder="currentLang === 'zh' ? '请输入当前密码' : 'Одоогийн нууц үгээ оруулна уу'"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ currentLang === 'zh' ? '新密码' : 'Шинэ нууц үг' }}</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="form.newPassword" 
          :placeholder="currentLang === 'zh' ? '请输入新密码' : 'Шинэ нууц үгээ оруулна уу'"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ currentLang === 'zh' ? '确认新密码' : 'Шинэ нууц үгээ баталгаажуулах' }}</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="form.confirmPassword" 
          :placeholder="currentLang === 'zh' ? '请再次输入新密码' : 'Шинэ нууц үгээ дахин оруулна уу'"
        />
      </view>
      
      <view class="password-tips">
        <text>{{ currentLang === 'zh' ? '密码要求：' : 'Нууц үгийн шаардлага:' }}</text>
        <text>{{ currentLang === 'zh' ? '1. 长度不少于8位' : '1. 8-аас доошгүй тэмдэгт' }}</text>
        <text>{{ currentLang === 'zh' ? '2. 包含大小写字母和数字' : '2. Том, жижиг үсэг, тоо агуулсан байх' }}</text>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-btn" :class="{ 'disabled': isSubmitDisabled }" @tap="handleSubmit">
      <text>{{ currentLang === 'zh' ? '确认修改' : 'Баталгаажуулах' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import { getGlobalRequest } from '@/utils/platform.js';

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 加载状态
const loading = ref(false);

// 当前语言
const currentLang = ref('zh');

// 是否禁用提交按钮
const isSubmitDisabled = computed(() => {
  return !form.value.oldPassword || 
         !form.value.newPassword || 
         !form.value.confirmPassword || 
         form.value.newPassword !== form.value.confirmPassword ||
         form.value.newPassword.length < 8 ||
         loading.value;
});

// 页面加载时执行
onMounted(() => {
  // 获取当前语言
  currentLang.value = getCurrentLang();
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 提交表单
const handleSubmit = () => {
  if (isSubmitDisabled.value) return;
  
  // 验证密码格式
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.value.newPassword)) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '密码不符合要求' : 'Нууц үг шаардлага хангахгүй байна',
      icon: 'none'
    });
    return;
  }
  
  // 验证确认密码
  if (form.value.newPassword !== form.value.confirmPassword) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '两次输入的密码不一致' : 'Нууц үг таарахгүй байна',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载状态
  loading.value = true;
  
  // 实际API调用
  const request = getGlobalRequest();
  request({
    url: '/api/user/password',
    method: 'PUT',
    data: {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    }
  }).then(res => {
    loading.value = false;
    
    uni.showToast({
      title: currentLang.value === 'zh' ? '密码修改成功' : 'Нууц үг амжилттай солигдлоо',
      icon: 'success'
    });
    
    // 延迟返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }).catch(err => {
    loading.value = false;
    
    uni.showToast({
      title: err.message || (currentLang.value === 'zh' ? '密码修改失败' : 'Нууц үг солиход алдаа гарлаа'),
      icon: 'none'
    });
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 导航栏 */
.nav-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  background-color: #8ab6c8;
  padding: 0 30rpx;
}

.back-btn {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
}

.back-icon {
  color: #fff;
  font-size: 32rpx;
}

.page-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

/* 表单部分 */
.form-container {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 0 30rpx;
}

.form-item {
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input {
  width: 100%;
  height: 70rpx;
  font-size: 28rpx;
  color: #333;
}

/* 密码提示 */
.password-tips {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.password-tips text {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 提交按钮 */
.submit-btn {
  margin: 40rpx 30rpx;
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8ab6c8;
  color: #fff;
  font-size: 32rpx;
  border-radius: 8rpx;
}

.submit-btn.disabled {
  background-color: #ccc;
  color: #fff;
}
</style> 