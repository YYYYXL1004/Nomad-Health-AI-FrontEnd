// 项目配置
const CONFIG = {
  // API相关配置
  API: {
    // API基础URL
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api.chileyunzhen.com',
    // 请求超时时间（毫秒）
    TIMEOUT: 30000,
    // 是否使用模拟数据
    USE_MOCK: false,
    // 千问医疗API配置
    QWEN_API_URL: 'https://api.chileyunzhen.com',
    // 是否使用模拟医疗模型
    USE_MOCK_MEDICAL_MODEL: false,
    RETRY_COUNT: 3, // 请求失败重试次数
    RETRY_DELAY: 1000, // 重试间隔时间(ms)
  },
  
  // 存储相关配置
  STORAGE: {
    // Token存储键名
    TOKEN: 'token',
    USER_ID: 'userId',
    IS_LOGGED_IN: 'isLoggedIn',
    // 用户信息存储键名
    USER_INFO: 'userInfo',
    // 语言设置存储键名
    LANGUAGE: 'language',
    SETTINGS: 'settings',
    HEALTH_DATA: 'healthData',
    CACHE_EXPIRES: 'cacheExpires',
  },
  
  // 默认参数
  DEFAULTS: {
    // 默认语言
    LANGUAGE: 'chinese',
    PAGE_SIZE: 10, // 列表默认分页大小
    // 默认头像
    AVATAR: '/static/images/default-avatar.png',
    CACHE_DURATION: 86400, // 缓存有效期(秒)
  },
  
  // 支持的语言
  LANGUAGES: [
    { code: 'zh', name: '中文', icon: '🇨🇳', type: 'horizontal' },
    { code: 'mn-cyrl', name: 'Монгол', icon: '🇲🇳', type: 'horizontal' }, // 西里尔蒙古语
    { code: 'mn_trad', name: 'ᠮᠣᠩᠭᠣᠯ', icon: '🇲🇳', type: 'vertical' }, // 传统蒙古文
  ],
  
  // 垂直文本设置 (传统蒙古文)
  VERTICAL_TEXT: {
    WRITING_MODE: 'vertical-lr', // CSS书写模式
    TEXT_ORIENTATION: 'sideways-right', // 文本方向
    DIRECTION: 'rtl', // 阅读方向
  },
  
  // 缓存配置
  CACHE: {
    ENABLED: true,
    MAX_AGE: 3600, // 缓存最大存活时间(秒)
  },
  
  // 日志级别
  LOG_LEVEL: {
    PROD: 'error', // 生产环境只记录错误
    DEV: 'debug', // 开发环境记录所有级别
  },
};

export default CONFIG; 