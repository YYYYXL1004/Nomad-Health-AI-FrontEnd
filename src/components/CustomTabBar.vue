<template>
  <view class="custom-tab-bar">
    <view class="tab-item" :class="{ active: active === 'home' }" @tap="switchTab('home')">
      <view class="tab-icon">🏠</view>
      <text class="tab-text">{{ $t('tabBar.home') }}</text>
    </view>
    <view class="tab-item" :class="{ active: active === 'consult' }" @tap="switchTab('consult')">
      <view class="tab-icon">💊</view>
      <text class="tab-text">{{ $t('tabBar.consult') }}</text>
    </view>
    <view class="tab-item" :class="{ active: active === 'my' }" @tap="switchTab('my')">
      <view class="tab-icon">👤</view>
      <text class="tab-text">{{ $t('tabBar.my') }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import i18n from '@/i18n/index.js';

// 定义组件属性
const props = defineProps({
  active: {
    type: String,
    default: 'home'
  }
});

// 当前语言
const currentLang = ref(getCurrentLang());

// 添加对语言变化的监听
watch(() => getCurrentLang(), (newLang) => {
  console.log('TabBar - 语言变化监听:', currentLang.value, '->', newLang);
  currentLang.value = newLang;
}, { immediate: true });

// 监听语言变化，页面显示时更新
onMounted(() => {
  // 更新当前语言
  currentLang.value = getCurrentLang();
  console.log('CustomTabBar - 当前语言:', currentLang.value);
});

// 切换标签页
const switchTab = (tab) => {
  if (tab === props.active) return;
  
  console.log('Switching to tab:', tab);
  
  try {
    if (tab === 'home') {
      uni.switchTab({
        url: '/pages/index/index',
        fail: (err) => {
          console.error('跳转到主页失败:', err);
          // 备用跳转方案
          uni.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
    } else if (tab === 'consult') {
      uni.switchTab({
        url: '/pages/consult/index',
        fail: (err) => {
          console.error('跳转到问诊失败:', err);
          // 备用跳转方案
          uni.reLaunch({
            url: '/pages/consult/index'
          });
        }
      });
    } else if (tab === 'my') {
      uni.switchTab({
        url: '/pages/my/index',
        fail: (err) => {
          console.error('跳转到我的失败:', err);
          // 备用跳转方案
          uni.reLaunch({
            url: '/pages/my/index'
          });
        }
      });
    }
  } catch (e) {
    console.error('TabBar切换异常:', e);
  }
};

// 获取国际化文本
const $t = (key) => {
  try {
    const lang = getCurrentLang();
    let result = '';
    
    // 直接使用固定映射，确保导航栏文字始终显示
    if (key === 'tabBar.home') {
      result = lang === 'zh' ? '主页' : 'ᠨᠢᠭᠤᠷ';
    } else if (key === 'tabBar.consult') {
      result = lang === 'zh' ? '问诊' : 'ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ';
    } else if (key === 'tabBar.my') {
      result = lang === 'zh' ? '我的' : 'ᠮᠢᠨᠤ';
    } else {
      // 尝试使用i18n获取翻译
      result = i18n.t(key);
    }
    
    console.log(`TabBar翻译: "${key}" => "${result}" (${lang})`);
    return result;
  } catch (e) {
    console.error('TabBar翻译错误:', e);
    // 返回备用翻译
    if (key === 'tabBar.home') return '主页';
    if (key === 'tabBar.consult') return '问诊';
    if (key === 'tabBar.my') return '我的';
    return key;
  }
};
</script>

<style scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999; /* 确保导航栏在最上层 */
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 33.33%;
  height: 100%;
}

.tab-icon {
  font-size: 46rpx;
  margin-bottom: 6rpx;
  color: #8a8a8a;
}

.tab-text {
  font-size: 24rpx;
  color: #8a8a8a;
}

.tab-item.active .tab-icon {
  color: #8ab6c8;
}

.tab-item.active .tab-text {
  color: #8ab6c8;
  font-weight: bold;
}
</style> 