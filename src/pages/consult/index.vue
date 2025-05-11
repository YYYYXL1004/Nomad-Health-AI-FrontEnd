<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="page-title">{{ $t('consult.title') }}</text>
    </view>
    
    <!-- 聊天内容区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop" @scrolltolower="loadMoreMessages">
      <!-- 显示空状态或历史消息 -->
      <view v-if="messages.length === 0 || (messages.length === 1 && messages[0].type === 'system')" class="empty-state">
        <view class="welcome-tip">
          <text class="welcome-title">{{ $t('consult.welcomeTitle') }}</text>
          <text class="welcome-desc">{{ $t('consult.welcomeDesc') }}</text>
        </view>
        
        <view class="quick-questions">
          <text class="quick-questions-title">{{ $t('consult.commonQuestions') }}</text>
          <view class="question-list">
            <view class="question-item" v-for="(question, index) in suggestedQuestions" :key="index" @tap="handleSuggestedQuestion(question)">
              <text>{{ question }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 历史消息列表 -->
      <view v-else class="message-list">
        <view 
          v-for="(message, index) in messages" 
          :key="index" 
          class="message"
          :class="[message.type, {'quick-consult-message': message.isQuickConsult}]"
        >
          <view class="message-header">
            <text class="message-sender" :data-quick-consult-text="message.isQuickConsult ? $t('consult.quickConsultMessage') : ''">{{ getSenderText(message.type) }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
          <view class="message-body">
            <!-- 文本消息 -->
            <text v-if="message.contentType === 'text'" class="message-content">{{ message.content }}</text>
            
            <!-- 图片消息 -->
            <image v-else-if="message.contentType === 'image'" class="message-image" :src="message.content" mode="widthFix" @tap="previewImage(message.content)"></image>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view class="input-area">
      <!-- 拍照按钮 -->
      <view class="photo-btn" @tap="handleTakePhoto">
        <text class="btn-icon">📷</text>
      </view>
      
      <!-- 文本输入框 -->
      <input 
        type="text" 
        class="text-input" 
        v-model="inputMessage" 
        :placeholder="$t('consult.inputPlaceholder')"
        confirm-type="send"
        @confirm="handleSendMessage"
      />
      
      <!-- 语音按钮 -->
      <view class="voice-btn" @tap="handleVoiceInput">
        <text class="btn-icon">🎤</text>
      </view>
      
      <!-- 发送按钮 -->
      <view 
        class="send-btn" 
        :class="{ 'active': inputMessage.trim().length > 0 }" 
        @tap="handleSendMessage"
      >
        <text class="btn-icon">📤</text>
      </view>
    </view>
    
    <!-- 语音输入弹窗 -->
    <view class="voice-popup" v-if="showVoicePopup">
      <view class="voice-popup-content">
        <view class="voice-status">
          <text>{{ isRecording ? $t('consult.recordingTip') : $t('consult.recordingStart') }}</text>
        </view>
        <view class="voice-btn-container">
          <view 
            class="voice-record-btn" 
            :class="{ 'recording': isRecording }"
            @touchstart="startRecording"
            @touchend="stopRecording"
          >
            <text>{{ isRecording ? $t('consult.recordingStop') : $t('consult.recordingBtn') }}</text>
          </view>
        </view>
        <view class="voice-actions">
          <view class="voice-action-btn" @tap="cancelVoiceInput">
            <text>{{ $t('common.cancel') }}</text>
          </view>
          <view class="voice-action-btn convert-btn" @tap="convertVoiceToText">
            <text>{{ $t('consult.convertToText') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 页面底部添加快速咨询按钮 - 修改样式 -->
    <view class="quick-consult-btn" @tap="showQuickConsultInput">
      <view class="quick-consult-icon">💬</view>
      <text>{{ $t('consult.quickConsult') }}</text>
    </view>

    <!-- 快速咨询输入弹窗 -->
    <view class="quick-consult-popup" v-if="showQuickConsultPopup">
      <view class="quick-consult-content">
        <view class="quick-consult-header">
          <text>{{ $t('consult.quickConsultTitle') }}</text>
        </view>
        <view class="quick-consult-input">
          <textarea
            v-model="quickConsultQuery"
            :placeholder="$t('consult.quickConsultPlaceholder')"
            auto-height
          />
        </view>
        <view class="quick-consult-tip">
          <text>{{ $t('consult.quickConsultTip') }}</text>
        </view>
        <view class="quick-consult-actions">
          <view class="quick-action-btn cancel-btn" @tap="cancelQuickConsult">
            <text>{{ $t('common.cancel') }}</text>
          </view>
          <view class="quick-action-btn submit-btn" @tap="submitQuickConsult">
            <text>{{ $t('common.submit') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 创建会话提示 -->
    <view class="create-session-tip" v-if="showCreateSessionBtn">
      <text>{{ $t('consult.createSessionTip') }}</text>
      <view class="create-session-btn" @tap="createSessionFromQuickConsult">
        <text>{{ $t('consult.createSession') }}</text>
      </view>
    </view>

    <!-- 使用通用导航栏组件 -->
    <custom-tab-bar active="consult" />
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';
import CustomTabBar from '@/components/CustomTabBar.vue';
import { getBaseUrl, getGlobalRequest, getAppInstance } from '@/utils/platform.js';
import { consultApi } from '@/api/index.js';

// 获取API基础URL
const apiBaseUrl = getBaseUrl();

// 输入消息
const inputMessage = ref('');

// 聊天记录滚动位置
const scrollTop = ref(0);

// 语音输入相关状态
const showVoicePopup = ref(false);
const isRecording = ref(false);
const voiceFile = ref(null);

// 当前语言
const currentLang = ref(getCurrentLang());

// 当前语言偏好（用于发送消息）
const languagePreference = ref('chinese');

// 建议问题列表
const suggestedQuestions = computed(() => {
  if (currentLang.value === 'zh') {
    return [
      '我最近头痛，请问可能是什么原因？',
      '高血压患者的饮食应该注意什么？',
      '如何缓解失眠症状？',
      '感冒咳嗽应该吃什么药？'
    ];
  } else {
    // 蒙古语问题列表
    return [
      'ᠲᠣᠯᠭᠠᠢ ᠥᠪᠡᠷᠴᠦ ᠪᠠᠶᠢᠨᠠ᠂ ᠱᠠᠯᠲᠠᠭᠠᠨ ᠨᠢ ᠶᠠᠭᠤ ᠪᠣᠯᠵᠤ ᠪᠣᠯᠬᠤ ᠪᠤᠢ?',
      'ᠴᠢᠰᠤᠨ ᠤ ᠳᠠᠷᠤᠯᠲᠠ ᠢᠬᠡᠲᠡᠢ ᠬᠥᠮᠦᠰ ᠬᠣᠭᠣᠯᠠᠨ ᠳᠠᠭᠠᠨ ᠶᠠᠭᠤ ᠠᠩᠬᠠᠷᠬᠤ ᠶᠣᠰᠣᠲᠠᠢ ᠪᠤᠢ?',
      'ᠨᠣᠶᠢᠷᠭᠦᠢᠳᠡᠯ ᠢ ᠶᠠᠭᠠᠬᠢᠵᠤ ᠬᠥᠩᠭᠡᠪᠴᠢᠯᠡᠬᠦ ᠪᠤᠢ?',
      'ᠬᠠᠨᠢᠶᠠᠳ ᠲᠣᠮᠣᠭᠤ᠂ ᠬᠠᠨᠢᠶᠠᠯᠭᠠᠨ ᠳᠤ ᠶᠠᠮᠠᠷ ᠡᠮ ᠤᠤᠬᠤ ᠪᠤᠢ?'
    ];
  }
});

// 处理用户点击建议问题
const handleSuggestedQuestion = (question) => {
  // 设置输入框内容为选中的问题
  inputMessage.value = question;
  
  // 立即发送该问题
  handleSendMessage();
};

// 初始化聊天
const initConsultChat = () => {
  // 获取t方法
  let t = (key) => key; // 默认直接返回key
  try {
    if (uni.$t) {
      t = uni.$t;
    } else {
      const app = getAppInstance();
      if (app && app.config && app.config.globalProperties) {
        t = app.config.globalProperties.$t || t;
      }
    }
  } catch (e) {
    console.error('获取t方法失败:', e);
  }

  // 消息置空，让欢迎界面显示
  messages.value = [];
  
  // 可以在这里加载历史消息
  // 如果需要自动显示欢迎消息：
  // 打开下面的注释
  /*
  messages.value = [
    {
      type: 'system',
      contentType: 'text',
      content: t('consult.welcomeDesc'),
      time: formatTime(new Date())
    }
  ];
  */
  
  // 检查是否有活跃会话
  checkActiveSession();
};

// 聊天消息记录
const messages = ref([]);

// 当前会话ID
const currentSessionId = ref('');

// 快速咨询相关状态
const showCreateSessionBtn = ref(false);
const quickConsultData = ref(null);

// 快速咨询查询
const quickConsultQuery = ref('');

// 快速咨询弹窗
const showQuickConsultPopup = ref(false);

// 页面加载时执行
onMounted(() => {
  // 检查登录状态
  const isLoggedIn = uni.getStorageSync('isLoggedIn');
  if (!isLoggedIn) {
    uni.reLaunch({
      url: '/pages/login/index'
    });
    return;
  }
  
  // 初始化聊天数据
  initConsultChat();

  // 获取当前语言设置
  currentLang.value = getCurrentLang();
});

// 检查是否有活跃的会话
const checkActiveSession = () => {
  console.log('检查活跃会话...');
  
  // 使用consultApi替代直接调用request
  consultApi.getSessions('active')
    .then(res => {
      console.log('获取会话列表成功:', res);
      
      if (res.data && res.data.list && res.data.list.length > 0) {
        // 有活跃会话，获取会话ID并加载消息
        currentSessionId.value = res.data.list[0].id;
        console.log('找到活跃会话:', currentSessionId.value);
        loadMessages(currentSessionId.value);
      } else {
        // 没有活跃会话，显示空状态
        console.log('没有找到活跃会话');
        messages.value = [];
      }
    }).catch(err => {
      console.error('获取会话列表失败', err);
      // 使用默认测试消息
      if (currentLang.value === 'zh') {
        messages.value = [
          {
            type: 'system',
            contentType: 'text',
            content: '无法连接服务器，显示测试数据',
            time: formatTime(new Date())
          },
          {
            type: 'user',
            contentType: 'text',
            content: '我最近感觉头痛，该怎么办？',
            time: '10:30'
          },
          {
            type: 'ai',
            contentType: 'text',
            content: '头痛可能由多种原因引起，如压力、疲劳、感冒或偏头痛等。建议您先适当休息，保持充足睡眠，如果是轻微头痛可以尝试按摩太阳穴。',
            time: '10:31'
          }
        ];
      } else {
        messages.value = [
          {
            type: 'system',
            contentType: 'text',
            content: 'Серверт холбогдох боломжгүй, сорилтын өгөгдлийг харуулж байна',
            time: formatTime(new Date())
          },
          {
            type: 'user',
            contentType: 'text',
            content: 'Саяхан толгой өвдөж байна, яах ёстой вэ?',
            time: '10:30'
          },
          {
            type: 'ai',
            contentType: 'text',
            content: 'Толгой өвдөх нь стресс, ядрах, ханиад хүрэх эсвэл мигрень зэрэг олон шалтгаанаас үүдэлтэй. Эхлээд тохирох амралт, хангалттай нойр авахыг зөвлөж байна.',
            time: '10:31'
          }
        ];
      }
      
      // 滚动到底部
      setTimeout(() => {
        scrollTop.value = 9999;
      }, 300);
    });
};

// 加载消息
const loadMessages = (sessionId) => {
  if (!sessionId) {
    console.error('加载消息错误: 无效的会话ID');
    return;
  }
  
  console.log(`准备加载会话 ${sessionId} 的消息`);
  
  // 使用consultApi替代直接调用request
  consultApi.getMessages(sessionId)
    .then(res => {
      console.log('获取消息成功，响应:', res);
      
      if (res.data && res.data.messages) {
        // 格式化API返回的消息
        messages.value = res.data.messages.map(msg => {
          return {
            type: msg.sender_type, // user, doctor, ai
            contentType: msg.content_type, // text, image, voice
            content: msg.content,
            time: formatTime(new Date(msg.created_at))
          };
        });
        
        // 滚动到底部
        setTimeout(() => {
          scrollTop.value = 9999;
        }, 300);
      }
    }).catch(err => {
      console.error('获取消息记录失败', err);
      uni.showToast({
        title: currentLang.value === 'zh' ? '获取消息记录失败' : 'Мессежийн түүх авч чадсангүй',
        icon: 'none'
      });
    });
};

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 发送消息
const handleSendMessage = () => {
  if (!inputMessage.value.trim()) return;
  
  // 首先添加消息到界面
  const userMessage = {
    type: 'user',
    contentType: 'text',
    content: inputMessage.value,
    time: formatTime(new Date())
  };
  
  messages.value.push(userMessage);
  
  // 保存原始消息内容然后清空输入框
  const messageContent = inputMessage.value;
  inputMessage.value = '';
  
  // 滚动到底部
  setTimeout(() => {
    scrollTop.value = 9999;
  }, 100);
  
  // 判断是否有活跃会话，没有则创建新会话
  if (!currentSessionId.value) {
    // 创建新会话
    createNewSession(messageContent);
  } else {
    // 发送消息到现有会话
    sendMessageToSession(currentSessionId.value, messageContent);
  }
};

// 创建新会话
const createNewSession = (messageContent) => {
  console.log('开始创建新会话...');
  
  // 显示"正在输入"状态
  showTypingIndicator();
  
  // 使用consultApi替代直接调用request
  consultApi.createSession('健康咨询', messageContent)
    .then(res => {
      console.log('创建会话成功，响应数据:', res);
      
      // 检查响应中的多种可能的会话ID格式
      const sessionId = res.data?.sessionId || res.data?.id;
      
      if (sessionId) {
        currentSessionId.value = sessionId;
        console.log('设置当前会话ID:', currentSessionId.value);
        
        // 发送第一条消息到新创建的会话
        sendMessageToSession(currentSessionId.value, messageContent);
      } else {
        console.error('创建会话响应缺少sessionId:', res);
        hideTypingIndicator();
        uni.showToast({
          title: currentLang.value === 'zh' ? '创建会话失败: 无效的会话ID' : 'Харилцан яриа үүсгэж чадсангүй',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('创建会话失败', err);
      hideTypingIndicator();
      uni.showToast({
        title: currentLang.value === 'zh' ? '创建会话失败' : 'Харилцан яриа үүсгэж чадсангүй',
        icon: 'none'
      });
    });
};

// 发送消息到会话
const sendMessageToSession = (sessionId, content, contentType = 'text') => {
  if (!sessionId) {
    console.error('发送消息错误: 无效的会话ID');
    hideTypingIndicator();
    uni.showToast({
      title: currentLang.value === 'zh' ? '发送消息失败: 无效的会话ID' : 'Мессеж илгээж чадсангүй',
      icon: 'none'
    });
    return;
  }
  
  console.log(`准备发送消息到会话 ${sessionId}, URL路径: /api/consult/sessions/${sessionId}/messages`);
  
  // 显示"正在输入"状态
  showTypingIndicator();
  
  // 根据当前界面语言设置选择对应的语言参数
  let apiLanguage = 'chinese'; // 默认中文
  
  if (currentLang.value === 'mn-cyrl') {
    apiLanguage = 'mn-cyrl';
  } else if (currentLang.value === 'mn_trad') {
    apiLanguage = 'mn_trad';
  } else if (currentLang.value !== 'zh') {
    apiLanguage = currentLang.value; // 其他语言直接传递
  }
  
  console.log(`当前界面语言: ${currentLang.value}, 发送API请求语言参数: ${apiLanguage}`);
  
  // 使用consultApi替代直接调用request
  consultApi.sendMessage(
    sessionId,
    content, 
    contentType,
    apiLanguage, // 使用根据界面语言确定的API语言参数
    1024,
    0.7
  ).then(res => {
    // 发送成功
    console.log('消息发送成功，收到响应:', res);
    
    // 隐藏"正在输入"状态
    hideTypingIndicator();
    
    // 统一处理API响应，兼容不同格式
    if ((res.code === 0 || res.code === 200) && res.data) {
      if (res.data.user_message && res.data.ai_message) {
        // 新接口格式，包含用户消息和AI回复
        // 更新用户消息
        const userMessageIndex = messages.value.findIndex(msg => 
          msg.type === 'user' && 
          msg.content === content
        );
        
        if (userMessageIndex !== -1) {
          // 更新已存在的用户消息
          messages.value[userMessageIndex] = {
            type: 'user',
            contentType: contentType,
            content: res.data.user_message.content,
            time: formatTime(new Date(res.data.user_message.created_at))
          };
        }
        
        // 添加AI回复
        messages.value.push({
          type: res.data.ai_message.sender_type || 'ai',
          contentType: res.data.ai_message.content_type || 'text',
          content: res.data.ai_message.content,
          time: formatTime(new Date(res.data.ai_message.created_at))
        });
        
        // 记录响应时间
        if (res.data.time_taken) {
          console.log(`AI响应时间: ${res.data.time_taken}秒`);
        }
      } else if (res.data.content) {
        // 兼容旧接口响应格式
        // 添加医生/AI回复
        messages.value.push({
          type: res.data.sender || 'ai',
          contentType: res.data.contentType || 'text',
          content: res.data.content,
          time: formatTime(new Date())
        });
      } else if (res.data.answer) {
        // 兼容快速问答接口格式
        messages.value.push({
          type: 'ai', 
          contentType: 'text',
          content: res.data.answer,
          time: formatTime(new Date())
        });
      } else {
        console.warn('未识别的响应格式，尝试使用通用处理:', res);
        // 通用处理，尝试提取任何可能的回复内容
        const content = res.data.answer || res.data.content || res.data.message || res.message || '收到回复';
        messages.value.push({
          type: 'ai',
          contentType: 'text',
          content: content,
          time: formatTime(new Date())
        });
      }
      
      // 滚动到底部
      setTimeout(() => {
        scrollTop.value = 9999;
      }, 100);
    } else {
      console.error('未收到预期的API响应格式:', res);
      // 只要收到了响应，即使格式不符也尝试显示
      if (res.message || (res.data && (res.data.message || res.data.content))) {
        messages.value.push({
          type: 'ai',
          contentType: 'text',
          content: res.message || res.data?.message || res.data?.content || '收到回复',
          time: formatTime(new Date())
        });
      } else {
        // 如果没有任何可显示内容，显示通用回复
        messages.value.push({
          type: 'ai',
          contentType: 'text',
          content: '很抱歉，系统无法理解您的问题，请重新描述您的症状。',
          time: formatTime(new Date())
        });
      }
      
      // 如果没有返回预期的响应格式，尝试刷新消息列表
      setTimeout(() => {
        loadMessages(sessionId);
      }, 1000);
    }
  }).catch(err => {
    // 隐藏"正在输入"状态
    hideTypingIndicator();
    
    console.error('发送消息失败', err);
    uni.showToast({
      title: currentLang.value === 'zh' ? '发送消息失败' : 'Мессеж илгээж чадсангүй',
      icon: 'none'
    });
    
    // 移除失败的消息或标记为失败
    const failedIndex = messages.value.findIndex(msg => 
      msg.type === 'user' && 
      msg.content === content
    );
    
    if (failedIndex !== -1) {
      messages.value[failedIndex].failed = true;
    }
  });
};

// 根据消息类型获取发送者文本
const getSenderText = (type) => {
  switch(type) {
    case 'user': return currentLang.value === 'zh' ? '用户:' : 'Хэрэглэгч:';
    case 'ai': return 'AI:';
    case 'doctor': return currentLang.value === 'zh' ? '医生:' : 'Эмч:';
    default: return '';
  }
};

// 加载更多消息
const loadMoreMessages = () => {
  console.log('加载更多消息');
};

// 处理拍照功能
const handleTakePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      
      // 上传图片
      uni.uploadFile({
        url: apiBaseUrl + '/api/consult/upload',
        filePath: tempFilePath,
        name: 'file',
        formData: {
          type: 'image'
        },
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token')
        },
        success: (uploadRes) => {
          const data = JSON.parse(uploadRes.data);
          if (data.status === 200 && data.data.url) {
            // 添加图片消息到UI
            messages.value.push({
              type: 'user',
              contentType: 'image',
              content: data.data.url,
              time: formatTime(new Date())
            });
            
            // 如果有活跃会话，发送图片消息
            if (currentSessionId.value) {
              sendMessageToSession(currentSessionId.value, data.data.url, 'image');
            } else {
              // 没有活跃会话，创建新会话
              createNewSession('图片内容');
            }
            
            // 滚动到底部
            setTimeout(() => {
              scrollTop.value = 9999;
            }, 100);
          } else {
            uni.showToast({
              title: currentLang.value === 'zh' ? '图片上传失败' : 'Зураг байршуулж чадсангүй',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: currentLang.value === 'zh' ? '图片上传失败' : 'Зураг байршуулж чадсангүй',
            icon: 'none'
          });
        }
      });
    }
  });
};

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url]
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
      title: currentLang.value === 'zh' ? '请先录制语音' : 'Эхлээд дуу бичнэ үү',
      icon: 'none'
    });
    return;
  }
  
  // 这里需要调用语音识别API
  // 示例代码，实际需要根据你使用的语音识别服务来实现
  uni.showLoading({
    title: currentLang.value === 'zh' ? '正在转换中...' : 'Хөрвүүлж байна...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
    
    // 模拟转换结果
    inputMessage.value = currentLang.value === 'zh' ? "这是通过语音识别转换的文字" : "Энэ бол дуу танилтаар хөрвүүлсэн текст";
    
    uni.showToast({
      title: currentLang.value === 'zh' ? '语音转换成功' : 'Дуу хөрвүүлэлт амжилттай',
      icon: 'success'
    });
    
    showVoicePopup.value = false;
  }, 1500);
};

// 显示"正在输入"状态
const showTypingIndicator = () => {
  // 实现显示AI正在输入的状态指示器
  console.log('显示AI正在输入状态');
  
  // 这里可以添加到消息列表末尾一个特殊的"正在输入"消息
  // 或者在界面某处显示一个动画指示器
  messages.value.push({
    type: 'typing',
    contentType: 'text',
    content: currentLang.value === 'zh' ? '正在输入...' : 'Бичиж байна...',
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
  const typingIndex = messages.value.findIndex(msg => msg.type === 'typing');
  if (typingIndex !== -1) {
    messages.value.splice(typingIndex, 1);
  }
};

// 快速咨询功能
const quickConsult = (query) => {
  // 显示加载状态
  showTypingIndicator();
  
  const request = getGlobalRequest();
  request({
    url: '/api/consult/medical-qa',
    method: 'POST',
    data: {
      query: query,
      language: languagePreference.value || 'chinese',
      max_tokens: 1024,
      temperature: 0.7
    }
  }).then(res => {
    // 隐藏加载状态
    hideTypingIndicator();
    
    if (res.data && res.data.response) {
      // 显示用户查询
      messages.value.push({
        type: 'user',
        contentType: 'text',
        content: query,
        time: formatTime(new Date()),
        isQuickConsult: true
      });
      
      // 显示AI回复
      messages.value.push({
        type: 'ai',
        contentType: 'text',
        content: res.data.response,
        time: formatTime(new Date()),
        isQuickConsult: true
      });
      
      // 可选：显示响应时间
      if (res.data.time_taken) {
        console.log(`快速咨询响应时间: ${res.data.time_taken}秒`);
      }
      
      // 显示"创建会话"选项
      showCreateSessionOption(query, res.data.response);
      
      // 滚动到底部
      setTimeout(() => {
        scrollTop.value = 9999;
      }, 100);
    } else {
      uni.showToast({
        title: currentLang.value === 'zh' ? '获取回复失败' : 'Хариу авч чадсангүй',
        icon: 'none'
      });
    }
  }).catch(err => {
    // 隐藏加载状态
    hideTypingIndicator();
    
    console.error('快速咨询失败', err);
    uni.showToast({
      title: currentLang.value === 'zh' ? '快速咨询失败' : 'Хурдан зөвлөгөө авч чадсангүй',
      icon: 'none'
    });
  });
};

// 显示创建会话选项
const showCreateSessionOption = (query, response) => {
  // 实现显示创建会话选项的逻辑
  showCreateSessionBtn.value = true;
  quickConsultData.value = {
    query,
    response
  };
  
  setTimeout(() => {
    // 5秒后自动隐藏
    showCreateSessionBtn.value = false;
  }, 5000);
};

// 基于快速咨询内容创建新会话
const createSessionFromQuickConsult = () => {
  if (!quickConsultData.value) return;
  
  createNewSession(quickConsultData.value.query);
  showCreateSessionBtn.value = false;
};

// 显示快速咨询输入弹窗
const showQuickConsultInput = () => {
  showQuickConsultPopup.value = true;
};

// 取消快速咨询
const cancelQuickConsult = () => {
  showQuickConsultPopup.value = false;
  quickConsultQuery.value = '';
};

// 提交快速咨询
const submitQuickConsult = () => {
  if (!quickConsultQuery.value.trim()) {
    uni.showToast({
      title: currentLang.value === 'zh' ? '请输入咨询内容' : 'Зөвлөгөө авах агуулгыг оруулна уу',
      icon: 'none'
    });
    return;
  }
  
  // 关闭弹窗
  showQuickConsultPopup.value = false;
  
  // 显示加载状态
  uni.showLoading({
    title: currentLang.value === 'zh' ? '正在咨询中...' : 'Зөвлөгөө авч байна...'
  });
  
  // 调用医疗快速问答API
  consultApi.medicalQA(
    quickConsultQuery.value,
    languagePreference.value || 'chinese',
    1024,
    0.7
  ).then(res => {
    // 隐藏加载状态
    uni.hideLoading();
    
    console.log('快速咨询响应:', res);
    
    if (res.data && res.data.response) {
      // 显示用户查询
      messages.value.push({
        type: 'user',
        contentType: 'text',
        content: quickConsultQuery.value,
        time: formatTime(new Date()),
        isQuickConsult: true
      });
      
      // 显示AI回复
      messages.value.push({
        type: 'ai',
        contentType: 'text',
        content: res.data.response,
        time: formatTime(new Date()),
        isQuickConsult: true
      });
      
      // 可选：显示响应时间
      if (res.data.time_taken) {
        console.log(`快速咨询响应时间: ${res.data.time_taken}秒`);
      }
      
      // 显示"创建会话"选项
      showCreateSessionOption(quickConsultQuery.value, res.data.response);
      
      // 清空查询内容
      quickConsultQuery.value = '';
      
      // 滚动到底部
      setTimeout(() => {
        scrollTop.value = 9999;
      }, 100);
    } else {
      uni.showToast({
        title: currentLang.value === 'zh' ? '获取回复失败' : 'Хариу авч чадсангүй',
        icon: 'none'
      });
    }
  }).catch(err => {
    uni.hideLoading();
    
    console.error('快速咨询失败', err);
    uni.showToast({
      title: currentLang.value === 'zh' ? '快速咨询失败' : 'Хурдан зөвлөгөө авч чадсангүй',
      icon: 'none'
    });
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
  padding-bottom: 100rpx; /* 为底部导航留出空间 */
}

/* 顶部标题 */
.header {
  background-color: #8ab6c8;
  padding: 20rpx;
  text-align: center;
}

.page-title {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 500;
}

/* 聊天内容区域 */
.chat-container {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
  height: calc(100vh - 290rpx); /* 调整高度，减去顶部标题、输入区域和底部导航的高度 */
  max-height: 65vh; /* 限制最大高度，确保输入框始终可见 */
}

.empty-state {
  display: flex;
  height: 200rpx;
  justify-content: center;
  align-items: center;
}

.welcome-tip {
  text-align: center;
}

.welcome-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.welcome-desc {
  font-size: 24rpx;
  color: #999;
}

.quick-questions {
  margin-top: 20rpx;
}

.quick-questions-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.question-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.question-item {
  padding: 10rpx 20rpx;
  background-color: #8ab6c8;
  color: #fff;
  border-radius: 30rpx;
  margin: 5rpx;
  cursor: pointer;
}

.message-list {
  padding-bottom: 20rpx;
}

.message {
  margin-bottom: 20rpx; /* 减小消息间距 */
  max-width: 80%;
}

.user {
  align-self: flex-end;
  margin-left: auto;
}

.ai, .doctor {
  align-self: flex-start;
  margin-right: auto;
}

.message-header {
  margin-bottom: 4rpx; /* 减小头部与内容间距 */
  display: flex;
  align-items: center;
}

.message-sender {
  font-size: 24rpx; /* 减小发送者字体 */
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
}

.message-time {
  font-size: 20rpx; /* 减小时间字体 */
  color: #999;
}

.message-body {
  background-color: #fff;
  padding: 12rpx; /* 减小内边距 */
  border-radius: 10rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.user .message-body {
  background-color: #8ab6c8;
}

.user .message-content {
  color: #fff;
}

.message-content {
  font-size: 26rpx; /* 减小内容字体 */
  line-height: 1.4; /* 减小行高 */
  word-break: break-all;
}

.message-image {
  width: 100%;
  border-radius: 6rpx;
}

/* 底部输入区域 */
.input-area {
  height: 90rpx; /* 略微减小输入区域高度 */
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  border-top: 1rpx solid #eee;
  position: fixed;
  bottom: 110rpx; /* 修改为110rpx，与TabBar高度一致 */
  left: 0;
  right: 0;
  z-index: 10;
}

.photo-btn, .voice-btn, .send-btn {
  width: 70rpx; /* 减小按钮尺寸 */
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.btn-icon {
  font-size: 36rpx; /* 减小图标尺寸 */
}

.text-input {
  flex: 1;
  height: 60rpx; /* 减小输入框高度 */
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 20rpx;
  margin: 0 16rpx;
  font-size: 26rpx; /* 减小字体大小 */
}

.send-btn {
  background-color: #ddd;
}

.send-btn.active {
  background-color: #8ab6c8;
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

/* 页面底部添加快速咨询按钮 - 修改样式 */
.quick-consult-btn {
  position: fixed;
  bottom: 190rpx; /* 调高位置，避免遮挡输入框和发送按钮 */
  right: 30rpx; /* 保持右侧悬浮 */
  background-color: #8ab6c8;
  border-radius: 50rpx;
  padding: 15rpx 25rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.quick-consult-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
  color: #fff;
}

.quick-consult-btn text {
  color: #fff;
  font-size: 26rpx;
}

/* 快速咨询输入弹窗 */
.quick-consult-popup {
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

.quick-consult-content {
  width: 80%;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-consult-header {
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.quick-consult-input {
  width: 100%;
  margin-bottom: 20rpx;
}

.quick-consult-input textarea {
  width: 100%;
  min-height: 150rpx;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.quick-consult-tip {
  width: 100%;
  margin-bottom: 30rpx;
  font-size: 24rpx;
  color: #999;
  text-align: left;
}

.quick-consult-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.quick-action-btn {
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  text-align: center;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.submit-btn {
  background-color: #8ab6c8;
  color: #fff;
}

/* 创建会话提示 */
.create-session-tip {
  position: fixed;
  bottom: 110rpx; /* 与TabBar高度一致 */
  right: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 70%;
}

.create-session-tip text {
  font-size: 26rpx;
  margin-bottom: 16rpx;
  color: #333;
}

.create-session-btn {
  background-color: #8ab6c8;
  color: #fff;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}

.quick-consult-message .message-body {
  border-left: 4rpx solid #ff9800; /* 添加左侧边框标识这是快速咨询消息 */
}

.quick-consult-message .message-sender::after {
  content: " (" attr(data-quick-consult-text) ")";
  font-size: 20rpx;
  color: #ff9800;
  font-weight: normal;
}
</style> 