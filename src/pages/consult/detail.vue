<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="consult-title">
        <text>20XX.X.X问诊记录</text>
      </view>
    </view>
    
    <!-- 提示区域 -->
    <view class="prompt-area">
      <text class="prompt-text">无消息时展示诱导提问词</text>
    </view>
    
    <!-- 聊天内容区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop" @scrolltolower="loadMoreMessages">
      <view class="empty-state" v-if="messages.length === 0">
        <text class="empty-text">暂无消息</text>
      </view>
      
      <view v-else class="message-list">
        <view
          v-for="(message, index) in messages"
          :key="message.id || index"
          class="message"
          :class="message.type"
        >
          <text class="message-sender" v-if="message.type !== 'typing'">
            {{ message.type === 'user' ? '用户: ' : message.type === 'ai' ? 'AI: ' : '医生: ' }}
          </text>
          <text class="message-content">{{ message.content }}</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view class="input-area">
      <!-- 输入框 -->
      <input class="message-input" v-model="inputContent" placeholder="请输入问题..."  />
      
      <!-- 拍照按钮 -->
      <view class="action-btn photo-btn" @tap="handleTakePhoto">
        <text>拍照</text>
      </view>
      
      <!-- 语音按钮 -->
      <view class="action-btn voice-btn" @tap="handleVoiceInput">
        <text>语音</text>
      </view>
      
      <!-- 发送按钮 -->
      <view class="action-btn send-btn" @tap="handleSendMessage">
        <text>发送</text>
      </view>
    </view>
    
    <!-- 底部导航栏 -->
    <view class="tab-bar">
      <view class="tab-item" @tap="switchTab('home')">
        <view class="tab-icon home-icon"></view>
        <text class="tab-text">主页</text>
      </view>
      <view class="tab-item active" @tap="switchTab('consult')">
        <view class="tab-icon consult-icon"></view>
        <text class="tab-text">问诊</text>
      </view>
      <view class="tab-item" @tap="switchTab('my')">
        <view class="tab-icon my-icon"></view>
        <text class="tab-text">我的</text>
      </view>
    </view>
    
    <!-- 语音输入弹窗 -->
    <view class="voice-popup" v-if="showVoicePopup">
      <view class="voice-popup-content">
        <view class="voice-status">
          <text>{{ isRecording ? '正在录音...' : '按住开始录音' }}</text>
        </view>
        <view class="voice-btn-container">
          <view 
            class="voice-record-btn" 
            :class="{ 'recording': isRecording }"
            @touchstart="startRecording"
            @touchend="stopRecording"
          >
            <text>{{ isRecording ? '松开结束' : '按住说话' }}</text>
          </view>
        </view>
        <view class="voice-actions">
          <view class="voice-action-btn" @tap="cancelVoiceInput">
            <text>取消</text>
          </view>
          <view class="voice-action-btn convert-btn" @tap="convertVoiceToText">
            <text>转为文字</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from 'vue';
import { consultService } from '@/services/consult.service';
import { getGlobalRequest } from '@/utils/platform.js';

// 聊天记录滚动位置
const scrollTop = ref(0);

// 语音输入相关状态
const showVoicePopup = ref(false);
const isRecording = ref(false);
const voiceFile = ref(null);

// 定义当前会话ID
const sessionId = ref('');

// 用户输入内容
const inputContent = ref('');

// 消息列表
const messages = ref([]);

// 记录当前会话ID
onLoad((option) => {
  console.log('页面加载，接收参数:', option);
  
  if (option && option.id) {
    sessionId.value = option.id;
    console.log('设置当前会话ID:', sessionId.value);
    // 加载会话消息
    loadSessionMessages();
  } else {
    console.error('错误：未能获取有效的会话ID', option);
    uni.showToast({
      title: '会话ID无效，请返回重试',
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 2000);
  }
});

// 加载会话消息
const loadSessionMessages = () => {
  uni.showLoading({
    title: '加载中'
  });
  
  // 使用consultService获取会话详情
  consultService.getSessionDetail(sessionId.value)
    .then(res => {
      uni.hideLoading();
      
      if (res.data && res.data.messages) {
        // 格式化消息
        messages.value = res.data.messages.map(msg => ({
          id: msg.id,
          type: msg.sender_type,
          content: msg.content,
          contentType: msg.content_type,
          time: formatTime(new Date(msg.created_at))
        }));
        
        // 滚动到底部
        setTimeout(() => {
          scrollTop.value = 9999;
        }, 100);
      }
    }).catch(err => {
      uni.hideLoading();
      console.error('加载消息失败', err);
      uni.showToast({
        title: '加载消息失败',
        icon: 'none'
      });
    });
};

// 处理发送消息
const handleSendMessage = () => {
  if (!inputContent.value.trim()) return;
  
  // 显示"正在输入"状态
  showTypingIndicator();
  
  // 保存用户输入内容，并清空输入框
  const userMessage = inputContent.value;
  inputContent.value = '';
  
  console.log('开始发送消息到会话:', sessionId.value, '内容:', userMessage);
  
  if (!sessionId.value) {
    console.error('错误：会话ID为空！无法发送消息');
    hideTypingIndicator();
    uni.showToast({
      title: '会话ID错误，请重新进入',
      icon: 'none'
    });
    return;
  }
  
  // 使用consultService发送消息
  consultService.sendMessage(
    sessionId.value,
    userMessage,
    'text',
    'chinese',
    1024,
    0.7
  ).then(res => {
    // 隐藏"正在输入"状态
    hideTypingIndicator();
    console.log('消息发送成功，收到响应:', res);
    
    // 根据千问医疗API格式处理响应
    if (res.code === 0) {
      // 添加用户消息
      messages.value.push({
        id: res.data.user_message.id,
        type: 'user',
        content: res.data.user_message.content,
        contentType: res.data.user_message.content_type,
        time: formatTime(new Date(res.data.user_message.created_at))
      });
      
      // 添加AI回复
      messages.value.push({
        id: res.data.ai_message.id,
        type: 'ai',
        content: res.data.ai_message.content,
        contentType: res.data.ai_message.content_type,
        time: formatTime(new Date(res.data.ai_message.created_at))
      });
      
      // 记录响应时间
      if (res.data.time_taken) {
        console.log(`AI响应时间: ${res.data.time_taken}秒`);
      }
    } else {
      // 处理错误情况
      console.error('AI回复失败:', res.message);
      uni.showToast({
        title: '获取AI回复失败',
        icon: 'none'
      });
      
      // 仍然显示用户消息
      messages.value.push({
        id: Date.now().toString(),
        type: 'user',
        content: userMessage,
        contentType: 'text',
        time: formatTime(new Date())
      });
    }
    
    // 滚动到底部
    setTimeout(() => {
      scrollTop.value = 9999;
    }, 100);
  }).catch(err => {
    // 隐藏"正在输入"状态
    hideTypingIndicator();
    
    console.error('发送消息失败', err);
    uni.showToast({
      title: '发送消息失败',
      icon: 'none'
    });
    
    // 仍然显示用户消息
    messages.value.push({
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      contentType: 'text',
      time: formatTime(new Date())
    });
  });
};

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 显示"正在输入"状态
const showTypingIndicator = () => {
  // 实现显示AI正在输入的状态指示器
  console.log('显示AI正在输入状态');
  
  // 这里可以添加到消息列表末尾一个特殊的"正在输入"消息
  messages.value.push({
    id: 'typing',
    type: 'typing',
    content: '正在输入...',
    contentType: 'text',
    time: formatTime(new Date())
  });
  
  // 滚动到底部
  setTimeout(() => {
    scrollTop.value = 9999;
  }, 100);
};

// 隐藏"正在输入"状态
const hideTypingIndicator = () => {
  console.log('隐藏AI正在输入状态');
  
  // 移除"正在输入"消息
  const typingIndex = messages.value.findIndex(msg => msg.id === 'typing');
  if (typingIndex !== -1) {
    messages.value.splice(typingIndex, 1);
  }
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 加载更多消息
const loadMoreMessages = () => {
  // 实现加载历史消息的逻辑
  console.log('加载更多消息');
};

// 处理拍照功能
const handleTakePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      console.log('拍照成功，图片路径:', tempFilePath);
      
      // 这里可以添加上传图片或将图片添加到消息中的逻辑
    }
  });
};

// 处理语音输入
const handleVoiceInput = () => {
  showVoicePopup.value = true;
};

// 开始录音
const startRecording = () => {
  isRecording.value = true;
  
  // 调用录音API
  const recorderManager = uni.getRecorderManager();
  recorderManager.start({
    duration: 60000, // 最长录制60s
    format: 'mp3'
  });
  
  // 录音结束事件
  recorderManager.onStop((res) => {
    voiceFile.value = res.tempFilePath;
    console.log('录音文件:', res.tempFilePath);
  });
};

// 停止录音
const stopRecording = () => {
  isRecording.value = false;
  const recorderManager = uni.getRecorderManager();
  recorderManager.stop();
};

// 取消语音输入
const cancelVoiceInput = () => {
  showVoicePopup.value = false;
  voiceFile.value = null;
};

// 将语音转为文字
const convertVoiceToText = () => {
  if (!voiceFile.value) {
    uni.showToast({
      title: '请先录制语音',
      icon: 'none'
    });
    return;
  }
  
  // 这里需要调用语音识别API
  // 示例代码，实际需要根据你使用的语音识别服务来实现
  uni.showLoading({
    title: '正在转换中...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '语音转换成功',
      icon: 'success'
    });
    showVoicePopup.value = false;
  }, 1500);
  
  // 实际项目中应该调用真实的语音识别API
  // 例如：
  // uploadVoiceFile(voiceFile.value).then(result => {
  //   // 处理识别结果
  // });
};

// 切换标签页
const switchTab = (tab) => {
  if (tab === 'home') {
    uni.switchTab({
      url: '/pages/index/index'
    });
  } else if (tab === 'consult') {
    uni.switchTab({
      url: '/pages/consult/index'
    });
  } else if (tab === 'my') {
    uni.switchTab({
      url: '/pages/my/index'
    });
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
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

.consult-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
}

/* 提示区域 */
.prompt-area {
  padding: 20rpx;
  background-color: #8ab6c8;
  text-align: center;
}

.prompt-text {
  color: #fff;
  font-size: 28rpx;
}

/* 聊天内容区域 */
.chat-container {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-text {
  color: #8a8a8a;
  font-size: 28rpx;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message {
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 8rpx;
  max-width: 100%;
}

.user-message {
  background-color: #8ab6c8;
  color: #fff;
}

.ai-message {
  background-color: #8ab6c8;
  color: #fff;
}

.doctor-message {
  background-color: #8ab6c8;
  color: #fff;
}

.message-sender {
  font-weight: bold;
  margin-right: 10rpx;
}

.message-content {
  word-break: break-all;
}

/* 底部输入区域 */
.input-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
  padding: 0 20rpx;
}

.message-input {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  border: 1rpx solid #e0e0e0;
  padding: 0 20rpx;
}

.action-btn {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 28rpx;
  background-color: #777;
  border-radius: 8rpx;
}

.photo-btn, .voice-btn, .send-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

/* 底部导航栏 */
.tab-bar {
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e0e0e0;
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
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 6rpx;
  background-color: #8a8a8a;
  border-radius: 50%;
}

.tab-text {
  font-size: 24rpx;
  color: #8a8a8a;
}

.tab-item.active .tab-icon {
  background-color: #3B82F6;
}

.tab-item.active .tab-text {
  color: #3B82F6;
}

/* 语音输入弹窗 */
.voice-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.voice-popup-content {
  width: 80%;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.voice-status {
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.voice-btn-container {
  margin-bottom: 30rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}

.voice-record-btn {
  width: 200rpx;
  height: 200rpx;
  border-radius: 100rpx;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 28rpx;
}

.voice-record-btn.recording {
  background-color: #8ab6c8;
  color: #fff;
}

.voice-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.voice-action-btn {
  padding: 16rpx 30rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #333;
}

.convert-btn {
  background-color: #8ab6c8;
  color: #fff;
}
</style> 