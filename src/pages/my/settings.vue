<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('settings.title') }}</text>
      </view>
    </view>
    
    <!-- 设置列表 -->
    <scroll-view class="content-container" scroll-y="true">
      <!-- 账号安全 -->
      <view class="settings-card">
        <view class="card-title">
          <text>{{ $t('settings.accountSecurity') }}</text>
        </view>
        
        <view class="settings-item" @tap="handleChangePassword">
          <text class="item-label">{{ $t('settings.changePassword') }}</text>
          <text class="item-arrow">›</text>
        </view>
        
        <view class="settings-item" @tap="handleChangeMobile">
          <text class="item-label">{{ $t('settings.changeMobile') }}</text>
          <text class="item-value">{{ maskPhoneNumber(userInfo.phone) }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>
      
      <!-- 消息通知 -->
      <view class="settings-card">
        <view class="card-title">
          <text>{{ $t('settings.notifications') }}</text>
        </view>
        
        <view class="settings-item">
          <text class="item-label">{{ $t('settings.pushNotification') }}</text>
          <switch :checked="settings.notification.push" @change="switchNotification('push', $event.detail.value)" color="#8ab6c8" />
        </view>
        
        <view class="settings-item">
          <text class="item-label">{{ $t('settings.soundNotification') }}</text>
          <switch :checked="settings.notification.sms" @change="switchNotification('sms', $event.detail.value)" color="#8ab6c8" />
        </view>
      </view>
      
      <!-- 通用设置 -->
      <view class="settings-card">
        <view class="card-title">
          <text>{{ $t('settings.generalSettings') }}</text>
        </view>
        
        <view class="settings-item" @tap="handleLanguageChange">
          <text class="item-label">{{ $t('settings.language') }}</text>
          <text class="item-value">{{ getCurrentLanguageName() }}</text>
          <text class="item-arrow">›</text>
        </view>
        
        <view class="settings-item" @tap="handleClearCache">
          <text class="item-label">{{ $t('settings.clearCache') }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>
      
      <!-- 关于我们 -->
      <view class="settings-card">
        <view class="card-title">
          <text>{{ $t('settings.aboutUs') }}</text>
        </view>
        
        <view class="settings-item" @tap="handlePrivacyPolicy">
          <text class="item-label">{{ $t('settings.privacyPolicy') }}</text>
          <text class="item-arrow">›</text>
        </view>
        
        <view class="settings-item" @tap="handleUserAgreement">
          <text class="item-label">{{ $t('settings.userAgreement') }}</text>
          <text class="item-arrow">›</text>
        </view>
        
        <view class="settings-item" @tap="handleAboutApp">
          <text class="item-label">{{ $t('settings.aboutApp') }}</text>
          <text class="item-value">{{ appVersion }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 语言选择弹窗 -->
    <view class="language-popup" v-if="showLanguagePopup">
      <view class="popup-mask" @tap="cancelLanguageSelection"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ $t('settings.selectLanguage') }}</text>
          <text class="popup-close" @tap="cancelLanguageSelection">×</text>
        </view>
        
        <view class="language-list">
          <view 
            class="language-item" 
            :class="{ active: currentLanguage === 'zh' }"
            @tap="selectLanguage('zh')"
          >
            <text>{{ $t('settings.chinese') }}</text>
            <text v-if="currentLanguage === 'zh'" class="language-check">✓</text>
          </view>
          
          <view 
            class="language-item" 
            :class="{ active: currentLanguage === 'mn_trad' }"
            @tap="selectLanguage('mn_trad')"
          >
            <text>{{ $t('settings.mongolian') }}</text>
            <text v-if="currentLanguage === 'mn_trad'" class="language-check">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from 'vue';
import { getCurrentLang, setLanguage } from '@/i18n/index.js';
import { getGlobalRequest } from '@/utils/platform.js';
import { userApi } from '@/api/index.js';

// 用户信息
const userInfo = ref({
  phone: ''
});

// 应用版本
const appVersion = '1.0.0';

// 当前语言
const currentLang = ref(getCurrentLang());

// 设置项数据
const settings = ref({
  language: currentLang.value, // 默认语言
  notification: {
    push: true,
    email: false,
    sms: true
  },
  privacy: {
    shareHealthData: false,
    shareLocation: true
  },
  display: {
    theme: 'light',
    fontSize: 'medium'
  }
});

// 页面状态
const loading = ref(true);
const error = ref('');
const isSaving = ref(false);
const saveSuccess = ref(false);

// 语言选择弹窗
const showLanguagePopup = ref(false);
const currentLanguage = ref(getCurrentLang());

// 页面加载时获取设置和用户信息
onMounted(() => {
  // 确保当前语言与存储一致
  currentLanguage.value = getCurrentLang();
  loadSettings();
  loadUserInfo();
});

// 页面激活时重新获取用户信息（如从其他页面返回）
onActivated(() => {
  console.log('设置页面被激活，重新获取用户信息');
  loadUserInfo();
});

// 加载用户信息
const loadUserInfo = () => {
  // 从本地存储获取最新用户信息
  const storedUserInfo = uni.getStorageSync('userInfo');
  if (storedUserInfo && storedUserInfo.phone) {
    userInfo.value.phone = storedUserInfo.phone;
    console.log('从本地存储加载的用户手机号:', userInfo.value.phone);
  }
  
  // 调用API获取完整用户信息
  userApi.getProfile().then(res => {
    if (res.data && res.data.phone) {
      userInfo.value.phone = res.data.phone;
      console.log('从API获取的用户手机号:', userInfo.value.phone);
      
      // 更新本地存储中的手机号
      try {
        const currentUserInfo = uni.getStorageSync('userInfo') || {};
        currentUserInfo.phone = res.data.phone;
        uni.setStorageSync('userInfo', currentUserInfo);
      } catch (e) {
        console.error('更新本地存储用户手机号失败', e);
      }
    }
  }).catch(err => {
    console.error('获取用户信息失败', err);
  });
};

// 加载设置
const loadSettings = () => {
  loading.value = true;
  error.value = '';
  
  const request = getGlobalRequest();
  request({
    url: '/api/settings',
    method: 'GET'
  }).then(res => {
    loading.value = false;
    
    if (res.data) {
      // 如果返回的语言设置与当前应用语言不一致，先更新应用语言
      if (res.data.language && res.data.language !== currentLang.value) {
        setLanguage(res.data.language);
        currentLang.value = res.data.language;
      }
      
      // 更新设置数据
      settings.value = {
        language: res.data.language || currentLang.value,
        notification: res.data.notification || settings.value.notification,
        privacy: res.data.privacy || settings.value.privacy,
        display: res.data.display || settings.value.display
      };
    }
  }).catch(err => {
    loading.value = false;
    error.value = (err.errors && err.errors[0]) || (currentLang.value === 'zh' ? '获取设置失败' : 'Тохиргоог авч чадсангүй');
    console.error('获取设置失败', err);
  });
};

// 保存设置
const saveSettings = () => {
  isSaving.value = true;
  saveSuccess.value = false;
  
  const request = getGlobalRequest();
  request({
    url: '/api/settings',
    method: 'PUT',
    data: settings.value
  }).then(res => {
    isSaving.value = false;
    
    if (res.data) {
      saveSuccess.value = true;
      
      // 如果语言设置发生变化，更新应用语言
      if (res.data.language && res.data.language !== currentLang.value) {
        setLanguage(res.data.language);
        currentLang.value = res.data.language;
      }
      
      // 显示成功提示
      uni.showToast({
        title: currentLang.value === 'zh' ? '保存成功' : 'Амжилттай хадгалагдлаа',
        icon: 'success',
        duration: 2000
      });
    }
  }).catch(err => {
    isSaving.value = false;
    console.error('保存设置失败', err);
    
    // 显示错误提示
    uni.showToast({
      title: (err.errors && err.errors[0]) || (currentLang.value === 'zh' ? '保存失败' : 'Хадгалж чадсангүй'),
      icon: 'none',
      duration: 2000
    });
  });
};

// 切换语言
const switchLanguage = (lang) => {
  if (settings.value.language === lang) return;
  
  settings.value.language = lang;
  saveSettings();
};

// 切换通知设置
const switchNotification = (type, value) => {
  if (settings.value.notification[type] === value) return;
  
  settings.value.notification[type] = value;
  saveSettings();
};

// 切换隐私设置
const switchPrivacy = (type, value) => {
  if (settings.value.privacy[type] === value) return;
  
  settings.value.privacy[type] = value;
  saveSettings();
};

// 切换显示设置
const switchDisplay = (field, value) => {
  if (settings.value.display[field] === value) return;
  
  settings.value.display[field] = value;
  saveSettings();
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 掩码手机号
const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 获取当前语言名称
const getCurrentLanguageName = () => {
  return currentLanguage.value === 'zh' ? '中文' : 'ᠮᠣᠩᠭᠣᠯ';
};

// 处理修改密码
const handleChangePassword = () => {
  uni.navigateTo({
    url: '/pages/my/change-password'
  });
};

// 处理修改手机号
const handleChangeMobile = () => {
  uni.navigateTo({
    url: '/pages/my/change-mobile'
  });
};

// 处理语言切换
const handleLanguageChange = () => {
  showLanguagePopup.value = true;
};

// 选择语言
const selectLanguage = (lang) => {
  console.log('选择语言:', lang, '当前语言:', currentLanguage.value);
  
  if (currentLanguage.value === lang) {
    showLanguagePopup.value = false;
    return;
  }
  
  // 先更新本地变量
  currentLanguage.value = lang;
  
  // 保存语言设置到本地存储
  try {
    uni.setStorageSync('language', lang);
    console.log('语言设置已保存到本地存储:', lang);
  } catch (e) {
    console.error('保存语言设置失败:', e);
  }
  
  // 调用i18n的setLanguage方法直接切换语言
  const result = setLanguage(lang);
  console.log('调用setLanguage结果:', result);
  
  // 关闭弹窗
  showLanguagePopup.value = false;
  
  // 显示切换成功提示
  uni.showToast({
    title: lang === 'zh' ? '语言已切换' : 'ᠬᠡᠯᠡ ᠰᠣᠯᠢᠭᠳᠠᠯᠠᠭ᠎ᠠ',
    icon: 'success'
  });
  
  // 重新加载主页以应用新的语言设置
  console.log('准备重新加载主页...');
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }, 1500);
};

// 取消语言选择
const cancelLanguageSelection = () => {
  showLanguagePopup.value = false;
};

// 处理清除缓存
const handleClearCache = () => {
  uni.showModal({
    title: '',
    content: currentLanguage.value === 'zh' ? '确定要清除缓存吗？' : 'ᠺᠧᠰ ᠢ ᠠᠷᠢᠯᠭᠠᠬᠤ ᠳᠠᠭᠠᠨ ᠢᠲᠡᠭᠡᠯᠲᠡᠢ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ?',
    success: (res) => {
      if (res.confirm) {
        // 这里可以添加清除缓存的逻辑
        uni.showToast({
          title: currentLanguage.value === 'zh' ? '缓存已清除' : 'ᠺᠧᠰ ᠠᠷᠢᠯᠭᠠᠭᠳᠠᠯᠠᠭ᠎ᠠ',
          icon: 'success'
        });
      }
    }
  });
};

// 处理隐私政策
const handlePrivacyPolicy = () => {
  uni.navigateTo({
    url: '/pages/about/privacy-policy'
  });
};

// 处理用户协议
const handleUserAgreement = () => {
  uni.navigateTo({
    url: '/pages/about/user-agreement'
  });
};

// 处理关于应用
const handleAboutApp = () => {
  uni.navigateTo({
    url: '/pages/about/about-app'
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

/* 顶部导航 */
.nav-header {
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #8ab6c8;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 20rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #777;
  border-radius: 8rpx;
}

.back-icon {
  color: #fff;
  font-size: 32rpx;
}

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
}

/* 内容区域 */
.content-container {
  flex: 1;
  padding: 20rpx;
}

.settings-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.card-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 28rpx;
  color: #333;
}

.item-value {
  font-size: 26rpx;
  color: #999;
  margin-right: 10rpx;
}

.item-arrow {
  font-size: 30rpx;
  color: #ccc;
}

/* 语言选择弹窗 */
.language-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
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
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.popup-close {
  font-size: 40rpx;
  color: #999;
  padding: 0 20rpx;
}

.language-list {
  padding: 20rpx 0;
}

.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 20rpx;
  font-size: 30rpx;
  color: #333;
}

.language-item.active {
  color: #8ab6c8;
}

.language-check {
  font-size: 32rpx;
  color: #8ab6c8;
}
</style> 