// 导入平台兼容性函数
import { getGlobalRequest, getBaseUrl } from '@/utils/platform.js';

// 用户认证相关API
export const authApi = {
  // 登录
  login: (account, password) => {
    const request = getGlobalRequest();
    
    // 转换参数名称以匹配后端API
    const apiParams = {
      account: account,
      password: password
    };
    
    console.log('登录请求参数:', apiParams);
    
    return request({
      url: '/api/auth/login',
      method: 'POST',
      data: apiParams
    });
  },
  
  // 注册
  register: (userData) => {
    const request = getGlobalRequest();
    
    // 转换参数名称以匹配后端API
    const apiParams = {
      account: userData.username,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      phone: userData.mobile,
      nickname: userData.nickname || userData.username
    };
    
    console.log('注册请求参数:', apiParams);
    
    return request({
      url: '/api/auth/register',
      method: 'POST',
      data: apiParams
    });
  },
  
  // 找回密码
  resetPassword: (phone, verifyCode, newPassword) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/auth/reset-password',
      method: 'POST',
      data: { phone, verifyCode, newPassword }
    });
  },
  
  // 退出登录
  logout: () => {
    const request = getGlobalRequest();
    return request({
      url: '/api/auth/logout',
      method: 'POST'
    });
  }
};

// 用户信息相关API
export const userApi = {
  // 获取用户资料
  getProfile: () => {
    const request = getGlobalRequest();
    return request({
      url: '/api/user/profile',
      method: 'GET'
    });
  },
  
  // 更新用户资料
  updateProfile: (userData) => {
    const request = getGlobalRequest();
    
    // 确保只传递API文档中支持的字段
    const apiParams = {
      nickname: userData.nickname,
      gender: userData.gender,
      avatar: userData.avatar,
      phone: userData.phone,
      email: userData.email,
      address: userData.address
    };
    
    return request({
      url: '/api/user/profile',
      method: 'PUT',
      data: apiParams
    });
  },
  
  // 上传头像
  uploadAvatar: (filePath) => {
    // 处理Blob URL
    if (filePath && filePath.startsWith('blob:')) {
      console.log('检测到Blob URL头像，使用默认头像替代');
      // 返回默认头像
      return Promise.resolve({
        code: 0,
        message: '使用默认头像',
        data: {
          url: '/src/static/images/default-avatar.jpg'
        }
      });
    }
    
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: getBaseUrl() + '/api/upload/image',
        filePath: filePath,
        name: 'image',
        formData: {
          type: 'avatar'
        },
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
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
          console.error('上传头像失败:', err);
          reject(err);
        }
      });
    });
  },
  
  // 获取用户信息
  getUserInfo: () => {
    const request = getGlobalRequest();
    return request({
      url: '/api/user/info',
      method: 'GET'
    });
  }
};

// 健康服务相关API
export const healthApi = {
  // 获取健康报告列表
  getReports: (page = 1, limit = 10) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/health/reports',
      method: 'GET',
      data: { page, limit }
    });
  },
  
  // 获取健康报告详情
  getReportDetail: (reportId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/health/reports/${reportId}`,
      method: 'GET'
    });
  },
  
  // 获取健康建议
  getHealthAdvice: (type) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/health/advice',
      method: 'GET',
      data: type ? { type } : {}
    });
  },
  
  // 获取健康资讯列表
  getTips: (params = {}) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/health/tips',
      method: 'GET',
      data: params
    });
  },
  
  // 健康问答接口
  getHealthQA: (query, language = 'chinese') => {
    const request = getGlobalRequest();
    
    // 映射语言参数为后端接受的格式
    let apiLanguage = language;
    if (language === 'mn-cyrl' || language === 'mn_trad') {
      apiLanguage = 'mongolian'; // 确保后端接受'mongolian'作为语言参数
      console.log('检测到蒙古语环境，已将健康问答语言参数映射为:', apiLanguage);
    }
    
    return request({
      url: '/api/health/qa',
      method: 'POST',
      data: { query, language: apiLanguage }
    });
  }
};

// 在线问诊相关API
export const consultApi = {
  // 获取问诊会话列表
  getSessions: (status) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/consult/sessions',
      method: 'GET',
      data: status ? { status } : {}
    });
  },
  
  // 创建问诊会话
  createSession: (title, description) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/consult/sessions',
      method: 'POST',
      data: { title, description }
    });
  },
  
  // 获取会话详情
  getSessionDetail: (sessionId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/consult/sessions/${sessionId}`,
      method: 'GET'
    });
  },
  
  // 获取问诊消息记录
  getMessages: (sessionId, before, limit = 20) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/consult/sessions/${sessionId}/messages`,
      method: 'GET',
      data: before ? { before, limit } : { limit }
    });
  },
  
  // 发送问诊消息（更新后的接口：发送后立即返回AI回复）
  sendMessage: (sessionId, content, content_type = 'text', language = 'chinese', max_tokens = 1024, temperature = 0.7) => {
    if (!sessionId) {
      console.error('错误：sendMessage方法缺少会话ID');
      return Promise.reject(new Error('发送消息需要有效的会话ID'));
    }
    
    const request = getGlobalRequest();
    const apiUrl = `/api/consult/sessions/${sessionId}/messages`;
    console.log(`发送问诊消息到会话 ${sessionId}，API路径：${apiUrl}，内容：${content}`);
    
    // 映射语言参数为后端接受的格式
    let apiLanguage = language;
    if (language === 'mn-cyrl' || language === 'mn_trad') {
      apiLanguage = 'mongolian'; // 确保后端接受'mongolian'作为语言参数
      console.log('检测到蒙古语环境，已将语言参数映射为:', apiLanguage);
    }
    
    return request({
      url: apiUrl,
      method: 'POST',
      data: { 
        content, 
        content_type, 
        language: apiLanguage,
        max_tokens,
        temperature
      }
    });
  },
  
  // 医疗快速问答（新增接口：不创建会话的单次咨询）
  medicalQA: (query, language = 'chinese', max_tokens = 1024, temperature = 0.7) => {
    const request = getGlobalRequest();
    
    // 映射语言参数为后端接受的格式
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
        language: apiLanguage,
        max_tokens,
        temperature
      }
    });
  },
  
  // 语音问诊（上传音频）
  uploadAudio: (sessionId, filePath) => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: getBaseUrl() + `/api/consult/sessions/${sessionId}/audio`,
        filePath: filePath,
        name: 'audio',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
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
  },
  
  // 图片问诊（上传图片）
  uploadImage: (filePath, type = 'symptom') => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: getBaseUrl() + '/api/consult/upload',
        filePath: filePath,
        name: 'image',
        formData: {
          type: type
        },
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
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
  },
  
  // 结束问诊
  endSession: (sessionId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/consult/sessions/${sessionId}/end`,
      method: 'POST'
    });
  }
};

// 处方相关API
export const prescriptionApi = {
  // 获取处方列表
  getPrescriptions: (params = {}) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/prescriptions',
      method: 'GET',
      data: params
    });
  },
  
  // 获取处方详情
  getPrescriptionDetail: (prescriptionId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/prescriptions/${prescriptionId}`,
      method: 'GET'
    });
  },
  
  // 确认处方
  confirmPrescription: (prescriptionId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/prescriptions/${prescriptionId}/confirm`,
      method: 'POST'
    });
  }
};

// 健康文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: (params = {}) => {
    const request = getGlobalRequest();
    return request({
      url: '/api/articles',
      method: 'GET',
      data: params
    });
  },
  
  // 获取文章详情
  getArticleDetail: (articleId) => {
    const request = getGlobalRequest();
    return request({
      url: `/api/articles/${articleId}`,
      method: 'GET'
    });
  },
  
  // 获取文章分类
  getCategories: () => {
    const request = getGlobalRequest();
    return request({
      url: '/api/articles/categories',
      method: 'GET'
    });
  }
};

// 文件上传相关API
export const uploadApi = {
  // 上传图片
  uploadImage: (filePath, type = 'general') => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: getBaseUrl() + '/api/upload/image',
        filePath: filePath,
        name: 'image',
        formData: {
          type: type
        },
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
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
}; 