import CONFIG from '../config';

// 网络请求工具函数
// API的基础URL - 使用配置中的值
const API_BASE_URL = CONFIG.API.BASE_URL;

// 是否使用模拟数据 - 使用配置中的值
const USE_MOCK_DATA = CONFIG.API.USE_MOCK;

// 请求方法
export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 详细请求日志
    console.log(`发送请求: ${CONFIG.API.BASE_URL + options.url}`, options);
    
    // 模拟数据处理
    if (CONFIG.API.USE_MOCK) {
      return handleMockRequest(options, resolve);
    }
    
    // 设置请求头
    const header = options.header || {};
    // 从本地存储获取token
    const token = uni.getStorageSync(CONFIG.STORAGE.TOKEN);
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    // 设置语言
    const language = uni.getStorageSync(CONFIG.STORAGE.LANGUAGE) || CONFIG.DEFAULTS.LANGUAGE;
    // 映射语言参数为后端接受的格式
    let apiLanguage = language;
    if (language === 'mn-cyrl' || language === 'mn_trad') {
      apiLanguage = 'mongolian'; // 后端接受 'mongolian' 作为蒙古语言参数
      console.log('检测到蒙古语环境，语言参数映射为:', apiLanguage);
    }
    header['Accept-Language'] = apiLanguage;
    
    // 发起请求
    uni.request({
      url: CONFIG.API.BASE_URL + options.url,
      data: options.data,
      method: options.method || 'GET',
      header: header,
      timeout: options.timeout || CONFIG.API.TIMEOUT,
      success: (res) => {
        // 记录响应日志
        console.log(`收到响应: ${options.url}`, res);
        
        // 处理响应数据
        if (res.statusCode === 200) {
          // API正常响应
          const apiResponse = res.data;
          // 直接返回API响应，由业务代码处理具体状态码
          resolve(apiResponse);
        } else {
          // HTTP错误
          handleHttpError(res);
          reject(res);
        }
      },
      fail: (err) => {
        // 网络错误
        console.error(`请求失败: ${options.url}`, err);
        
        // 只有特定接口失败时才显示错误提示
        // 排除首页相关接口的错误提示
        if (!options.url.includes('/articles') && 
            !options.url.includes('/health/reports') &&
            !options.url.includes('/health/advice')) {
          showErrorToast('网络连接异常，请稍后重试');
        }
        
        // 对于首页相关接口，静默失败但仍然返回reject以触发后续的回退逻辑
        reject(err);
      }
    });
  });
};

// 处理模拟请求
function handleMockRequest(options, resolve) {
  // 模拟登录API
  if (options.url === '/api/auth/login' && options.method === 'POST') {
    // 简化模拟登录逻辑，不论输入什么账号密码都返回成功
    setTimeout(() => {
      console.log('模拟登录成功，账号：', options.data.account);
      const mockResponse = {
        code: 200,
        message: 'login_success',
        data: {
          token: 'mock_token_12345',
          userId: '123',
          nickname: options.data.account || '测试用户',
          avatar: CONFIG.DEFAULTS.AVATAR,
          expiresIn: 86400
        },
        timestamp: Date.now()
      };
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟注册API
  if (options.url === '/api/auth/register' && options.method === 'POST') {
    // 延迟200ms模拟网络请求
    setTimeout(() => {
      console.log('模拟注册成功，账号：', options.data.account);
      const mockResponse = {
        code: 200,
        message: 'register_success',
        data: {
          userId: 'new_' + Date.now(),
          account: options.data.account,
          nickname: options.data.nickname || options.data.account
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟用户信息API
  if (options.url === '/api/user/info' && options.method === 'GET') {
    // 延迟200ms模拟网络请求
    setTimeout(() => {
      const mockResponse = {
        code: 200,
        message: 'success',
        data: {
          userId: '123',
          account: 'test',
          nickname: '测试用户',
          username: '测试用户',
          avatar: CONFIG.DEFAULTS.AVATAR,
          gender: 'male',
          birthday: '1990-01-01',
          phone: '1380013xxxx',
          email: 'user@example.com',
          address: '内蒙古锡林郭勒盟'
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟用户资料API（新接口）
  if (options.url === '/api/user/profile' && options.method === 'GET') {
    // 延迟200ms模拟网络请求
    setTimeout(() => {
      // 获取当前语言
      const language = uni.getStorageSync(CONFIG.STORAGE.LANGUAGE) || CONFIG.DEFAULTS.LANGUAGE;
      
      // 根据语言准备响应
      let message = "获取成功";
      if (language === 'mn_trad' || language === 'mn-cyrl') {
        message = "Амжилттай";
      }
      
      const mockResponse = {
        code: 200,
        message: message,
        data: {
          userId: 123,
          account: "testuser",
          nickname: "测试用户",
          avatar: CONFIG.DEFAULTS.AVATAR,
          gender: "male",      // male(男)、female(女)、unknown(未知)
          birthday: null,      // 出生日期，格式：YYYY-MM-DD，暂不支持
          height: 0,           // 身高，单位：cm，暂不支持
          weight: 0,           // 体重，单位：kg，暂不支持
          phone: "13800138000",
          email: "user@example.com",
          address: "内蒙古锡林郭勒盟",
          created_at: "2023-01-01 12:00:00"
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟创建问诊会话API
  if (options.url === '/api/consult/sessions' && options.method === 'POST') {
    setTimeout(() => {
      console.log('模拟创建问诊会话:', options.data);
      const sessionId = 'session_' + Date.now();
      // 存储会话信息到本地，方便后续模拟消息获取
      let consultSessions = uni.getStorageSync('mock_consult_sessions') || {};
      consultSessions[sessionId] = {
        id: sessionId,
        title: options.data.title || '健康咨询',
        description: options.data.description || options.data.symptoms || '',
        status: 'active',
        created_at: new Date().toISOString(),
        messages: []
      };
      uni.setStorageSync('mock_consult_sessions', consultSessions);
      
      const mockResponse = {
        code: 200,
        message: "创建会话成功",
        data: {
          sessionId: sessionId,
          title: options.data.title || '健康咨询',
          status: 'active',
          created_at: new Date().toISOString()
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 模拟发送问诊消息API
  if (options.url.includes('/api/consult/sessions/') && options.url.includes('/messages') && options.method === 'POST') {
    setTimeout(() => {
      console.log('模拟发送问诊消息:', options.data);
      // 从URL中提取会话ID
      const sessionId = options.url.split('/')[3];
      const messageId = 'msg_' + Date.now();
      const currentTime = new Date().toISOString();
      
      // 获取语言设置
      const language = options.data.language || 'chinese';
      
      // 获取当前会话
      let consultSessions = uni.getStorageSync('mock_consult_sessions') || {};
      let currentSession = consultSessions[sessionId] || {
        id: sessionId,
        title: '健康咨询',
        status: 'active',
        created_at: currentTime,
        messages: []
      };
      
      // 添加用户消息
      currentSession.messages.push({
        id: messageId,
        sender: 'user',
        contentType: options.data.content_type || 'text',
        content: options.data.content,
        createdAt: currentTime
      });
      
      // 生成医生/AI自动回复
      let replyContent = '';
      
      // 根据语言和内容生成不同的回复
      if (language === 'mongolian') {
        // 蒙古语回复
        if (options.data.content.includes('цусны даралт') || options.data.content.includes('ᠴᠢᠰᠤᠨ ᠳᠠᠷᠤᠯᠲᠠ') || options.data.content.includes('高血压')) {
          replyContent = 'Цусны даралт өндөр нь түгээмэл архаг өвчин юм. Танд хоолны дэглэм барих, давс хэрэглээгээ багасгах, зохистой дасгал хийх, шаардлагатай үед эмчийн зааврын дагуу даралт бууруулах эм хэрэглэхийг зөвлөж байна. Даралтаа тогтмол хянаж, эрүүл амьдралын хэв маягийг хадгалж байгаарай.';
        } else if (options.data.content.includes('толгой өвдөх') || options.data.content.includes('ᠲᠣᠯᠤᠭᠠᠢ ᠡᠪᠡᠳᠴᠦ') || options.data.content.includes('头痛')) {
          replyContent = 'Толгойн өвдөлт нь олон шалтгаанаас үүдэлтэй байж болно. Жишээлбэл: стресс, ядаргаа, ханиад эсвэл толгойн өвчин. Таныг амрах, хангалттай нойр авах, хэрэв хөнгөвчлөх бол чамархайгаа массаж хийхийг зөвлөж байна. Хэрэв шинж тэмдэг үргэлжилсэн эсвэл хүндэрсэн тохиолдолд эмнэлэгт яаралтай үзүүлнэ үү.';
        } else if (options.data.content.includes('ханиад') || options.data.content.includes('ᠬᠠᠨᠢᠶᠠᠳᠤ') || options.data.content.includes('感冒')) {
          replyContent = 'Ханиадны шинж тэмдэгт ханиалгах, нус гоожих, хоолой өвдөх зэрэг орно. Энэ нь вирусээр халдварлахаас үүдэлтэй. Танд амрах, усаа ихээр уух, өрөөндөө агаар сэлгэлтийг сайжруулахыг зөвлөж байна. Хэрэв шинж тэмдэг хүнд байвал эмчийн зөвлөгөөний дагуу ханиадны эм хэрэглэхийг бодолцож үзээрэй.';
        } else {
          replyContent = 'Сайн байна уу, Би AI эмнэлгийн туслагч. Би таны зөвлөгөөг хүлээн авлаа, таны шинж тэмдэгийг дэлгэрэнгүй тайлбарлана уу, энэ нь надад илүү нарийвчилсан зөвлөгөө өгөхөд тусална. Анхаарна уу, миний зөвлөгөө нь мэргэжлийн эмчийн оношлогоог орлохгүй.';
        }
      } else {
        // 中文回复
        if (options.data.content.includes('高血压')) {
          replyContent = '高血压是常见的慢性疾病，建议您控制饮食、减少盐分摄入、适量运动，必要时在医生指导下服用降压药物。请定期监测血压，保持良好生活习惯。';
        } else if (options.data.content.includes('头痛')) {
          replyContent = '头痛可能由多种原因引起，如压力、疲劳、感冒或偏头痛等。建议您先适当休息，保持充足睡眠，如果是轻微头痛可以尝试按摩太阳穴。如果症状持续或加重，请及时就医。';
        } else if (options.data.content.includes('感冒')) {
          replyContent = '感冒症状通常包括咳嗽、流鼻涕、喉咙痛等，是由病毒感染引起的。建议多休息、多喝水，保持室内空气流通。如果症状严重，可以考虑服用感冒药，但请遵循医嘱。';
        } else {
          replyContent = '您好，我是AI医疗助手。我已收到您的咨询，请详细描述您的症状，以便我能提供更准确的建议。请注意，我的建议不能替代专业医生的诊断。';
        }
      }
      
      // 添加AI回复消息
      const replyId = 'msg_reply_' + Date.now();
      currentSession.messages.push({
        id: replyId,
        sender: 'doctor',
        contentType: 'text',
        content: replyContent,
        createdAt: new Date(Date.now() + 500).toISOString() // 稍晚于用户消息
      });
      
      // 更新存储
      consultSessions[sessionId] = currentSession;
      uni.setStorageSync('mock_consult_sessions', consultSessions);
      
      // 返回消息发送成功的响应
      const mockResponse = {
        code: 200,
        message: "发送成功",
        data: {
          messageId: messageId,
          sessionId: sessionId,
          createdAt: currentTime,
          // 直接返回AI回复，使前端能立即显示
          content: replyContent,
          contentType: 'text',
          sender: 'doctor'
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 500);
    return;
  }
  
  // 模拟获取问诊消息记录API
  if (options.url.includes('/api/consult/sessions/') && options.url.includes('/messages') && options.method === 'GET') {
    setTimeout(() => {
      // 从URL中提取会话ID
      const sessionId = options.url.split('/')[3];
      
      // 获取当前会话
      let consultSessions = uni.getStorageSync('mock_consult_sessions') || {};
      let currentSession = consultSessions[sessionId];
      
      let messages = [];
      if (currentSession && currentSession.messages) {
        messages = currentSession.messages;
      }
      
      const mockResponse = {
        code: 200,
        message: "获取成功",
        data: {
          messages: messages
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 模拟获取问诊会话列表API
  if (options.url === '/api/consult/sessions' && options.method === 'GET') {
    setTimeout(() => {
      // 获取存储的所有会话
      let consultSessions = uni.getStorageSync('mock_consult_sessions') || {};
      let sessionsList = Object.values(consultSessions);
      
      const mockResponse = {
        code: 200,
        message: "获取成功",
        data: {
          list: sessionsList,
          total: sessionsList.length
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 模拟医疗快速问答API
  if (options.url === '/api/consult/medical-qa' && options.method === 'POST') {
    setTimeout(() => {
      console.log('模拟医疗快速问答:', options.data);
      
      // 获取查询内容和语言
      const query = options.data.query || '';
      const language = options.data.language || 'chinese';
      let response = '';
      
      // 根据语言选择不同的回复
      if (language === 'mongolian') {
        // 蒙古语回复
        if (query.includes('толгой өвдөх') || query.includes('ᠲᠣᠯᠤᠭᠠᠢ ᠡᠪᠡᠳᠴᠦ') || query.includes('头痛')) {
          response = 'Толгой өвдөх нь олон хүчин зүйлээс үүдэлтэй байж болно. Амрах, зөв дадал хэвшилтэй байхыг анхаарна уу. Хэрэв толгойн өвчин хүчтэй эсвэл удаан хугацаанд үргэлжилвэл эмч дээр очиж үзүүлэхийг зөвлөж байна.';
        } else if (query.includes('цусны даралт') || query.includes('ᠴᠢᠰᠤᠨ ᠳᠠᠷᠤᠯᠲᠠ') || query.includes('高血压')) {
          response = 'Цусны даралт ихтэй хүмүүс хоол тэжээлээ хянаж, давсны хэрэглээгээ багасгаж, ногоо жимс ихээр хэрэглэж, өөхтэй хоол багасгаж, тохирсон дасгал хийж, сэтгэл санааны хямралаас зайлсхийж, эм тогтмол уух, цусны даралтаа байнга хянаж байх хэрэгтэй.';
        } else if (query.includes('нойргүйдэл') || query.includes('ᠤᠨᠲᠠᠬᠤ ᠦᠭᠡᠢ') || query.includes('失眠')) {
          response = 'Нойргүйдлийг арилгах арга: тогтмол унтах цагтай байх, унтахын өмнө цахим хэрэгсэл ашиглахгүй байх, тухтай унтах орчин бүрдүүлэх, унтахын өмнө дулаан сүү уух эсвэл амралтын дасгал хийх, унтахын өмнө кофе зэрэг сэргээх ундаа уухгүй байх. Хэрэв нойргүйдэл хүнд бол эмчээс зөвлөгөө авна уу.';
        } else if (query.includes('ханиад') || query.includes('ᠬᠠᠨᠢᠶᠠᠳᠤ') || query.includes('感冒')) {
          response = 'Энгийн ханиад, ханиалга нь зарим ханиалга, цэр намдаах эм, жишээлбэл нийлмэл ханиалга, цэр ховхлох сироп зэргийг хэрэглэж болно. Мөн дулаан ус ихээр уух, өрөөний агаарыг сэлгэж байх, сайн амрах хэрэгтэй. Хэрэв шинж тэмдэг 7 хоногоос дээш үргэлжилсэн эсвэл халуурах зэрэг хүнд шинж тэмдэг илэрвэл эмчид хандана уу.';
        } else {
          response = 'Уучлаарай, таны асуултыг ойлгоход хүндрэлтэй байна. Илүү дэлгэрэнгүй мэдээлэл өгнө үү.';
        }
      } else {
        // 中文回复
        if (query.includes('头痛') || query.includes('頭痛')) {
          response = '头痛可能由多种因素引起，包括压力、疲劳、睡眠不足、眼睛疲劳、颈椎问题、感冒发热等。建议您注意休息，保持良好的作息习惯。如果头痛剧烈或持续时间长，建议及时就医检查。';
        } else if (query.includes('高血压') || query.includes('血压高')) {
          response = '高血压患者应注意控制饮食，减少盐分摄入，多吃蔬果，减少油腻食物，保持适量运动，避免精神紧张，按时服药，定期监测血压。如有不适请及时就医。';
        } else if (query.includes('失眠')) {
          response = '缓解失眠的方法包括：保持规律的作息时间，睡前避免使用电子设备，创造舒适的睡眠环境，睡前可以喝杯温牛奶或进行放松训练，避免睡前饮用咖啡等刺激性饮料。如失眠严重，建议咨询医生。';
        } else if (query.includes('感冒') || query.includes('咳嗽')) {
          response = '普通感冒咳嗽可考虑使用一些止咳祛痰药物如复方甘草片、急支糖浆等。同时多喝温水，保持室内空气流通，休息好。如果症状持续超过一周或伴有高烧，请及时就医。';
        } else {
          response = '很抱歉，我无法理解您的问题，请提供更多细节。';
        }
      }
      
      const mockResponse = {
        code: 200,
        message: "查询成功",
        data: {
          response: response,
          time_taken: 0.8
        },
        timestamp: Date.now()
      };
      
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 500);
    return;
  }
  
  // 模拟更新用户资料API
  if (options.url === '/api/user/profile' && options.method === 'PUT') {
    // 延迟200ms模拟网络请求
    setTimeout(() => {
      // 获取当前语言
      const language = uni.getStorageSync(CONFIG.STORAGE.LANGUAGE) || CONFIG.DEFAULTS.LANGUAGE;
      
      // 根据语言准备响应
      let message = "更新成功";
      if (language === 'mn_trad' || language === 'mn-cyrl') {
        message = "Амжилттай шинэчлэгдсэн";
      }
      
      console.log('模拟更新用户资料:', options.data);
      const mockResponse = {
        code: 200,
        message: message,
        data: {
          userId: 123,
          account: "testuser",
          nickname: options.data.nickname || "测试用户",
          avatar: options.data.avatar || CONFIG.DEFAULTS.AVATAR,
          gender: options.data.gender || "male",
          birthday: null,      // 暂不支持
          height: 0,           // 暂不支持
          weight: 0,           // 暂不支持
          phone: options.data.phone || "13800138000",
          email: options.data.email || "user@example.com",
          address: options.data.address || "内蒙古锡林郭勒盟",
          created_at: "2023-01-01 12:00:00"
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟系统设置API
  if (options.url === '/api/settings' && options.method === 'GET') {
    // 延迟200ms模拟网络请求
    setTimeout(() => {
      const mockResponse = {
        code: 200,
        message: 'success',
        data: {
          language: uni.getStorageSync(CONFIG.STORAGE.LANGUAGE) || CONFIG.DEFAULTS.LANGUAGE,
          notification: {
            push: true,
            email: false,
            sms: true
          },
          privacy: {
            shareHealthData: false,
            shareLocation: true
          },
          display: {
            theme: 'light',
            fontSize: 'medium'
          }
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 200);
    return;
  }
  
  // 模拟获取文章列表API
  if (options.url === '/articles' && options.method === 'GET') {
    setTimeout(() => {
      const mockResponse = {
        code: 200,
        message: "获取成功",
        data: {
          list: [
            {
              articleId: 1,
              title: '牧区常见传染病预防措施',
              titleMn: 'ᠪᠡᠯᠴᠢᠭᠡᠷ ᠤᠨ ᠪᠦᠰᠡ ᠳᠤ ᠲᠦᠭᠡᠮᠡᠯ ᠬᠠᠯᠳᠠᠪᠤᠷᠢᠲᠤ ᠡᠪᠡᠳᠴᠢᠨ ᠡᠴᠡ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ ᠠᠷᠭ᠎ᠠ ᠬᠡᠮᠵᠢᠶ᠎ᠡ',
              summary: '了解如何预防和应对牧区常见传染性疾病...',
              summaryMn: 'ᠪᠡᠯᠴᠢᠭᠡᠷ ᠤᠨ ᠪᠦᠰᠡ ᠳᠤ ᠲᠦᠭᠡᠮᠡᠯ ᠬᠠᠯᠳᠠᠪᠤᠷᠢᠲᠤ ᠡᠪᠡᠳᠴᠢᠨ ᠡᠴᠡ ᠬᠡᠷᠬᠢᠨ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ ᠲᠤᠬᠠᠢ...',
              coverImage: '/static/images/article1.jpg',
              publishTime: '2023-06-15',
              viewCount: 2458
            },
            {
              articleId: 2,
              title: '牧民饮食健康指南',
              titleMn: 'ᠮᠠᠯᠴᠢᠳ ᠤᠨ ᠬᠣᠭᠣᠯᠠ ᠲᠡᠵᠢᠭᠡᠯ ᠦᠨ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠵᠢᠷᠤᠮᠯᠠᠯ',
              summary: '合理的饮食结构对牧民健康的重要性...',
              summaryMn: 'ᠮᠠᠯᠴᠢᠳ ᠤᠨ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠳᠤ ᠵᠣᠬᠢᠰᠲᠠᠢ ᠬᠣᠭᠣᠯᠠᠨ ᠤ ᠳᠡᠭᠯᠡᠮ ᠦᠨ ᠠᠴᠢ ᠬᠣᠯᠪᠣᠭᠳᠠᠯ...',
              coverImage: '/static/images/article2.jpg',
              publishTime: '2023-06-10',
              viewCount: 1895
            }
          ],
          total: 2
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 模拟获取健康报告列表API
  if (options.url === '/health/reports' && options.method === 'GET') {
    setTimeout(() => {
      const mockResponse = {
        code: 200,
        message: "获取成功",
        data: {
          list: [
            {
              id: 1,
              title: '月度健康报告',
              date: '2023-06-01',
              status: 'normal'
            },
            {
              id: 2,
              title: '季度体检报告',
              date: '2023-04-15',
              status: 'abnormal'
            }
          ],
          total: 2
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 模拟获取健康建议API
  if (options.url === '/api/health/advice' && options.method === 'GET') {
    setTimeout(() => {
      const mockResponse = {
        code: 200,
        message: "获取成功",
        data: {
          adviceList: [
            {
              id: 1,
              title: '夏季饮食安全建议',
              content: '夏季高温，食物容易变质，建议减少生冷食物摄入...'
            },
            {
              id: 2,
              title: '牧区常见疾病预防',
              content: '牧区常见疾病包括关节炎、高原反应等...'
            }
          ]
        },
        timestamp: Date.now()
      };
      console.log(`模拟响应: ${options.url}`, mockResponse);
      resolve(mockResponse);
    }, 300);
    return;
  }
  
  // 对于其他API请求，返回空数据，避免卡住
  console.log(`未匹配到模拟接口，返回空数据: ${options.url}`);
  setTimeout(() => {
    resolve({
      code: 200,
      message: 'success',
      data: {},
      timestamp: Date.now()
    });
  }, 200);
}

// 处理未授权错误
function handleUnauthorized() {
  uni.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: 2000
  });
  // 清除已过期的token
  uni.removeStorageSync(CONFIG.STORAGE.TOKEN);
  uni.removeStorageSync(CONFIG.STORAGE.IS_LOGGED_IN);
  
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/login/index'
    });
  }, 2000);
}

// 处理HTTP错误
function handleHttpError(res) {
  console.error(`HTTP错误: ${res.statusCode}`, res);
  let message = '服务器异常，请稍后重试';
  
  switch (res.statusCode) {
    case 400:
      message = res.data.message || '请求参数错误';
      break;
    case 401:
      message = '未授权，请重新登录';
      handleUnauthorized();
      break;
    case 403:
      message = '没有权限进行此操作';
      break;
    case 404:
      message = '请求的资源不存在';
      break;
    case 500:
      message = '服务器内部错误，请稍后再试';
      break;
    default:
      message = res.data.message || '未知错误';
  }
  
  showErrorToast(message);
}

// 显示错误提示
function showErrorToast(message) {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
}

// 获取API基础URL
export const getBaseUrl = () => {
  return CONFIG.API.BASE_URL;
};

// 自动登录功能
export const autoLogin = () => {
  // 检查是否已登录
  const isLoggedIn = uni.getStorageSync(CONFIG.STORAGE.IS_LOGGED_IN);
  
  if (!isLoggedIn) {
    console.log('用户未登录，执行自动登录');
    // 创建测试账号信息
    const mockUserInfo = {
      userId: 'test_user_123',
      nickname: '测试用户',
      avatar: CONFIG.DEFAULTS.AVATAR
    };
    
    // 设置登录状态
    uni.setStorageSync(CONFIG.STORAGE.TOKEN, 'mock_token_auto_login');
    uni.setStorageSync(CONFIG.STORAGE.USER_ID, mockUserInfo.userId);
    uni.setStorageSync(CONFIG.STORAGE.IS_LOGGED_IN, true);
    uni.setStorageSync(CONFIG.STORAGE.USER_INFO, mockUserInfo);
    
    console.log('自动登录完成，已设置登录状态');
    
    return true;
  }
  
  console.log('用户已登录，无需自动登录');
  return false;
}; 