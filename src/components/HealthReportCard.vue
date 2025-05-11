<template>
  <view class="health-report-card" @tap="onReportTap">
    <view class="report-header">
      <text class="report-title">{{ reportTitle }}</text>
      <text class="report-date">{{ formatDate(report.createTime) }}</text>
    </view>
    
    <view class="report-content">
      <view class="indicator-list">
        <view 
          v-for="(indicator, index) in report.indicators" 
          :key="index" 
          class="indicator-item"
          :class="{ 'abnormal': indicator.status === 'abnormal' }"
        >
          <text class="indicator-name">{{ indicatorName(indicator) }}</text>
          <text class="indicator-value">{{ indicator.value }}{{ indicator.unit }}</text>
          <text class="indicator-status">{{ indicatorStatus(indicator) }}</text>
        </view>
      </view>
      
      <view class="report-conclusion">
        <text class="conclusion-label">{{ getText('结论', 'Дүгнэлт') }}：</text>
        <text class="conclusion-text">{{ reportConclusion }}</text>
      </view>
    </view>
    
    <view class="report-footer">
      <button class="view-details-btn" @tap.stop="onViewDetails">
        {{ getText('查看详情', 'Дэлгэрэнгүй') }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils';
import { useLanguage } from '@/hooks';
import { navigateTo } from '@/utils';
import { THealthReport } from '@/types/index';

// 组件属性定义
const props = defineProps({
  report: {
    type: Object,
    required: true
  }
});

// 事件定义
const emit = defineEmits(['tap', 'view-details']);

// 使用语言Hook
const { getText, currentLang } = useLanguage();

// 计算属性：报告标题（中/蒙）
const reportTitle = computed(() => {
  return props.report.titleMn && currentLang.value !== 'zh'
    ? props.report.titleMn
    : props.report.title;
});

// 计算属性：报告结论（中/蒙）
const reportConclusion = computed(() => {
  return props.report.conclusionMn && currentLang.value !== 'zh'
    ? props.report.conclusionMn
    : props.report.conclusion;
});

// 获取指标名称（中/蒙）
const indicatorName = (indicator) => {
  return indicator.nameMn && currentLang.value !== 'zh'
    ? indicator.nameMn
    : indicator.name;
};

// 获取指标状态文本
const indicatorStatus = (indicator) => {
  return indicator.status === 'normal' 
    ? getText('正常', 'Хэвийн') 
    : getText('异常', 'Хэвийн бус');
};

// 点击报告卡片
const onReportTap = () => {
  emit('tap', props.report);
};

// 点击查看详情
const onViewDetails = () => {
  emit('view-details', props.report);
  navigateTo('/pages/health/report-detail', { id: props.report.reportId });
};
</script>

<style lang="scss">
.health-report-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .report-title {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }
    
    .report-date {
      font-size: 14px;
      color: #666666;
    }
  }
  
  .report-content {
    margin-bottom: 12px;
    
    .indicator-list {
      margin-bottom: 10px;
      
      .indicator-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;
        padding: 8px 0;
        
        &.abnormal {
          .indicator-name,
          .indicator-value,
          .indicator-status {
            color: #e74c3c;
          }
        }
        
        .indicator-name {
          flex: 1;
          font-size: 14px;
          color: #333333;
        }
        
        .indicator-value {
          font-size: 14px;
          color: #333333;
          margin: 0 8px;
        }
        
        .indicator-status {
          width: 40px;
          text-align: right;
          font-size: 14px;
          color: #333333;
        }
      }
    }
    
    .report-conclusion {
      background-color: #f8f8f8;
      padding: 10px;
      border-radius: 6px;
      
      .conclusion-label {
        font-weight: bold;
        color: #333333;
      }
      
      .conclusion-text {
        color: #333333;
      }
    }
  }
  
  .report-footer {
    display: flex;
    justify-content: center;
    
    .view-details-btn {
      background-color: #4a90e2;
      color: #ffffff;
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 20px;
      width: 160px;
    }
  }
}
</style> 