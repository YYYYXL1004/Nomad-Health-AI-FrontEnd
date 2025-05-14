import { request } from '../utils/request';
import { CONFIG } from '../utils';
import { TConsultSession, TConsultMessage, TApiResponse } from '../types/index.d';

// 问诊服务
class ConsultService {
  // 获取问诊会话列表
  getSessions(status) {
    const params = status ? { status } : {};
    return request({
      url: '/api/consult/sessions',
      method: 'GET',
      data: params
    });
  }
  
  // 创建问诊会话
  createSession(title, description) {
    return request({
      url: '/api/consult/sessions',
      method: 'POST',
      data: { title, description }
    });
  }
  
  // 获取会话详情
  getSessionDetail(sessionId) {
    return request({
      url: `/api/consult/sessions/${sessionId}`,
      method: 'GET'
    });
  }
  
  // 获取问诊消息记录
  getMessages(sessionId, before, limit = 20) {
    return request({
      url: `/api/consult/sessions/${sessionId}/messages`,
      method: 'GET',
      data: before ? { before, limit } : { limit }
    });
  }
  
  // 发送问诊消息（更新后的接口）
  sendMessage(sessionId, content, content_type = 'text', language = 'chinese', max_tokens = 512, temperature = 0.7) {
    if (!sessionId) {
      console.error('发送消息错误：会话ID为空');
      return Promise.reject(new Error('会话ID不能为空'));
    }
    
    console.log(`服务层: 发送消息到会话${sessionId}, 内容: ${content}, 语言: ${language}, 路径: /api/consult/sessions/${sessionId}/messages`);
    
    // 在蒙古语环境下，确保language参数正确
    // 将蒙古语代码映射到后端接受的格式
    let apiLanguage = language;
    if (language === 'mn-cyrl' || language === 'mn_trad') {
      apiLanguage = 'mongolian'; // 确保后端接受'mongolian'作为语言参数
      console.log('检测到蒙古语环境，已将语言参数映射为:', apiLanguage);
    }
    
    return request({
      url: `/api/consult/sessions/${sessionId}/messages`,
      method: 'POST',
      data: { 
        content, 
        content_type, 
        language: apiLanguage, // 使用映射后的语言参数
        max_tokens,
        temperature
      }
    }).then(res => {
      console.log('收到医疗API响应:', res);
      
      // 增加验证，确认是否调用了真实的医疗API
      if (res.data && res.data.is_mock) {
        console.warn('警告：这是模拟数据，未调用真实API');
      } else {
        console.log('成功：调用了真实的医疗问答API');
      }
      
      // 验证响应中是否包含用户消息和AI回复
      if ((res.code === 0 || res.code === 200) && res.data) {
        if (!res.data.user_message) {
          console.error('错误：响应中缺少用户消息数据');
        }
        if (!res.data.ai_message) {
          console.error('错误：响应中缺少AI回复数据');
        }
      } else {
        console.error(`错误：API返回错误码 ${res.code}`, res.message);
      }
      
      return res;
    });
  }
  
  // 医疗快速问答接口（新增）
  medicalQA(query, language = 'chinese', max_tokens = 1024, temperature = 0.7) {
    console.log(`医疗快速问答，查询: ${query}, 语言: ${language}`);
    
    // 在蒙古语环境下，确保language参数正确
    // 将蒙古语代码映射到后端接受的格式
    let apiLanguage = language;
    if (language === 'mn-cyrl' || language === 'mn_trad') {
      apiLanguage = 'mongolian'; // 确保后端接受'mongolian'作为语言参数
      console.log('检测到蒙古语环境，已将语言参数映射为:', apiLanguage);
    }
    
    return request({
      url: '/api/consult/medical-qa',
      method: 'POST',
      data: {
        query,
        language: apiLanguage, // 使用映射后的语言参数
        max_tokens,
        temperature
      }
    }).then(res => {
      // 增加验证，确认是否调用了真实的医疗API
      if (res.data && res.data.is_mock) {
        console.warn('警告：这是模拟数据，未调用真实API');
      } else {
        console.log('成功：调用了真实的医疗问答API，响应时间：', res.data?.time_taken || '未知');
      }
      
      // 检查响应格式
      if ((res.code === 0 || res.code === 200) && res.data) {
        console.log('医疗问答响应格式正确');
      } else {
        console.error('医疗问答响应格式错误:', res);
      }
      
      return res;
    });
  }
  
  // 语音问诊（上传音频）
  uploadAudio(sessionId, filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: CONFIG.API.BASE_URL + `/api/consult/sessions/${sessionId}/audio`,
        filePath: filePath,
        name: 'audio',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync(CONFIG.STORAGE.TOKEN)}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            resolve(data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
  
  // 健康问答接口
  getHealthQA(query, language = 'chinese') {
    return request({
      url: '/api/health/qa',
      method: 'POST',
      data: { query, language }
    });
  }
  
  // 结束问诊会话
  endSession(sessionId) {
    return request({
      url: `/api/consult/sessions/${sessionId}/end`,
      method: 'POST'
    });
  }
  
  // 评价问诊会话
  rateSession(sessionId, rating, comment) {
    return request({
      url: `/api/consult/sessions/${sessionId}/rate`,
      method: 'POST',
      data: { rating, comment }
    });
  }
}

export const consultService = new ConsultService(); 