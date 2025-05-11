<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('healthRecords.title') }}</text>
      </view>
    </view>
    
    <!-- 健康档案内容 -->
    <scroll-view class="content-container" scroll-y="true">
      <!-- 基本信息卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">{{ $t('healthRecords.basicInfo') }}</text>
          <view class="edit-btn" @tap="handleEditBasicInfo">
            <text>{{ $t('common.edit') }}</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '姓名' : 'ᠨᠡᠷ᠎ᠡ', healthData.name)">
          <text class="info-label">{{ $t('healthRecords.name') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.name }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '性别' : 'ᠬᠦᠢᠰᠦ', healthData.gender)">
          <text class="info-label">{{ $t('healthRecords.gender') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.gender }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '年龄' : 'ᠨᠠᠰᠤ', healthData.age + (currentLang === 'zh' ? '岁' : ''))">
          <text class="info-label">{{ $t('healthRecords.age') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.age }}{{ currentLang === 'zh' ? '岁' : '' }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '身高' : 'ᠥᠨᠳᠦᠷ', healthData.height + 'cm')">
          <text class="info-label">{{ $t('healthRecords.height') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.height }}cm</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '体重' : 'ᠵᠢᠨ', healthData.weight + 'kg')">
          <text class="info-label">{{ $t('healthRecords.weight') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.weight }}kg</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('basicInfo', currentLang === 'zh' ? '血型' : 'ᠴᠤᠰᠤᠨ ᠤ ᠪᠦᠯᠦᠭ', healthData.bloodType)">
          <text class="info-label">{{ $t('healthRecords.bloodType') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.bloodType }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>
      
      <!-- 健康指标卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">{{ $t('healthRecords.healthIndicators') }}</text>
          <view class="edit-btn" @tap="handleEditHealthIndicators">
            <text>{{ $t('common.edit') }}</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('healthIndicator', currentLang === 'zh' ? '血压' : 'ᠴᠤᠰᠤᠨ ᠤ ᠳᠠᠷᠤᠯᠲᠠ', healthData.bloodPressure)">
          <text class="info-label">{{ $t('healthRecords.bloodPressure') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.bloodPressure }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('healthIndicator', currentLang === 'zh' ? '血糖' : 'ᠴᠤᠰᠤᠨ ᠤ ᠰᠠᠬᠠᠷ', healthData.bloodSugar)">
          <text class="info-label">{{ $t('healthRecords.bloodSugar') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.bloodSugar }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
        <view class="info-item" @tap="navigateToDetail('healthIndicator', currentLang === 'zh' ? '心率' : 'ᠵᠢᠷᠦᠬᠡᠨ ᠴᠣᠬᠢᠯᠲᠠ', healthData.heartRate + (currentLang === 'zh' ? '次/分' : ''))">
          <text class="info-label">{{ $t('healthRecords.heartRate') }}</text>
          <view class="info-value-container">
            <text class="info-value">{{ healthData.heartRate }}{{ currentLang === 'zh' ? '次/分' : '' }}</text>
            <text class="item-arrow">›</text>
          </view>
        </view>
      </view>
      
      <!-- 健康报告卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">{{ $t('home.healthReport') }}</text>
        </view>
        <view v-if="healthReports.length === 0" class="empty-notice">
          <text>{{ currentLang === 'zh' ? '暂无健康报告' : 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠲᠠᠢᠯᠠᠨ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ' }}</text>
        </view>
        <view v-else class="reports-list">
          <view 
            v-for="(report, index) in healthReports" 
            :key="report.id" 
            class="report-item" 
            @tap="viewReportDetail(report.id)"
          >
            <view class="report-header">
              <text class="report-title">{{ report.title }}</text>
              <text class="report-status" :class="getStatusClass(report.status)">{{ getStatusText(report.status) }}</text>
            </view>
            <view class="report-summary">
              <text>{{ report.summary }}</text>
            </view>
            <view class="report-footer">
              <text class="report-date">{{ report.date }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 病史记录卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">{{ $t('healthRecords.medicalHistory') }}</text>
          <view class="add-btn" @tap="handleAddMedicalHistory">
            <text>{{ $t('healthRecords.add') }}</text>
          </view>
        </view>
        <view v-if="healthData.medicalHistory.length === 0" class="empty-notice">
          <text>{{ $t('healthRecords.emptyMedical') }}</text>
        </view>
        <view v-else class="medical-history-list">
          <view v-for="(item, index) in healthData.medicalHistory" :key="index" 
                class="medical-history-item" 
                @tap="navigateToMedicalDetail(item)">
            <view class="history-header">
              <text class="history-title">{{ item.disease }}</text>
              <text class="history-time">{{ item.time }}</text>
            </view>
            <text class="history-description">{{ item.description }}</text>
            <text class="item-arrow history-arrow">›</text>
          </view>
        </view>
      </view>
      
      <!-- 过敏史卡片 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">{{ $t('healthRecords.allergies') }}</text>
          <view class="add-btn" @tap="handleAddAllergy">
            <text>{{ $t('healthRecords.add') }}</text>
          </view>
        </view>
        <view v-if="healthData.allergies.length === 0" class="empty-notice">
          <text>{{ $t('healthRecords.emptyAllergy') }}</text>
        </view>
        <view v-else class="allergies-list">
          <view v-for="(item, index) in healthData.allergies" :key="index" 
                class="allergy-item"
                @tap="navigateToAllergyDetail(item, index)">
            <text>{{ item }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import { getGlobalRequest } from '@/utils/platform.js';
import { healthApi } from '@/api/index.js';

// 当前语言
const currentLang = ref(getCurrentLang());

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 健康档案数据
const healthData = ref({
  name: '张三',
  gender: '男',
  age: 35,
  height: 175,
  weight: 70,
  bloodType: 'A型',
  bloodPressure: '120/80 mmHg',
  bloodSugar: '5.5 mmol/L',
  heartRate: 75,
  medicalHistory: [
    {
      disease: '普通感冒',
      time: '2023-01-15',
      description: '症状：发热、咳嗽、鼻塞，治疗：口服感冒药，结果：痊愈'
    },
    {
      disease: '胃炎',
      time: '2022-07-08',
      description: '症状：腹痛、恶心，治疗：口服奥美拉唑，结果：症状缓解'
    }
  ],
  allergies: [
    '青霉素',
    '海鲜'
  ]
});

// 健康报告列表
const healthReports = ref([]);

// 页面加载时获取数据
onMounted(() => {
  loadHealthReports();
});

// 加载健康报告
const loadHealthReports = () => {
  uni.showLoading({ title: '加载中...' });
  
  // 使用API模块调用
  healthApi.getReports()
    .then(res => {
      uni.hideLoading();
      if (res.data && res.data.list) {
        healthReports.value = res.data.list.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          date: item.date,
          status: item.status
        }));
      }
    })
    .catch(err => {
      uni.hideLoading();
      console.error('获取健康报告失败', err);
      uni.showToast({
        title: '获取健康报告失败',
        icon: 'none'
      });
      
      // 加载模拟数据
      setTimeout(() => {
        healthReports.value = [
          {
            id: '1',
            title: '健康体检报告',
            summary: '血压、血糖正常，肝功能轻度异常',
            date: '2023-06-10',
            status: 'attention'
          },
          {
            id: '2',
            title: '慢性病风险评估',
            summary: '低风险，请保持健康生活方式',
            date: '2023-04-20',
            status: 'low'
          }
        ];
        
        uni.hideLoading();
      }, 1000);
    });
};

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case 'normal':
      return 'status-normal';
    case 'attention':
      return 'status-attention';
    case 'warning':
      return 'status-warning';
    case 'low':
      return 'status-low';
    default:
      return '';
  }
};

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'normal':
      return '正常';
    case 'attention':
      return '需关注';
    case 'warning':
      return '异常';
    case 'low':
      return '低风险';
    default:
      return '未知';
  }
};

// 查看报告详情
const viewReportDetail = (reportId) => {
  uni.navigateTo({
    url: `/pages/health/report-detail?id=${reportId}`
  });
};

// 导航到详情页
const navigateToDetail = (type, label, value) => {
  uni.navigateTo({
    url: `/pages/my/health-detail?type=${type}&label=${encodeURIComponent(label)}&value=${encodeURIComponent(value)}`
  });
};

// 导航到病史详情页
const navigateToMedicalDetail = (item) => {
  uni.navigateTo({
    url: `/pages/my/medical-history-detail?disease=${encodeURIComponent(item.disease)}&time=${encodeURIComponent(item.time)}&description=${encodeURIComponent(item.description)}`
  });
};

// 导航到过敏详情页
const navigateToAllergyDetail = (item, index) => {
  uni.navigateTo({
    url: `/pages/my/allergy-detail?allergy=${encodeURIComponent(item)}&index=${index}`
  });
};

// 编辑基本信息
const handleEditBasicInfo = () => {
  uni.navigateTo({
    url: '/pages/my/edit-basic-info'
  });
};

// 编辑健康指标
const handleEditHealthIndicators = () => {
  uni.navigateTo({
    url: '/pages/my/edit-health-indicators'
  });
};

// 添加病史记录
const handleAddMedicalHistory = () => {
  uni.navigateTo({
    url: '/pages/my/add-medical-history'
  });
};

// 添加过敏记录
const handleAddAllergy = () => {
  uni.navigateTo({
    url: '/pages/my/add-allergy'
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

/* 顶部导航栏 */
.nav-header {
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #8ab6c8;
  padding: 0 30rpx;
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

/* 内容区域 */
.content-container {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
}

/* 卡片样式 */
.info-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.edit-btn, .add-btn {
  padding: 6rpx 16rpx;
  background-color: #e6f2ff;
  border-radius: 8rpx;
  border: 1px solid #8ab6c8;
}

.edit-btn text, .add-btn text {
  font-size: 24rpx;
  color: #8ab6c8;
}

/* 信息项样式 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.info-value-container {
  display: flex;
  align-items: center;
}

.info-value {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.item-arrow {
  font-size: 30rpx;
  color: #999;
}

/* 健康报告列表样式 */
.reports-list {
  padding: 10rpx 0;
}

.report-item {
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.report-item:last-child {
  border-bottom: none;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.report-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
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

.status-attention {
  background-color: #ff9800;
}

.status-warning {
  background-color: #f44336;
}

.status-low {
  background-color: #2196F3;
}

.report-summary {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10rpx;
}

.report-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-date {
  font-size: 24rpx;
  color: #999;
}

/* 病史记录样式 */
.medical-history-list {
  padding: 10rpx 0;
}

.medical-history-item {
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.medical-history-item:last-child {
  border-bottom: none;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-time {
  font-size: 24rpx;
  color: #999;
}

.history-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  padding-right: 30rpx; /* 为箭头留出空间 */
}

.history-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

/* 过敏史样式 */
.allergies-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx 0;
}

.allergy-item {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.allergy-item text {
  font-size: 26rpx;
  color: #666;
}

/* 空状态提示 */
.empty-notice {
  padding: 30rpx 0;
  text-align: center;
}

.empty-notice text {
  font-size: 28rpx;
  color: #999;
}
</style> 