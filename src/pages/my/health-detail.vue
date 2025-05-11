<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ label }}详情</text>
      </view>
    </view>
    
    <!-- 详情内容 -->
    <view class="detail-container">
      <view class="detail-card">
        <view class="card-title">当前值</view>
        <view class="detail-value">{{ value }}</view>
        
        <view class="history-section" v-if="historyData.length > 0">
          <view class="history-title">历史记录</view>
          <view class="history-list">
            <view class="history-item" v-for="(item, index) in historyData" :key="index">
              <text class="history-date">{{ item.date }}</text>
              <text class="history-value">{{ item.value }}</text>
            </view>
          </view>
        </view>
        
        <view class="reference-section">
          <view class="reference-title">参考范围</view>
          <view class="reference-content">
            {{ getReferenceRange() }}
          </view>
        </view>
      </view>
      
      <view class="action-buttons">
        <button class="primary-btn" @tap="handleUpdate">更新数据</button>
        <button class="secondary-btn" @tap="handleViewChart" v-if="showChartButton">查看趋势图</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 获取传递的参数
const type = ref('');
const label = ref('');
const value = ref('');

// 是否显示图表按钮
const showChartButton = ref(false);

// 历史数据记录
const historyData = ref([]);

// 页面加载时获取参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page.options;
  
  type.value = options.type || '';
  label.value = decodeURIComponent(options.label || '');
  value.value = decodeURIComponent(options.value || '');
  
  // 根据类型决定是否显示图表按钮
  showChartButton.value = ['血压', '血糖', '心率', '体重'].includes(label.value);
  
  // 生成模拟的历史数据
  generateHistoryData();
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 生成历史数据
const generateHistoryData = () => {
  if (!showChartButton.value) return;
  
  const today = new Date();
  const data = [];
  
  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    let val = '';
    switch (label.value) {
      case '血压':
        const systolic = Math.floor(Math.random() * 20 + 110);
        const diastolic = Math.floor(Math.random() * 15 + 70);
        val = `${systolic}/${diastolic} mmHg`;
        break;
      case '血糖':
        val = (Math.random() * 2 + 4.5).toFixed(1) + ' mmol/L';
        break;
      case '心率':
        val = Math.floor(Math.random() * 15 + 65) + '次/分';
        break;
      case '体重':
        const baseWeight = parseInt(value.value);
        val = (baseWeight + (Math.random() * 6 - 3)).toFixed(1) + 'kg';
        break;
    }
    
    data.push({
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      value: val
    });
  }
  
  historyData.value = data;
};

// 获取参考范围
const getReferenceRange = () => {
  switch (label.value) {
    case '血压':
      return '正常范围：收缩压90-140mmHg，舒张压60-90mmHg';
    case '血糖':
      return '空腹血糖正常范围：3.9-6.1mmol/L';
    case '心率':
      return '成人静息心率正常范围：60-100次/分';
    case '体重':
      return '请根据BMI指数判断体重是否合理，BMI=体重(kg)/身高(m)²，正常范围为18.5-24.9';
    case '身高':
      return '成年人身高取决于遗传和环境因素，无特定参考范围';
    case '血型':
      return 'ABO血型系统包括A型、B型、AB型和O型';
    default:
      return '无特定参考范围';
  }
};

// 更新数据
const handleUpdate = () => {
  uni.navigateTo({
    url: `/pages/my/update-health-data?type=${type.value}&label=${encodeURIComponent(label.value)}&value=${encodeURIComponent(value.value)}`
  });
};

// 查看趋势图
const handleViewChart = () => {
  uni.navigateTo({
    url: `/pages/my/health-trend?type=${type.value}&label=${encodeURIComponent(label.value)}`
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

.card-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.detail-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 20rpx 0 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.history-section, .reference-section {
  margin-top: 20rpx;
}

.history-title, .reference-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.history-list {
  max-height: 300rpx;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1px solid #f9f9f9;
}

.history-date {
  color: #666;
  font-size: 26rpx;
}

.history-value {
  color: #333;
  font-size: 26rpx;
  font-weight: 500;
}

.reference-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  padding: 10rpx 0;
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

.secondary-btn {
  background-color: #fff;
  color: #8ab6c8;
  border: 1px solid #8ab6c8;
  border-radius: 8rpx;
  font-size: 30rpx;
}
</style> 