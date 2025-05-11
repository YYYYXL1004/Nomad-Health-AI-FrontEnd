<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>健康报告详情</text>
      </view>
    </view>
    
    <!-- 加载中状态 -->
    <view v-if="loading" class="loading-container">
      <text>加载中...</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <text>{{ error }}</text>
      <button class="retry-btn" @tap="fetchReportDetail">重试</button>
    </view>
    
    <!-- 报告详情内容 -->
    <scroll-view v-else class="report-container" scroll-y="true">
      <!-- 报告基本信息 -->
      <view class="report-header">
        <view class="report-title">
          <text>{{ report.title }}</text>
        </view>
        <view class="report-meta">
          <text>{{ report.date }}</text>
          <text class="report-status" :class="getStatusClass(report.status)">{{ getStatusText(report.status) }}</text>
        </view>
      </view>
      
      <!-- 报告摘要 -->
      <view class="report-summary-section">
        <view class="section-title">
          <text>摘要</text>
        </view>
        <view class="summary-content">
          <text>{{ report.summary }}</text>
        </view>
      </view>
      
      <!-- 医院和医生信息 -->
      <view class="report-info-section">
        <view class="info-item">
          <text class="info-label">医院</text>
          <text class="info-value">{{ report.hospital }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">医生</text>
          <text class="info-value">{{ report.doctor }}</text>
        </view>
      </view>
      
      <!-- 检查指标 -->
      <view class="indicators-section">
        <view class="section-title">
          <text>检查指标</text>
        </view>
        
        <view class="indicators-list">
          <view class="indicator-item" v-for="(item, index) in report.indicators" :key="index">
            <view class="indicator-header">
              <text class="indicator-name">{{ item.name }}</text>
              <text class="indicator-status" :class="getIndicatorStatusClass(item.status)">{{ getIndicatorStatusText(item.status) }}</text>
            </view>
            <view class="indicator-value">
              <text>{{ item.value }} {{ item.unit }}</text>
            </view>
            <view class="indicator-reference">
              <text>参考范围: {{ item.reference }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 建议 -->
      <view class="recommendations-section">
        <view class="section-title">
          <text>建议</text>
        </view>
        
        <view class="recommendations-list">
          <view class="recommendation-item" v-for="(item, index) in report.recommendations" :key="index">
            <text class="recommendation-number">{{ index + 1 }}.</text>
            <text class="recommendation-content">{{ item }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 页面状态
const loading = ref(true);
const error = ref('');

// 报告ID
const reportId = ref('');

// 报告详情数据
const report = ref({
  id: '',
  title: '',
  date: '',
  hospital: '',
  doctor: '',
  summary: '',
  status: 'normal',
  indicators: [],
  recommendations: []
});

// 页面加载时获取报告ID并请求详情
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page.options;
  
  if (options.id) {
    reportId.value = options.id;
    fetchReportDetail();
  } else {
    loading.value = false;
    error.value = '未找到报告信息';
  }
});

// 获取报告详情
const fetchReportDetail = () => {
  loading.value = true;
  error.value = '';
  
  uni.getApp().config.globalProperties.$request({
    url: `/api/health/reports/${reportId.value}`,
    method: 'GET'
  }).then(res => {
    loading.value = false;
    
    if (res.data) {
      // 格式化API返回的数据
      report.value = {
        id: res.data.id,
        title: res.data.title,
        date: res.data.date,
        hospital: res.data.hospital,
        doctor: res.data.doctor,
        summary: res.data.summary,
        status: res.data.status,
        indicators: res.data.indicators || [],
        recommendations: res.data.recommendations || []
      };
    }
  }).catch(err => {
    loading.value = false;
    error.value = (err.errors && err.errors[0]) || '获取报告详情失败';
    console.error('获取健康报告详情失败', err);
  });
};

// 获取状态类名
const getStatusClass = (status) => {
  switch (status) {
    case 'normal': return 'status-normal';
    case 'warning': return 'status-warning';
    case 'abnormal': return 'status-abnormal';
    default: return '';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'normal': return '正常';
    case 'warning': return '警告';
    case 'abnormal': return '异常';
    default: return '未知';
  }
};

// 获取指标状态类名
const getIndicatorStatusClass = (status) => {
  switch (status) {
    case 'normal': return 'status-normal';
    case 'high': return 'status-high';
    case 'low': return 'status-low';
    default: return '';
  }
};

// 获取指标状态文本
const getIndicatorStatusText = (status) => {
  switch (status) {
    case 'normal': return '正常';
    case 'high': return '偏高';
    case 'low': return '偏低';
    default: return '未知';
  }
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
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
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #8ab6c8;
  padding: 0 30rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-icon {
  font-size: 36rpx;
  color: #fff;
}

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
}

/* 加载和错误状态 */
.loading-container, .error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60rpx;
}

.loading-container text, .error-container text {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.retry-btn {
  width: 200rpx;
  height: 70rpx;
  background-color: #8ab6c8;
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 报告内容区域 */
.report-container {
  flex: 1;
  padding: 30rpx;
}

/* 报告基本信息 */
.report-header {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.report-title {
  margin-bottom: 20rpx;
}

.report-title text {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-meta text {
  font-size: 26rpx;
  color: #999;
}

.report-status {
  font-size: 24rpx;
  color: #fff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.status-normal {
  background-color: #4caf50;
}

.status-warning {
  background-color: #ff9800;
}

.status-abnormal {
  background-color: #f44336;
}

/* 报告摘要 */
.report-summary-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15rpx;
}

.summary-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 医院和医生信息 */
.report-info-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 检查指标 */
.indicators-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.indicators-list {
  padding: 10rpx 0;
}

.indicator-item {
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.indicator-item:last-child {
  border-bottom: none;
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.indicator-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.indicator-status {
  font-size: 24rpx;
  color: #fff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.status-high {
  background-color: #f44336;
}

.status-low {
  background-color: #ff9800;
}

.indicator-value {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.indicator-reference {
  font-size: 24rpx;
  color: #999;
}

/* 建议 */
.recommendations-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.recommendations-list {
  padding: 10rpx 0;
}

.recommendation-item {
  display: flex;
  margin-bottom: 16rpx;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.recommendation-number {
  width: 40rpx;
  font-size: 28rpx;
  color: #8ab6c8;
  font-weight: bold;
}

.recommendation-content {
  flex: 1;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}
</style> 