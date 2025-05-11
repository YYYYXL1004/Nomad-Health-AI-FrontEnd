<template>
  <view class="quick-qa-container">
    <view class="quick-qa-title">
      <text>快速问医生</text>
    </view>
    
    <view class="quick-qa-input-area">
      <input 
        class="quick-qa-input" 
        v-model="questionText" 
        placeholder="输入健康问题..." 
        @confirm="handleSubmitQuestion" 
      />
      <view class="quick-qa-submit-btn" @tap="handleSubmitQuestion">
        <text>提问</text>
      </view>
    </view>
    
    <view class="quick-qa-result" v-if="answer">
      <view class="quick-qa-question">
        <text class="question-label">我的问题：</text>
        <text class="question-content">{{ lastQuestion }}</text>
      </view>
      <view class="quick-qa-answer">
        <text class="answer-label">医生回答：</text>
        <text class="answer-content">{{ answer }}</text>
      </view>
      <view class="quick-qa-meta" v-if="timeTaken > 0">
        <text class="time-taken">回答耗时: {{ timeTaken }}秒</text>
      </view>
    </view>
    
    <view class="quick-qa-loading" v-if="isLoading">
      <text>正在咨询医生...</text>
    </view>
    
    <view class="quick-qa-error" v-if="errorMessage">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { consultApi } from '@/api/index';
import { consultService } from '@/services/consult.service';

// 状态变量
const questionText = ref('');
const lastQuestion = ref('');
const answer = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const timeTaken = ref(0);

// 处理问题提交
const handleSubmitQuestion = () => {
  // 验证输入
  if (!questionText.value.trim()) {
    errorMessage.value = '请输入您的问题';
    setTimeout(() => {
      errorMessage.value = '';
    }, 2000);
    return;
  }
  
  // 保存当前问题
  lastQuestion.value = questionText.value;
  
  // 重置状态
  answer.value = '';
  errorMessage.value = '';
  isLoading.value = true;
  
  // 调用医疗问答API - 使用服务层而非直接调用API
  consultService.medicalQA(questionText.value, 'chinese')
    .then(res => {
      isLoading.value = false;
      
      // 正确处理千问医疗API返回的格式
      if (res.code === 0 && res.data) {
        answer.value = res.data.response || '抱歉，无法获取有效回答';
        timeTaken.value = res.data.time_taken || 0;
        
        // 清空输入框
        questionText.value = '';
        
        // 检查是否为模拟数据
        if (res.data.is_mock) {
          console.warn('警告：使用的是模拟数据，未调用真实API');
        } else {
          console.log('成功：使用了真实的千问医疗API');
        }
      } else {
        errorMessage.value = res.message || '获取回答失败';
        setTimeout(() => {
          errorMessage.value = '';
        }, 3000);
      }
    })
    .catch(err => {
      isLoading.value = false;
      errorMessage.value = '网络错误，请稍后再试';
      console.error('医疗问答API调用失败:', err);
      
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    });
};
</script>

<style>
.quick-qa-container {
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 20rpx;
  margin: 20rpx 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.quick-qa-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #eee;
  padding-bottom: 15rpx;
}

.quick-qa-input-area {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.quick-qa-input {
  flex: 1;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.quick-qa-submit-btn {
  width: 120rpx;
  height: 80rpx;
  background-color: #8ab6c8;
  border-radius: 40rpx;
  margin-left: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 28rpx;
}

.quick-qa-result {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}

.quick-qa-question, .quick-qa-answer {
  margin-bottom: 15rpx;
}

.question-label, .answer-label {
  font-weight: bold;
  color: #333;
  font-size: 28rpx;
}

.question-content {
  color: #666;
  font-size: 28rpx;
}

.answer-content {
  color: #333;
  font-size: 28rpx;
  line-height: 1.5;
}

.quick-qa-meta {
  margin-top: 15rpx;
  display: flex;
  justify-content: flex-end;
}

.time-taken {
  color: #999;
  font-size: 24rpx;
}

.quick-qa-loading, .quick-qa-error {
  text-align: center;
  color: #666;
  font-size: 28rpx;
  margin: 20rpx 0;
}

.quick-qa-error {
  color: #f56c6c;
}
</style> 