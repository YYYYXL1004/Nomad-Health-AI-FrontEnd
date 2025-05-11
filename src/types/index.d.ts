// 用户相关类型
export type TUserInfo = {
  userId: string;
  account: string;
  nickname: string;
  avatar: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  email?: string;
  address?: string;
};

// 登录响应类型
export type TLoginResponse = {
  token: string;
  userId: string;
  nickname: string;
  avatar: string;
  expiresIn: number;
};

// 注册请求类型
export type TRegisterData = {
  account: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
};

// API响应类型
export type TApiResponse<T = any> = {
  code: number;
  message: string;
  data: T;
  timestamp: number;
};

// 系统设置类型
export type TSystemSettings = {
  language: string;
  notification: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    shareHealthData: boolean;
    shareLocation: boolean;
  };
  display: {
    theme: string;
    fontSize: string;
  };
};

// 支持语言类型
export type TLanguage = {
  code: string;
  name: string;
  icon: string;
  type: 'horizontal' | 'vertical';
};

// 多语言文本类型
export type TMultiLangText = {
  zh: string;
  'mn-cyrl'?: string; // 西里尔蒙古文
  'mn-mong'?: string; // 传统蒙古文
};

// 健康报告类型
export type THealthReport = {
  reportId: string;
  userId: string;
  title: string;
  titleMn?: string;
  createTime: string;
  content: string;
  contentMn?: string;
  indicators: Array<THealthIndicator>;
  conclusion: string;
  conclusionMn?: string;
  advice: string;
  adviceMn?: string;
};

// 健康指标类型
export type THealthIndicator = {
  name: string;
  nameMn?: string;
  value: number;
  unit: string;
  normal: string;
  status: 'normal' | 'abnormal';
  reference?: {
    min?: number;
    max?: number;
    description?: string;
  };
};

// 文章类型
export type TArticle = {
  id: string;
  title: string;
  titleMn?: string;
  desc: string;
  descMn?: string;
  content: string;
  contentMn?: string;
  image: string;
  date: string;
  views: number;
  category: string;
  author: string;
  tags?: string[];
};

// 问诊会话类型
export type TConsultSession = {
  sessionId: string;
  userId: string;
  doctorId?: string;
  symptoms: string;
  symptomsMn?: string;
  duration: string;
  status: 'waiting' | 'processing' | 'completed' | 'cancelled';
  createTime: string;
  updateTime: string;
  doctorInfo?: TDoctorInfo;
};

// 医生信息类型
export type TDoctorInfo = {
  doctorId: string;
  name: string;
  nameMn?: string;
  avatar: string;
  department: string;
  departmentMn?: string;
  title: string;
  titleMn?: string;
  specialty?: string;
  specialtyMn?: string;
};

// 问诊消息类型
export type TConsultMessage = {
  messageId: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'doctor' | 'system';
  content: string;
  contentMn?: string;
  contentType: 'text' | 'image' | 'voice' | 'file';
  createTime: string;
  status: 'sending' | 'sent' | 'received' | 'failed';
  duration?: number; // 语音消息的时长，单位秒
  fileSize?: number; // 文件大小，单位字节
  fileName?: string; // 文件名
};

// 病史记录类型
export type TMedicalHistory = {
  id: string;
  userId: string;
  description: string;
  descriptionMn?: string;
  hospital: string;
  hospitalMn?: string;
  department: string;
  departmentMn?: string;
  doctor: string;
  doctorMn?: string;
  medications: string;
  medicationsMn?: string;
  date: string;
  attachments?: string[];
};

// 过敏记录类型
export type TAllergy = {
  id: string;
  userId: string;
  allergen: string;
  allergenMn?: string;
  reactions: string;
  reactionsMn?: string;
  severity: 'mild' | 'moderate' | 'severe';
  discoverTime: string;
  measures: string;
  measuresMn?: string;
  notes?: string;
  notesMn?: string;
}; 