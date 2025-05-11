<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>病史详情</text>
      </view>
    </view>
    
    <!-- 详情内容 -->
    <view class="detail-container">
      <view class="detail-card">
        <view class="disease-name">{{ disease }}</view>
        <view class="disease-time">{{ time }}</view>
        
        <view class="section-title">详细描述</view>
        <view class="description-content">
          {{ description }}
        </view>
        
        <view class="detail-section">
          <view class="section-title">就诊医院</view>
          <view class="section-content">北京协和医院</view>
        </view>
        
        <view class="detail-section">
          <view class="section-title">就诊科室</view>
          <view class="section-content">内科</view>
        </view>
        
        <view class="detail-section">
          <view class="section-title">接诊医生</view>
          <view class="section-content">张医生</view>
        </view>
        
        <view class="detail-section">
          <view class="section-title">处方药物</view>
          <view class="section-content">
            <view class="medicine-item">
              <text class="medicine-name">布洛芬缓释胶囊</text>
              <text class="medicine-spec">0.3g*12粒</text>
              <text class="medicine-usage">口服，一次1粒，一日2次</text>
            </view>
            <view class="medicine-item">
              <text class="medicine-name">复方感冒灵颗粒</text>
              <text class="medicine-spec">12g*10袋</text>
              <text class="medicine-usage">口服，一次1袋，一日3次</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="action-buttons">
        <button class="primary-btn" @tap="handleEdit">编辑信息</button>
        <button class="danger-btn" @tap="handleDelete">删除记录</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 病史详情数据
const disease = ref('');
const time = ref('');
const description = ref('');

// 页面加载时获取参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page.options;
  
  disease.value = decodeURIComponent(options.disease || '');
  time.value = decodeURIComponent(options.time || '');
  description.value = decodeURIComponent(options.description || '');
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 编辑信息
const handleEdit = () => {
  uni.navigateTo({
    url: `/pages/my/edit-medical-history?disease=${encodeURIComponent(disease.value)}&time=${encodeURIComponent(time.value)}&description=${encodeURIComponent(description.value)}`
  });
};

// 删除记录
const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '是否确认删除此病史记录？删除后无法恢复。',
    confirmColor: '#E53935',
    success: (res) => {
      if (res.confirm) {
        // 这里应该调用接口删除记录
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
        
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    }
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

/* 详情内容 */
.detail-container {
  flex: 1;
  padding: 20rpx;
}

.detail-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.disease-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.disease-time {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  margin: 20rpx 0 10rpx;
}

.description-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  padding: 10rpx 0 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section {
  padding: 10rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.section-content {
  font-size: 28rpx;
  color: #333;
  padding: 10rpx 0;
}

.medicine-item {
  padding: 10rpx 0;
  border-bottom: 1px dashed #f0f0f0;
}

.medicine-item:last-child {
  border-bottom: none;
}

.medicine-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.medicine-spec {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 6rpx;
}

.medicine-usage {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 30rpx;
}

.primary-btn {
  background-color: #8ab6c8;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 30rpx;
}

.danger-btn {
  background-color: #fff;
  color: #E53935;
  border: 1px solid #E53935;
  border-radius: 8rpx;
  font-size: 30rpx;
}
</style> 