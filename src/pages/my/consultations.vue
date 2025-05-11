<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('my.consultHistory') }}</text>
      </view>
    </view>
    
    <!-- 问诊记录列表 -->
    <scroll-view class="content-container" scroll-y="true">
      <!-- 空状态 -->
      <view v-if="consultations.length === 0" class="empty-state">
        <image class="empty-icon" src="/static/empty.png" mode="aspectFit"></image>
        <text class="empty-text">{{ currentLang === 'zh' ? '暂无问诊记录' : 'ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ ᠶᠢᠨ ᠲᠡᠦᠬᠡ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ' }}</text>
      </view>
      
      <!-- 记录列表 -->
      <view v-else class="consultation-list">
        <view 
          v-for="(item, index) in consultations" 
          :key="index" 
          class="consultation-item"
          @tap="viewDetail(item)"
        >
          <view class="consultation-header">
            <view class="doctor-info">
              <image class="doctor-avatar" :src="item.doctorAvatar" mode="aspectFill"></image>
              <view class="doctor-details">
                <text class="doctor-name">{{ item.doctorName }}</text>
                <text class="doctor-department">{{ item.department }}</text>
              </view>
            </view>
            <text class="consultation-status" :class="item.status">{{ getStatusText(item.status) }}</text>
          </view>
          
          <view class="consultation-body">
            <view class="consultation-info">
              <text class="consultation-type">{{ item.type }}</text>
              <text class="consultation-time">{{ item.time }}</text>
            </view>
            <text class="consultation-description">{{ item.description }}</text>
          </view>
          
          <view class="consultation-footer">
            <view 
              v-if="item.status === 'completed'" 
              class="action-btn view-prescription"
              @tap.stop="viewPrescription(item)"
            >
              <text>{{ currentLang === 'zh' ? '查看处方' : 'ᠵᠣᠷ ᠢ ᠦᠵᠡᠬᠦ' }}</text>
            </view>
            <view 
              v-if="item.status === 'completed'" 
              class="action-btn rate-btn"
              @tap.stop="rateConsultation(item)"
            >
              <text>{{ currentLang === 'zh' ? '去评价' : 'ᠦᠨᠡᠯᠡᠬᠦ' }}</text>
            </view>
            <view 
              v-if="item.status === 'waiting'" 
              class="action-btn continue-btn"
              @tap.stop="continueConsultation(item)"
            >
              <text>{{ currentLang === 'zh' ? '继续问诊' : 'ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ ᠶᠢ ᠦᠷᠭᠦᠯᠵᠢᠯᠡᠭᠦᠯᠬᠦ' }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';

// 当前语言
const currentLang = ref(getCurrentLang());

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 问诊记录数据
const consultations = ref([
  {
    id: 1,
    doctorName: '王医生',
    doctorAvatar: 'https://via.placeholder.com/100',
    department: '内科',
    type: '图文问诊',
    time: '2023-05-20 14:30',
    status: 'completed',
    description: '头痛、发热症状咨询',
    hasPrescription: true
  },
  {
    id: 2,
    doctorName: '李医生',
    doctorAvatar: 'https://via.placeholder.com/100',
    department: '皮肤科',
    type: '图文问诊',
    time: '2023-05-10 09:15',
    status: 'completed',
    description: '皮肤过敏症状咨询',
    hasPrescription: true
  },
  {
    id: 3,
    doctorName: '张医生',
    doctorAvatar: 'https://via.placeholder.com/100',
    department: '神经内科',
    type: '图文问诊',
    time: '2023-06-01 16:00',
    status: 'waiting',
    description: '睡眠障碍咨询',
    hasPrescription: false
  }
]);

// 获取状态文本
const getStatusText = (status) => {
  if (currentLang.value === 'zh') {
    const statusMap = {
      'waiting': '进行中',
      'completed': '已完成',
      'canceled': '已取消'
    };
    return statusMap[status] || status;
  } else {
    const statusMap = {
      'waiting': 'ᠦᠷᠭᠦᠯᠵᠢᠯᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ',
      'completed': 'ᠲᠠᠭᠤᠰᠤᠭᠰᠠᠨ',
      'canceled': 'ᠴᠤᠴᠠᠯᠠᠭᠰᠠᠨ'
    };
    return statusMap[status] || status;
  }
};

// 查看问诊详情
const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/consult/detail?id=${item.id}`
  });
};

// 查看处方
const viewPrescription = (item) => {
  uni.navigateTo({
    url: `/pages/my/prescription-detail?id=${item.id}`
  });
};

// 评价问诊
const rateConsultation = (item) => {
  uni.navigateTo({
    url: `/pages/my/rate-consultation?id=${item.id}`
  });
};

// 继续问诊
const continueConsultation = (item) => {
  uni.navigateTo({
    url: `/pages/consult/detail?id=${item.id}`
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

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

/* 问诊记录列表 */
.consultation-list {
  padding-bottom: 20rpx;
}

.consultation-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.consultation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.doctor-info {
  display: flex;
  align-items: center;
}

.doctor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 16rpx;
  background-color: #f0f0f0;
}

.doctor-details {
  display: flex;
  flex-direction: column;
}

.doctor-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.doctor-department {
  font-size: 24rpx;
  color: #666;
}

.consultation-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.consultation-status.waiting {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.consultation-status.completed {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.consultation-status.canceled {
  color: #999;
  background-color: rgba(153, 153, 153, 0.1);
}

.consultation-body {
  padding: 16rpx 0;
}

.consultation-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.consultation-type {
  font-size: 26rpx;
  color: #333;
}

.consultation-time {
  font-size: 24rpx;
  color: #999;
}

.consultation-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.consultation-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-left: 16rpx;
}

.view-prescription {
  color: #8ab6c8;
  border: 1px solid #8ab6c8;
}

.rate-btn {
  color: #f59e0b;
  border: 1px solid #f59e0b;
}

.continue-btn {
  color: #fff;
  background-color: #8ab6c8;
  border: 1px solid #8ab6c8;
}
</style> 