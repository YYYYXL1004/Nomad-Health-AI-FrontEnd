<template>
  <view class="container">
    <!-- 顶部用户信息 -->
    <view class="user-info-section">
      <view class="user-avatar">
        <image 
          :src="userInfo.avatar || '/src/static/images/default-avatar.jpg'" 
          mode="aspectFill"
        ></image>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.username || '游客' }}</text>
        <text class="user-id">ID: {{ userInfo.userId || '--' }}</text>
      </view>
      <view class="edit-btn" @tap="editProfile">
        <text>{{ $t('my.editProfile') }}</text>
      </view>
    </view>
    
    <!-- 详细信息展示区 -->
    <view v-if="showDetailInfo" class="detail-info-section">
      <view class="detail-item" v-if="userInfo.phone">
        <text class="detail-label">{{ $t('my.phoneLabel') }}</text>
        <text class="detail-value">{{ userInfo.phone }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.gender">
        <text class="detail-label">{{ $t('my.genderLabel') }}</text>
        <text class="detail-value">{{ 
          userInfo.gender === 'male' ? $t('my.male') : 
          userInfo.gender === 'female' ? $t('my.female') : $t('my.unset') 
        }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.birthday">
        <text class="detail-label">{{ $t('my.birthdayLabel') }}</text>
        <text class="detail-value">{{ userInfo.birthday || $t('my.unset') }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.height">
        <text class="detail-label">{{ $t('my.heightLabel') }}</text>
        <text class="detail-value">{{ userInfo.height ? userInfo.height + ' cm' : $t('my.unset') }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.weight">
        <text class="detail-label">{{ $t('my.weightLabel') }}</text>
        <text class="detail-value">{{ userInfo.weight ? userInfo.weight + ' kg' : $t('my.unset') }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.email">
        <text class="detail-label">{{ $t('my.emailLabel') }}</text>
        <text class="detail-value">{{ userInfo.email || $t('my.unset') }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.address">
        <text class="detail-label">{{ $t('my.addressLabel') }}</text>
        <text class="detail-value">{{ userInfo.address || $t('my.unset') }}</text>
      </view>
      <view class="detail-item" v-if="userInfo.created_at">
        <text class="detail-label">{{ $t('my.registerTimeLabel') }}</text>
        <text class="detail-value">{{ userInfo.created_at }}</text>
      </view>
      <view class="detail-toggle" @tap="showDetailInfo = false">
        <text>{{ $t('my.collapseInfo') }}</text>
      </view>
    </view>
    <view v-else class="detail-toggle" @tap="showDetailInfo = true">
      <text>{{ $t('my.viewMoreInfo') }}</text>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-title">
        <text>{{ $t('my.healthServices') }}</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" @tap="navigateTo('/pages/my/health-records')">
          <view class="menu-icon health-icon">📋</view>
          <view class="menu-info">
            <text class="menu-name">{{ $t('my.healthRecords') }}</text>
          </view>
          <text class="menu-arrow">></text>
        </view>
        
        <view class="menu-item" @tap="navigateTo('/pages/my/consultations')">
          <view class="menu-icon consultation-icon">💬</view>
          <view class="menu-info">
            <text class="menu-name">{{ $t('my.consultHistory') }}</text>
          </view>
          <text class="menu-arrow">></text>
        </view>
        
        <view class="menu-item" @tap="navigateTo('/pages/my/prescriptions')">
          <view class="menu-icon prescription-icon">💊</view>
          <view class="menu-info">
            <text class="menu-name">{{ $t('my.prescriptions') }}</text>
          </view>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
    
    <!-- 设置菜单 -->
    <view class="menu-section">
      <view class="menu-title">
        <text>{{ $t('settings.title') }}</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" @tap="navigateTo('/pages/my/settings')">
          <view class="menu-icon settings-icon">⚙️</view>
          <view class="menu-info">
            <text class="menu-name">{{ $t('my.appSettings') }}</text>
          </view>
          <text class="menu-arrow">></text>
        </view>
        
        <view class="menu-item" @tap="logout">
          <view class="menu-icon logout-icon">🔓</view>
          <view class="menu-info">
            <text class="menu-name">{{ $t('auth.logout') }}</text>
          </view>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
    
    <!-- 底部版本信息 -->
    <view class="version-info">
      <text>{{ $t('my.version') }}: 1.0.0</text>
    </view>
    
    <!-- 使用通用底部导航栏组件 -->
    <custom-tab-bar active="my" />
  </view>
</template>

<script setup>
import { ref, onMounted, onActivated, onBeforeUnmount } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import CustomTabBar from '@/components/CustomTabBar.vue';
import { userApi, authApi } from '@/api/index.js';
import { getAppInstance } from '@/utils/platform.js';

// 当前语言
const currentLang = ref(getCurrentLang());

// 用户信息
const userInfo = ref({
  userId: '',
  account: '',
  username: '',
  nickname: '',
  avatar: '',
  phone: '',
  gender: '',
  birthday: null,
  height: 0,
  weight: 0,
  email: '',
  address: '',
  created_at: ''
});

// 详细信息展示控制
const showDetailInfo = ref(false);

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});

// 页面激活时重新获取用户信息（如从其他页面返回）
onActivated(() => {
  console.log('我的页面被激活，重新获取用户信息');
  fetchUserInfo();
});

// 添加页面显示的事件监听
uni.$on('updateUserInfo', () => {
  console.log('收到更新用户信息的事件，刷新数据');
  fetchUserInfo();
});

// 组件销毁时移除事件监听
onBeforeUnmount(() => {
  uni.$off('updateUserInfo');
});

// 获取用户信息
const fetchUserInfo = () => {
  // 获取存储的用户基本信息
  const storedInfo = uni.getStorageSync('userInfo');
  if (storedInfo) {
    userInfo.value = { ...userInfo.value, ...storedInfo };
    
    // 确保头像路径格式正确
    if (userInfo.value.avatar && !userInfo.value.avatar.startsWith('http') && !userInfo.value.avatar.startsWith('/')) {
      // 如果不是http链接或绝对路径，则修正格式
      userInfo.value.avatar = '/src/static/images/default-avatar.jpg';
    }
  }
  
  // 调用API获取完整用户信息
  userApi.getProfile().then(res => {
    if (res.data) {
      console.log('API返回的用户信息：', res.data);
      
      // 处理头像URL
      let avatarUrl = res.data.avatar || userInfo.value.avatar || '/src/static/images/default-avatar.jpg';
      
      // 如果头像URL是blob格式，使用默认头像
      if (avatarUrl && (avatarUrl.startsWith('blob:') || avatarUrl === '')) {
        avatarUrl = '/src/static/images/default-avatar.jpg';
        console.log('使用默认头像路径:', avatarUrl);
      }
      
      // 合并数据，保留头像等已有信息
      userInfo.value = { 
        ...userInfo.value,
        ...res.data,
        avatar: avatarUrl,
        // 确保使用nickname作为显示名称
        username: res.data.nickname || res.data.account || userInfo.value.username || '游客'
      };
      
      // 打印完整的用户信息用于调试
      console.log('合并后的完整用户信息：', userInfo.value);
      
      // 更新存储的用户信息 - 保存所有字段
      uni.setStorageSync('userInfo', {
        userId: res.data.userId,
        account: res.data.account,
        username: res.data.nickname || res.data.account,
        nickname: res.data.nickname,
        avatar: avatarUrl,
        phone: res.data.phone,
        gender: res.data.gender,
        birthday: res.data.birthday,
        height: res.data.height,
        weight: res.data.weight,
        email: res.data.email,
        address: res.data.address,
        created_at: res.data.created_at
      });
    }
  }).catch(err => {
    console.error('获取用户信息失败', err);
    
    // 如果是401错误（未授权），跳转到登录页
    if (err.code === 401) {
      uni.removeStorageSync('token');
      uni.removeStorageSync('userId');
      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('isLoggedIn');
      
      uni.reLaunch({
        url: '/pages/login/index'
      });
    }
  });
};

// 导航到其他页面
const navigateTo = (url) => {
  uni.navigateTo({ url });
};

// 编辑个人资料
const editProfile = () => {
  uni.navigateTo({
    url: '/pages/my/edit-profile'
  });
};

// 退出登录
const logout = () => {
  // 提示文本
  const logoutConfirmText = currentLang.value === 'zh' ? '确定要退出登录吗？' : 'Та системээс гарахдаа итгэлтэй байна уу?';
  
  uni.showModal({
    title: currentLang.value === 'zh' ? '提示' : 'Анхааруулга',
    content: logoutConfirmText,
    success: (res) => {
      if (res.confirm) {
        // 显示加载中
        uni.showLoading({
          title: currentLang.value === 'zh' ? '退出中...' : 'Гарч байна...'
        });
        
        // 调用登出API
        authApi.logout().then((res) => {
          console.log('退出登录成功:', res);
          uni.hideLoading();
          handleLogoutSuccess();
        }).catch(err => {
          console.error('退出登录失败:', err);
          uni.hideLoading();
          // 即使API失败，也强制清除本地存储并跳转
          handleLogoutSuccess();
        });
      }
    }
  });
};

// 处理退出登录成功
const handleLogoutSuccess = () => {
  // 清除本地存储的用户信息和token
  uni.removeStorageSync('token');
  uni.removeStorageSync('userId');
  uni.removeStorageSync('userInfo');
  uni.removeStorageSync('isLoggedIn');
          
  // 显示提示
  const logoutSuccessText = currentLang.value === 'zh' ? '退出登录成功' : 'Системээс амжилттай гарлаа';
  
  uni.showToast({
    title: logoutSuccessText,
    icon: 'success',
    duration: 1500
  });
  
  // 延迟跳转，等待提示显示完毕
  setTimeout(() => {
    // 使用reLaunch确保完全刷新页面
    uni.reLaunch({
      url: '/pages/login/index'
    });
  }, 1500);
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; /* 为底部导航留出空间 */
}

/* 用户信息区域 */
.user-info-section {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  background-color: #8ab6c8;
  color: #fff;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  margin-right: 30rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  background-color: #ffffff; /* 添加背景色 */
}

.user-avatar image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填满容器 */
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  opacity: 0.8;
}

.edit-btn {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 30rpx;
}

.edit-btn text {
  font-size: 24rpx;
  color: #fff;
}

/* 菜单区域 */
.menu-section {
  margin: 30rpx 30rpx 0;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.menu-title {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-title text {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.menu-list {
  padding: 0 30rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-info {
  flex: 1;
}

.menu-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.menu-desc {
  font-size: 24rpx;
  color: #999;
}

.menu-arrow {
  font-size: 30rpx;
  color: #ccc;
}

/* 底部版本信息 */
.version-info {
  padding: 40rpx 0;
  text-align: center;
}

.version-info text {
  font-size: 24rpx;
  color: #999;
}

/* 详细信息展示区 */
.detail-info-section {
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.detail-item {
  margin-bottom: 20rpx;
}

.detail-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.detail-value {
  font-size: 24rpx;
  color: #666;
}

.detail-toggle {
  padding: 20rpx 30rpx;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 16rpx;
  margin: 20rpx 30rpx;
}

.detail-toggle text {
  font-size: 24rpx;
  color: #333;
}
</style> 