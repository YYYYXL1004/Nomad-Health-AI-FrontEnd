<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>过敏详情</text>
      </view>
    </view>
    
    <!-- 详情内容 -->
    <view class="detail-container">
      <view class="detail-card">
        <view class="allergy-name">{{ allergy }}</view>
        
        <view class="section-title">过敏反应</view>
        <view class="reaction-tags">
          <view class="reaction-tag">皮疹</view>
          <view class="reaction-tag">瘙痒</view>
          <view class="reaction-tag">呼吸困难</view>
        </view>
        
        <view class="section-title">反应程度</view>
        <view class="severity-indicator">
          <view class="severity-bar">
            <view class="severity-level" :style="{ width: allergyData.severity + '%' }"></view>
          </view>
          <view class="severity-text">{{ getSeverityText() }}</view>
        </view>
        
        <view class="section-title">发现时间</view>
        <view class="discover-time">{{ allergyData.discoverTime }}</view>
        
        <view class="section-title">应对措施</view>
        <view class="measures-content">
          {{ allergyData.measures }}
        </view>
        
        <view class="section-title">备注</view>
        <view class="note-content">
          {{ allergyData.note }}
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
import { ref, onMounted, computed } from 'vue';

// 过敏详情数据
const allergy = ref('');
const allergyIndex = ref(0);

// 过敏数据（模拟）
const allergyData = ref({
  severity: 75, // 严重程度 0-100
  discoverTime: '2020-03-15',
  measures: '避免接触过敏原，如发生过敏反应可使用抗组胺药物如氯雷他定、西替利嗪等。严重者应立即就医，可能需要肾上腺素注射。',
  note: '曾因误食海鲜导致全身瘙痒、皮疹，就诊于北京协和医院皮肤科，确诊为海鲜过敏。'
});

// 页面加载时获取参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page.options;
  
  allergy.value = decodeURIComponent(options.allergy || '');
  allergyIndex.value = parseInt(options.index || '0');
  
  // 根据不同的过敏原设置不同的模拟数据
  if (allergy.value === '青霉素') {
    allergyData.value = {
      severity: 85, 
      discoverTime: '2018-09-22',
      measures: '严禁使用所有青霉素类药物，用药前需告知医生有青霉素过敏史。可能出现交叉过敏，需谨慎使用其他β-内酰胺类抗生素。',
      note: '2018年因扁桃体炎使用青霉素注射剂后出现呼吸困难、皮疹等症状，诊断为青霉素过敏，应严格避免接触青霉素类药物。'
    };
  }
});

// 获取严重程度文本描述
const getSeverityText = () => {
  const severity = allergyData.value.severity;
  if (severity < 30) {
    return '轻度';
  } else if (severity < 70) {
    return '中度';
  } else {
    return '重度';
  }
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 编辑信息
const handleEdit = () => {
  uni.navigateTo({
    url: `/pages/my/edit-allergy?allergy=${encodeURIComponent(allergy.value)}&index=${allergyIndex.value}`
  });
};

// 删除记录
const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '是否确认删除此过敏记录？删除后无法恢复。',
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

.allergy-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
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

.reaction-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 10rpx 0 20rpx;
}

.reaction-tag {
  background-color: #f0f8ff;
  color: #3B82F6;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.severity-indicator {
  margin: 15rpx 0 25rpx;
}

.severity-bar {
  height: 30rpx;
  background-color: #f0f0f0;
  border-radius: 15rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.severity-level {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50 0%, #FFC107 50%, #F44336 100%);
  border-radius: 15rpx;
}

.severity-text {
  text-align: right;
  font-size: 26rpx;
  color: #666;
}

.discover-time {
  font-size: 28rpx;
  color: #333;
  margin: 10rpx 0 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.measures-content, .note-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  padding: 10rpx 0 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.note-content {
  border-bottom: none;
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