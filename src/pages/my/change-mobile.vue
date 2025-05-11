<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ currentLang === 'zh' ? '修改手机号' : 'Утасны дугаар солих' }}</text>
      </view>
    </view>
    
    <!-- 表单部分 -->
    <view class="form-container">
      <view class="current-phone">
        <text class="label">{{ currentLang === 'zh' ? '当前手机号：' : 'Одоогийн утасны дугаар:' }}</text>
        <text class="phone-number">{{ maskPhoneNumber(currentPhone) }}</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">{{ currentLang === 'zh' ? '新手机号' : 'Шинэ утасны дугаар' }}</text>
        <input 
          class="form-input" 
          type="number" 
          maxlength="11" 
          v-model="form.newPhone" 
          :placeholder="currentLang === 'zh' ? '请输入新手机号' : 'Шинэ утасны дугаар оруулна уу'"
        />
      </view>
      
      <view class="form-item verification-code">
        <text class="form-label">{{ currentLang === 'zh' ? '验证码' : 'Баталгаажуулах код' }}</text>
        <view class="code-input-container">
          <input 
            class="form-input code-input" 
            type="number" 
            maxlength="6" 
            v-model="form.code" 
            :placeholder="currentLang === 'zh' ? '请输入验证码' : 'Баталгаажуулах код оруулна уу'"
          />
          <view 
            class="get-code-btn" 
            :class="{ 'disabled': !isValidPhone || cooldown > 0 }" 
            @tap="getVerificationCode"
          >
            <text>{{ cooldown > 0 ? `${cooldown}s` : (currentLang === 'zh' ? '获取验证码' : 'Авах код') }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-btn" :class="{ 'disabled': isSubmitDisabled }" @tap="handleSubmit">
      <text>{{ currentLang === 'zh' ? '确认修改' : 'Баталгаажуулах' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import { getGlobalRequest } from '@/utils/platform.js';
import { userApi } from '@/api/index.js';

// 当前手机号
const currentPhone = ref('');

// 表单数据
const form = ref({
  newPhone: '',
  code: ''
});

// 当前语言
const currentLang = ref('zh');

// 验证码倒计时
const cooldown = ref(0);
let timer = null;

// 是否为有效手机号
const isValidPhone = computed(() => {
  return /^1\d{10}$/.test(form.value.newPhone);
});

// 是否禁用提交按钮
const isSubmitDisabled = computed(() => {
  return !isValidPhone.value || !form.value.code || form.value.code.length !== 6;
});

// 页面加载时执行
onMounted(() => {
  // 获取当前语言
  currentLang.value = getCurrentLang();
  
  // 获取当前用户手机号
  getCurrentUserPhone();
});

// 页面卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

// 获取当前用户手机号
const getCurrentUserPhone = () => {
  // 从本地存储或全局状态获取
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo && userInfo.phone) {
    currentPhone.value = userInfo.phone;
  }
  
  // 从后端获取最新手机号
  userApi.getProfile().then(res => {
    if (res.data && res.data.phone) {
      currentPhone.value = res.data.phone;
    }
  }).catch(err => {
    console.error('获取用户信息失败', err);
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 获取验证码
const getVerificationCode = () => {
  if (!isValidPhone.value || cooldown.value > 0) return;
  
  // 发送获取验证码请求
  uni.showLoading({ title: currentLang.value === 'zh' ? '发送中...' : 'Илгээж байна...' });
  
  const request = getGlobalRequest();
  request({
    url: '/api/user/phone/code',
    method: 'POST',
    data: { phone: form.value.newPhone }
  }).then(res => {
    uni.hideLoading();
    
    // 开始倒计时
    cooldown.value = 60;
    timer = setInterval(() => {
      cooldown.value--;
      if (cooldown.value <= 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
    
    uni.showToast({
      title: currentLang.value === 'zh' ? '验证码已发送' : 'Баталгаажуулах код илгээгдсэн',
      icon: 'success'
    });
  }).catch(err => {
    uni.hideLoading();
    
    uni.showToast({
      title: err.message || (currentLang.value === 'zh' ? '发送失败' : 'Илгээж чадсангүй'),
      icon: 'none'
    });
  });
};

// 提交表单
const handleSubmit = () => {
  if (isSubmitDisabled.value) return;
  
  uni.showLoading({ title: currentLang.value === 'zh' ? '提交中...' : 'Мэдээлэл хадгалж байна...' });
  
  const request = getGlobalRequest();
  request({
    url: '/api/user/phone',
    method: 'PUT',
    data: {
      phone: form.value.newPhone,
      code: form.value.code
    }
  }).then(res => {
    uni.hideLoading();
    
    uni.showToast({
      title: currentLang.value === 'zh' ? '手机号修改成功' : 'Утасны дугаар амжилттай солигдлоо',
      icon: 'success'
    });
    
    // 更新本地存储的手机号
    try {
      const userInfo = uni.getStorageSync('userInfo') || {};
      userInfo.phone = form.value.newPhone;
      uni.setStorageSync('userInfo', userInfo);
      
      // 触发全局事件，通知其他页面更新用户信息
      console.log('触发用户信息更新事件');
      uni.$emit('updateUserInfo');
      
      // 刷新上一页的数据
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.$vm && typeof prevPage.$vm.loadUserInfo === 'function') {
        prevPage.$vm.loadUserInfo();
      }
    } catch (e) {
      console.error('更新本地存储失败', e);
    }
    
    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }).catch(err => {
    uni.hideLoading();
    
    uni.showToast({
      title: err.message || (currentLang.value === 'zh' ? '修改失败' : 'Солиход алдаа гарлаа'),
      icon: 'none'
    });
  });
};

// 掩码手机号
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
  padding: 30rpx;
}

.current-phone {
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20rpx;
}

.current-phone .label {
  font-size: 28rpx;
  color: #666;
}

.current-phone .phone-number {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.form-item {
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}

/* 验证码输入 */
.verification-code {
  margin-bottom: 40rpx;
}

.code-input-container {
  display: flex;
  align-items: center;
}

.code-input {
  flex: 1;
  margin-right: 20rpx;
}

.get-code-btn {
  width: 200rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8ab6c8;
  color: #fff;
  font-size: 26rpx;
  border-radius: 8rpx;
}

.get-code-btn.disabled {
  background-color: #ccc;
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
}
</style> 