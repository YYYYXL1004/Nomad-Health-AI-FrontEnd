<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="page-title">{{ pageTitle || '网页' }}</text>
    </view>
    
    <!-- 网页内容区域 -->
    <view class="webview-container">
      <web-view :src="webUrl" @message="handleMessage" @error="handleError"></web-view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading-mask" v-if="isLoading">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getCurrentLang } from '@/i18n/index.js';

export default {
  data() {
    return {
      webUrl: '',
      pageTitle: '',
      isLoading: true,
      currentLang: getCurrentLang()
    }
  },
  computed: {
    loadingText() {
      return this.currentLang === 'zh' ? '加载中...' : 'ᠠᠴᠢᠶᠠᠯᠠᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ...';
    }
  },
  onLoad(options) {
    // 获取URL参数
    if (options.url) {
      this.webUrl = decodeURIComponent(options.url);
      console.log('打开网页:', this.webUrl);
    } else {
      this.handleInvalidUrl();
      return;
    }
    
    // 设置页面标题
    if (options.title) {
      this.pageTitle = decodeURIComponent(options.title);
    }
    
    // 3秒后自动隐藏加载状态（实际环境应监听网页加载事件）
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果无法返回上一页，则跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    
    // 处理无效URL
    handleInvalidUrl() {
      uni.showToast({
        title: this.currentLang === 'zh' ? '无效的网址' : 'ᠬᠦᠴᠦᠨ ᠦᠭᠡᠢ ᠸᠧᠪ ᠬᠠᠶᠢᠭ',
        icon: 'none'
      });
      setTimeout(() => {
        this.goBack();
      }, 1500);
    },
    
    // 处理web-view消息
    handleMessage(event) {
      console.log('收到web-view消息:', event);
    },
    
    // 处理web-view错误
    handleError(event) {
      console.error('web-view加载错误:', event);
      uni.showToast({
        title: this.currentLang === 'zh' ? '页面加载失败' : 'ᠬᠤᠭᠤᠴᠠᠭ᠎ᠠ ᠨᠢ ᠳᠠᠭᠤᠰᠤᠭᠰᠠᠨ',
        icon: 'none'
      });
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.header {
  height: 90rpx;
  background-color: #8ab6c8;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  position: relative;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-icon {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  padding: 0 100rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 网页容器 */
.webview-container {
  flex: 1;
  width: 100%;
  height: calc(100vh - 90rpx);
}

/* 加载遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #8ab6c8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #333;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 