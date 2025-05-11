<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('my.prescriptions') }}</text>
      </view>
    </view>
    
    <!-- 处方列表 -->
    <scroll-view class="content-container" scroll-y="true">
      <!-- 空状态 -->
      <view v-if="prescriptions.length === 0" class="empty-state">
        <image class="empty-icon" src="/static/empty.png" mode="aspectFit"></image>
        <text class="empty-text">{{ currentLang === 'zh' ? '暂无处方记录' : 'ᠵᠣᠷ ᠤᠨ ᠲᠡᠮᠳᠡᠭᠯᠡᠯ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ' }}</text>
      </view>
      
      <!-- 处方列表 -->
      <view v-else class="prescription-list">
        <view 
          v-for="(item, index) in prescriptions" 
          :key="index" 
          class="prescription-item"
          @tap="viewDetail(item)"
        >
          <view class="prescription-header">
            <text class="prescription-date">{{ item.date }}</text>
            <text class="prescription-status" :class="item.status">{{ getStatusText(item.status) }}</text>
          </view>
          
          <view class="prescription-content">
            <view class="doctor-info">
              <text class="doctor-name">{{ item.doctorName }}</text>
              <text class="doctor-department">{{ item.hospital }} {{ item.department }}</text>
            </view>
            
            <view class="diagnosis-info">
              <text class="diagnosis-label">{{ currentLang === 'zh' ? '诊断：' : 'ᠣᠨᠣᠰᠢᠯᠠᠯᠲᠠ：' }}</text>
              <text class="diagnosis-value">{{ item.diagnosis }}</text>
            </view>
            
            <view class="medicine-info">
              <text class="medicine-label">{{ currentLang === 'zh' ? '药品：' : 'ᠡᠮ：' }}</text>
              <text class="medicine-value">{{ getMedicinePreview(item.medicines) }}</text>
            </view>
          </view>
          
          <view class="prescription-footer">
            <view class="prescription-number">
              <text>{{ currentLang === 'zh' ? '处方号：' : 'ᠵᠣᠷ ᠤᠨ ᠳᠤᠭᠠᠷ：' }}{{ item.prescriptionNo }}</text>
            </view>
            
            <view class="action-buttons">
              <view 
                class="action-btn detail-btn"
                @tap.stop="viewDetail(item)"
              >
                <text>{{ currentLang === 'zh' ? '详情' : 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ' }}</text>
              </view>
              <view 
                v-if="item.canPurchase" 
                class="action-btn purchase-btn"
                @tap.stop="purchaseMedicine(item)"
              >
                <text>{{ currentLang === 'zh' ? '购药' : 'ᠡᠮ ᠬᠤᠳᠠᠯᠳᠤᠨ ᠠᠪᠬᠤ' }}</text>
              </view>
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

// 处方数据
const prescriptions = ref([
  {
    id: 1,
    prescriptionNo: 'P20230520001',
    date: '2023-05-20',
    doctorName: '王医生',
    hospital: '北京协和医院',
    department: '内科',
    status: 'valid',
    canPurchase: true,
    diagnosis: '普通感冒',
    medicines: [
      { name: '布洛芬缓释胶囊', spec: '0.3g*12粒', usage: '口服，一次1粒，一日2次' },
      { name: '复方感冒灵颗粒', spec: '12g*10袋', usage: '口服，一次1袋，一日3次' }
    ]
  },
  {
    id: 2,
    prescriptionNo: 'P20230510002',
    date: '2023-05-10',
    doctorName: '李医生',
    hospital: '北京协和医院',
    department: '皮肤科',
    status: 'expired',
    canPurchase: false,
    diagnosis: '过敏性皮炎',
    medicines: [
      { name: '氯雷他定片', spec: '10mg*6片', usage: '口服，一次1片，一日1次' },
      { name: '糠酸莫米松乳膏', spec: '10g:10mg', usage: '外用，每日2次，涂抹于患处' }
    ]
  }
]);

// 获取状态文本
const getStatusText = (status) => {
  if (currentLang.value === 'zh') {
    const statusMap = {
      'valid': '有效',
      'used': '已使用',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  } else {
    const statusMap = {
      'valid': 'ᠬᠦᠴᠦᠨ ᠲᠡᠢ',
      'used': 'ᠬᠡᠷᠡᠭᠯᠡᠭᠰᠡᠨ',
      'expired': 'ᠬᠦᠴᠦᠨ ᠳᠠᠭᠤᠰᠤᠭᠰᠠᠨ'
    };
    return statusMap[status] || status;
  }
};

// 获取药品预览
const getMedicinePreview = (medicines) => {
  if (!medicines || medicines.length === 0) return '无';
  
  if (medicines.length === 1) {
    return medicines[0].name;
  }
  
  return `${medicines[0].name} 等${medicines.length}种`;
};

// 查看处方详情
const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/my/prescription-detail?id=${item.id}`
  });
};

// 购买药品
const purchaseMedicine = (item) => {
  if (!item.canPurchase) {
    uni.showToast({
      title: '该处方不可购药',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: `/pages/shop/medicine-purchase?prescriptionId=${item.id}`
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

/* 处方列表 */
.prescription-list {
  padding-bottom: 20rpx;
}

.prescription-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.prescription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: #f9f9f9;
  border-bottom: 1px solid #f0f0f0;
}

.prescription-date {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.prescription-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.prescription-status.valid {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.prescription-status.used {
  color: #6b7280;
  background-color: rgba(107, 114, 128, 0.1);
}

.prescription-status.expired {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.prescription-content {
  padding: 20rpx;
}

.doctor-info {
  margin-bottom: 16rpx;
}

.doctor-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-right: 16rpx;
}

.doctor-department {
  font-size: 24rpx;
  color: #666;
}

.diagnosis-info, .medicine-info {
  display: flex;
  margin-bottom: 12rpx;
}

.diagnosis-label, .medicine-label {
  font-size: 26rpx;
  color: #666;
  flex-shrink: 0;
}

.diagnosis-value, .medicine-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.prescription-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.prescription-number {
  font-size: 24rpx;
  color: #666;
}

.action-buttons {
  display: flex;
}

.action-btn {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-left: 16rpx;
}

.detail-btn {
  color: #8ab6c8;
  border: 1px solid #8ab6c8;
}

.purchase-btn {
  color: #fff;
  background-color: #8ab6c8;
  border: 1px solid #8ab6c8;
}
</style> 