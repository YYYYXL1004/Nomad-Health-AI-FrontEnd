// 国际化配置
const messages = {
  // 中文
  zh: {
    // 通用
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      back: '返回',
      loading: '加载中...',
      success: '操作成功',
      fail: '操作失败',
      networkError: '网络错误，请稍后再试',
      retry: '重试',
      loadingMore: '加载更多...',
      noMoreData: '已经到底啦',
      submit: '提交'
    },
    // 标签页
    tabBar: {
      home: '主页',
      consult: '问诊',
      my: '我的'
    },
    // 登录注册
    auth: {
      login: '登录',
      register: '注册',
      account: '账号',
      password: '密码',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码',
      loginNow: '立即登录',
      registerNow: '立即注册',
      noAccount: '没有账号？',
      hasAccount: '已有账号？',
      loginSuccess: '登录成功',
      registerSuccess: '注册成功',
      logout: '退出登录',
      logoutConfirm: '确定要退出登录吗？',
      logoutSuccess: '已退出登录'
    },
    // 主页
    home: {
      title: '主页',
      healthReport: '健康报告',
      healthAdvice: '健康建议',
      broadcast: '健康广播'
    },
    // 问诊
    consult: {
      title: '在线问诊',
      emptyMessage: '暂无消息，请输入您的问题',
      welcomeTitle: '欢迎使用在线问诊',
      welcomeDesc: '请输入您的健康问题，我们将为您提供专业的医疗建议',
      commonQuestions: '常见问题',
      inputPlaceholder: '请输入您的问题...',
      sendBtn: '发送',
      // 快速咨询相关文本 - 新增
      quickConsult: '快速咨询',
      quickConsultTitle: '快速医疗咨询',
      quickConsultPlaceholder: '请输入您的医疗问题，无需创建会话...',
      quickConsultTip: '快速咨询不会创建持久的会话记录，如需保存记录请使用正常问诊',
      createSessionTip: '是否将此次咨询保存为会话？',
      createSession: '创建会话',
      submitting: '提交中...',
      typing: '正在输入...',
      sendPhoto: '拍照',
      voiceInput: '语音输入',
      processing: '正在为您分析...',
      doctorProcessing: '医生正在查看您的问题，请稍候...',
      recordingTip: '正在录音...',
      recordingStart: '按住开始录音',
      recordingStop: '松开结束',
      recordingBtn: '按住说话',
      convertToText: '转为文字',
      imageReceived: '您的图片已收到，正在分析...',
      quickConsultMessage: '快速咨询'
    },
    // 我的
    my: {
      title: '我的',
      editProfile: '编辑资料',
      healthRecords: '健康档案',
      consultHistory: '问诊记录',
      prescriptions: '处方管理',
      settings: '设置',
      guest: '访客',
      healthServices: '健康服务',
      healthRecordsDesc: '查看您的健康数据与病史记录',
      consultationRecordsDesc: '查看历史问诊与医生交流记录',
      prescriptionsDesc: '管理处方与用药提醒',
      appSettings: '应用设置',
      version: '版本',
      logout: '退出登录',
      viewMoreInfo: '查看更多信息',
      collapseInfo: '收起详情',
      phoneLabel: '手机号：',
      genderLabel: '性别：',
      birthdayLabel: '生日：',
      heightLabel: '身高：',
      weightLabel: '体重：',
      emailLabel: '邮箱：',
      addressLabel: '地址：',
      registerTimeLabel: '注册时间：',
      male: '男',
      female: '女',
      unset: '未设置'
    },
    // 健康档案
    healthRecords: {
      title: '健康档案',
      basicInfo: '基本信息',
      healthIndicators: '健康指标',
      medicalHistory: '病史记录',
      allergies: '过敏史',
      name: '姓名',
      gender: '性别',
      age: '年龄',
      height: '身高',
      weight: '体重',
      bloodType: '血型',
      bloodPressure: '血压',
      bloodSugar: '血糖',
      heartRate: '心率',
      emptyMedical: '暂无病史记录',
      emptyAllergy: '暂无过敏记录',
      add: '添加'
    },
    // 健康数据详情
    healthDetail: {
      currentValue: '当前值',
      historyRecord: '历史记录',
      referenceRange: '参考范围',
      updateData: '更新数据',
      viewTrend: '查看趋势图',
      bpReference: '正常范围：收缩压90-140mmHg，舒张压60-90mmHg',
      bsReference: '空腹血糖正常范围：3.9-6.1mmol/L',
      hrReference: '成人静息心率正常范围：60-100次/分',
      weightReference: '请根据BMI指数判断体重是否合理，BMI=体重(kg)/身高(m)²，正常范围为18.5-24.9',
      heightReference: '成年人身高取决于遗传和环境因素，无特定参考范围',
      bloodTypeReference: 'ABO血型系统包括A型、B型、AB型和O型',
      defaultReference: '无特定参考范围'
    },
    // 病史详情
    medicalDetail: {
      title: '病史详情',
      description: '详细描述',
      hospital: '就诊医院',
      department: '就诊科室',
      doctor: '接诊医生',
      medications: '处方药物',
      editInfo: '编辑信息',
      deleteRecord: '删除记录',
      deleteConfirm: '是否确认删除此病史记录？删除后无法恢复。',
      deleteSuccess: '删除成功'
    },
    // 过敏详情
    allergyDetail: {
      title: '过敏详情',
      reactions: '过敏反应',
      severity: '反应程度',
      discoverTime: '发现时间',
      measures: '应对措施',
      notes: '备注',
      mild: '轻度',
      moderate: '中度',
      severe: '重度',
      editInfo: '编辑信息',
      deleteRecord: '删除记录',
      deleteConfirm: '是否确认删除此过敏记录？删除后无法恢复。',
      deleteSuccess: '删除成功'
    },
    // 设置
    settings: {
      title: '设置',
      accountSecurity: '账号与安全',
      changePassword: '修改密码',
      changeMobile: '修改手机号',
      notifications: '消息通知',
      pushNotification: '推送通知',
      soundNotification: '声音通知',
      generalSettings: '通用设置',
      language: '语言',
      clearCache: '清除缓存',
      aboutUs: '关于我们',
      privacyPolicy: '隐私政策',
      userAgreement: '用户协议',
      aboutApp: '关于应用',
      selectLanguage: '选择语言',
      chinese: '中文',
      mongolian: '传统蒙古文',
      languageSwitched: '语言已切换',
      clearCacheConfirm: '确定要清除缓存吗？',
      clearCacheSuccess: '缓存已清除'
    },
    // 编辑资料页面
    editProfile: {
      changeAvatar: '点击更换头像',
      nickname: '昵称',
      nicknamePlaceholder: '请输入昵称',
      gender: '性别',
      male: '男',
      female: '女',
      birthday: '出生日期',
      selectDate: '请选择日期',
      phone: '手机号',
      phonePlaceholder: '请输入手机号',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      address: '地址',
      addressPlaceholder: '请输入详细地址'
    },
    // 文章
    articles: {
      title: '健康文章',
      detail: '文章详情',
      noArticles: '暂无文章',
      relatedArticles: '相关文章',
      readMore: '阅读更多',
      shareArticle: '分享文章',
      likes: '点赞',
      comments: '评论',
      category: '分类',
      popular: '热门文章',
      latest: '最新文章',
      viewMore: '查看更多'
    }
  },
  // 传统蒙古文 
  mn_trad: {
    // 通用
    common: {
      confirm: 'ᠪᠠᠲᠤᠯᠠᠬᠤ',
      cancel: 'ᠴᠤᠴᠠᠯᠠᠬᠤ',
      save: 'ᠬᠠᠳᠠᠭᠠᠯᠠᠬᠤ',
      edit: 'ᠵᠠᠰᠠᠬᠤ',
      delete: 'ᠤᠰᠲᠤᠭᠠᠬᠤ',
      back: 'ᠪᠤᠴᠠᠬᠤ',
      loading: 'ᠠᠴᠠᠭᠠᠯᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ...',
      success: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ',
      fail: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠪᠣᠯᠤᠭᠰᠠᠨ ᠦᠭᠡᠢ',
      networkError: 'ᠰᠦᠯᠵᠢᠶᠡᠨ ᠦ ᠠᠯᠳᠠᠭ᠎ᠠ᠂ ᠳᠠᠷᠠᠭ᠎ᠠ ᠳᠠᠬᠢᠨ ᠣᠷᠣᠯᠳᠤᠨ᠎ᠠ ᠤᠤ',
      retry: 'ᠳᠠᠬᠢᠨ ᠣᠷᠣᠯᠳᠤᠬᠤ',
      loadingMore: 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠠᠴᠠᠭᠠᠯᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ...',
      noMoreData: 'ᠪᠦᠬᠦ ᠦᠭᠡᠭᠳᠡᠯ ᠢ ᠠᠴᠠᠭᠠᠯᠯᠠᠪᠠ',
      submit: 'ᠪᠠᠶᠢᠨ᠎ᠠ'
    },
    // 标签页
    tabBar: {
      home: 'ᠨᠢᠭᠤᠷ',
      consult: 'ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ',
      my: 'ᠮᠢᠨᠤ'
    },
    // 登录注册
    auth: {
      login: 'ᠨᠡᠪᠲᠡᠷᠡᠬᠦ',
      register: 'ᠪᠦᠷᠢᠳᠬᠡᠬᠦᠯᠬᠦ',
      account: 'ᠳᠠᠩᠰᠠ',
      password: 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ',
      confirmPassword: 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠪᠠᠲᠤᠯᠠᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      forgotPassword: 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠪᠡᠨ ᠮᠠᠷᠲᠠᠭᠰᠠᠨ',
      loginNow: 'ᠣᠳᠣᠭ᠎ᠠ ᠨᠡᠪᠲᠡᠷᠡᠬᠦ',
      registerNow: 'ᠣᠳᠣᠭ᠎ᠠ ᠪᠦᠷᠢᠳᠬᠡᠬᠦᠯᠬᠦ',
      noAccount: 'ᠪᠦᠷᠢᠳᠬᠡᠯ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ ᠶᠤᠤ?',
      hasAccount: 'ᠪᠦᠷᠢᠳᠬᠡᠯᠲᠡᠢ ᠶᠤᠤ?',
      loginSuccess: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠨᠡᠪᠲᠡᠷᠡᠯᠡᠭᠡ',
      registerSuccess: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠪᠦᠷᠢᠳᠬᠡᠭᠳᠡᠯᠡᠭᠡ',
      logout: 'ᠭᠠᠷᠬᠤ',
      logoutConfirm: 'ᠲᠠ ᠭᠠᠷᠬᠤᠳᠠᠭᠠᠨ ᠢᠲᠡᠭᠡᠯᠲᠡᠢ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ?',
      logoutSuccess: 'ᠭᠠᠷᠰᠠᠨ'
    },
    // 主页
    home: {
      title: 'ᠨᠢᠭᠤᠷ',
      healthReport: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠲᠠᠢᠯᠠᠨ',
      healthAdvice: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠵᠥᠪᠯᠡᠭᠡ',
      broadcast: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠮᠡᠳᠡᠭᠡ'
    },
    // 问诊
    consult: {
      title: 'ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ',
      emptyMessage: 'ᠮᠡᠰᠰᠡᠵᠢ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ, ᠠᠰᠠᠭᠤᠯᠲᠠ ᠠᠰᠠᠭᠤᠵᠤ ᠡᠬᠢᠯᠡᠨ᠎ᠡ ᠦᠦ',
      inputPlaceholder: 'ᠠᠰᠠᠭᠤᠯᠲᠠ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      sendPhoto: 'ᠵᠢᠷᠤᠭ',
      voiceInput: 'ᠳᠠᠭᠤᠲᠤ',
      processing: 'ᠲᠠᠨ ᠦ ᠠᠰᠠᠭᠤᠯᠲᠠ ᠶᠢ ᠰᠢᠨᠵᠢᠯᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...',
      doctorProcessing: 'ᠡᠮᠴᠢ ᠲᠠᠨ ᠦ ᠠᠰᠠᠭᠤᠯᠲᠠ ᠶᠢ ᠬᠢᠨᠠᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ, ᠲᠦᠷ ᠬᠦᠯᠢᠶᠡᠨ᠎ᠡ ᠦᠦ...',
      recordingTip: 'ᠪᠢᠴᠢᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...',
      recordingStart: 'ᠪᠢᠴᠢᠵᠦ ᠡᠬᠢᠯᠡᠬᠦ ᠶᠢᠨ ᠲᠤᠯᠠ ᠳᠠᠷᠤᠨ᠎ᠠ ᠤᠤ',
      recordingStop: 'ᠳᠠᠭᠤᠰᠭᠠᠬᠤ ᠶᠢᠨ ᠲᠤᠯᠠ ᠰᠤᠯᠯᠠᠨ᠎ᠠ ᠤᠤ',
      recordingBtn: 'ᠶᠠᠷᠢᠬᠤ ᠶᠢᠨ ᠲᠤᠯᠠ ᠳᠠᠷᠤᠨ᠎ᠠ ᠤᠤ',
      convertToText: 'ᠲᠡᠺᠰᠲ ᠪᠣᠯᠭᠠᠬᠤ',
      imageReceived: 'ᠲᠠᠨ ᠦ ᠵᠢᠷᠤᠭ ᠢ ᠬᠦᠯᠢᠶᠡᠨ ᠠᠪᠯᠠᠭ᠎ᠠ, ᠰᠢᠨᠵᠢᠯᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...',
      welcomeTitle: 'ᠣᠨᠯᠠᠢᠨ ᠵᠦᠪᠯᠡᠯᠭᠡ ᠳᠤ ᠲᠠᠪᠲᠠᠢ ᠮᠣᠷᠢᠯᠠᠨᠠ',
      welcomeDesc: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠠᠰᠠᠭᠤᠳᠠᠯ ᠢᠶᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨᠠ ᠤᠤ, ᠪᠢᠳᠡ ᠲᠠᠨ ᠳᠤ ᠮᠡᠷᠭᠡᠵᠢᠯ ᠦᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ ᠥᠭᠭᠦᠨᠡ',
      commonQuestions: 'ᠲᠦᠭᠡᠮᠡᠯ ᠠᠰᠠᠭᠤᠯᠲᠠ',
      sendBtn: 'ᠢᠯᠡᠭᠡᠬᠦ',
      typing: 'ᠪᠢᠴᠢᠵᠦ ᠪᠠᠶᠢᠨᠠ...',
      quickConsult: 'ᠲᠦᠷᠭᠡᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ',
      quickConsultTitle: 'ᠲᠦᠷᠭᠡᠨ ᠡᠮᠨᠡᠯᠭᠡ ᠶᠢᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ',
      quickConsultPlaceholder: 'ᠡᠮᠨᠡᠯᠭᠡ ᠶᠢᠨ ᠠᠰᠠᠭᠤᠳᠠᠯ ᠢᠶᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨᠠ ᠤᠤ, ᠶᠠᠷᠢᠶᠠᠨ ᠤ ᠦᠰᠦᠭ ᠦᠨ ᠬᠡᠷᠡᠭᠴᠡᠭᠡ ᠦᠭᠡᠢ...',
      quickConsultTip: 'ᠲᠦᠷᠭᠡᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ ᠨᠢ ᠪᠠᠶᠢᠩᠭᠤ ᠶᠢᠨ ᠶᠠᠷᠢᠯᠴᠠᠭᠠ ᠦᠭᠡᠢ ᠪᠤᠯᠤᠨᠠ, ᠲᠡᠮᠳᠡᠭᠯᠡᠯ ᠢᠶᠡᠨ ᠬᠠᠳᠠᠭᠠᠯᠠᠬᠤ ᠪᠣᠯ ᠡᠩ ᠦᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ ᠬᠡᠷᠡᠭᠯᠡᠨᠡ ᠦᠦ',
      createSessionTip: 'ᠡᠨᠡ ᠵᠥᠪᠯᠡᠯᠭᠡ ᠶᠢ ᠶᠠᠷᠢᠶᠠᠨ ᠤ ᠦᠰᠦᠭ ᠪᠣᠯᠭᠠᠨ ᠬᠠᠳᠠᠭᠠᠯᠠᠬᠤ ᠤᠤ?',
      createSession: 'ᠶᠠᠷᠢᠶᠠᠨ ᠤ ᠦᠰᠦᠭ ᠦᠭᠡᠢ ᠪᠣᠯᠭᠠᠬᠤ',
      submitting: 'ᠢᠯᠡᠭᠡᠵᠦ ᠪᠠᠶᠢᠨᠠ...',
      quickConsultMessage: 'ᠲᠦᠷᠭᠡᠨ ᠵᠥᠪᠯᠡᠯᠭᠡ'
    },
    // 我的
    my: {
      title: 'ᠮᠢᠨᠤ',
      editProfile: 'ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠵᠠᠰᠠᠬᠤ',
      healthRecords: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠳᠠᠩᠰᠠ',
      consultHistory: 'ᠠᠰᠠᠭᠤᠯᠭ᠎ᠠ ᠶᠢᠨ ᠲᠡᠮᠳᠡᠭᠯᠡᠯ',
      prescriptions: 'ᠵᠣᠷ ᠡᠮ ᠦᠨ ᠬᠠᠮᠢᠶᠠᠷᠤᠯᠲᠠ',
      settings: 'ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠭ᠎ᠠ',
      guest: 'ᠵᠣᠴᠢᠨ',
      healthServices: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡ',
      healthRecordsDesc: 'ᠲᠠᠨ ᠦ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠪᠠ ᠡᠪᠡᠳᠴᠢᠨ ᠦ ᠲᠡᠦᠬᠡ ᠶᠢ ᠦᠵᠡᠬᠦ',
      consultationRecordsDesc: 'ᠲᠡᠦᠬᠡᠨ ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ ᠪᠠ ᠡᠮᠴᠢ ᠲᠡᠶ ᠬᠠᠷᠢᠯᠴᠠᠭᠰᠠᠨ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠢ ᠦᠵᠡᠬᠦ',
      prescriptionsDesc: 'ᠵᠣᠷ ᠡᠮ ᠪᠠ ᠡᠮ ᠦᠨ ᠰᠠᠨᠠᠭᠤᠯᠭ᠎ᠠ ᠶᠢ ᠬᠠᠮᠢᠶᠠᠷᠬᠤ',
      appSettings: 'ᠠᠫᠫ ᠤᠨ ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠭ᠎ᠠ',
      version: 'ᠬᠤᠪᠢᠯᠪᠤᠷᠢ',
      logout: 'ᠭᠠᠷᠬᠤ',
      viewMoreInfo: 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠦᠵᠡᠬᠦ',
      collapseInfo: 'ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠬᠤᠷᠠᠭᠠᠬᠤ',
      phoneLabel: 'ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ᠄',
      genderLabel: 'ᠬᠦᠢᠰᠦ᠄',
      birthdayLabel: 'ᠲᠥᠷᠥᠭᠰᠡᠨ ᠡᠳᠦᠷ᠄',
      heightLabel: 'ᠥᠨᠳᠥᠷ᠄',
      weightLabel: 'ᠬᠦᠨᠳᠦ᠄',
      emailLabel: 'ᠢᠮᠧᠯ᠄',
      addressLabel: 'ᠬᠠᠶᠠᠭ᠄',
      registerTimeLabel: 'ᠪᠦᠷᠢᠳᠬᠡᠯ ᠦᠨ ᠴᠠᠭ᠄',
      male: 'ᠡᠷ᠎ᠡ',
      female: 'ᠡᠮ᠎ᠡ',
      unset: 'ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠤᠭᠳᠠᠭᠠᠳᠦᠢ'
    },
    // 健康档案
    healthRecords: {
      title: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠪᠦᠷᠢᠳᠬᠡᠯ',
      basicInfo: 'ᠦᠨᠳᠦᠰᠦᠨ ᠮᠡᠳᠡᠭᠡᠯᠡᠯ',
      healthIndicators: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠦᠵᠡᠭᠦᠯᠦᠯᠲᠡ ᠳᠤ',
      medicalHistory: 'ᠡᠪᠡᠳᠴᠢᠨ ᠦ ᠲᠡᠦᠬᠡ',
      allergies: 'ᠬᠠᠷᠰᠢᠯ ᠤᠨ ᠲᠡᠦᠬᠡ',
      name: 'ᠨᠡᠷ᠎ᠡ',
      gender: 'ᠬᠦᠢᠰᠦ',
      age: 'ᠨᠠᠰᠤ',
      height: 'ᠥᠨᠳᠦᠷ',
      weight: 'ᠵᠢᠨ',
      bloodType: 'ᠴᠤᠰᠤᠨ ᠤ ᠪᠦᠯᠦᠭ',
      bloodPressure: 'ᠴᠤᠰᠤᠨ ᠤ ᠳᠠᠷᠤᠯᠲᠠ',
      bloodSugar: 'ᠴᠤᠰᠤᠨ ᠤ ᠰᠠᠬᠠᠷ',
      heartRate: 'ᠵᠢᠷᠦᠬᠡᠨ ᠴᠣᠬᠢᠯᠲᠠ',
      emptyMedical: 'ᠡᠪᠡᠳᠴᠢᠨ ᠦ ᠲᠡᠦᠬᠡ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ',
      emptyAllergy: 'ᠬᠠᠷᠰᠢᠯ ᠤᠨ ᠲᠡᠦᠬᠡ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ',
      add: 'ᠨᠡᠮᠡᠬᠦ'
    },
    // 健康数据详情
    healthDetail: {
      currentValue: 'ᠣᠳᠣᠭᠠᠬᠢ ᠤᠲᠭ᠎ᠠ',
      historyRecord: 'ᠲᠡᠦᠬᠡᠨ ᠪᠢᠴᠯᠡᠭ',
      referenceRange: 'ᠯᠠᠪᠯᠠᠬᠤ ᠬᠢᠵᠠᠭᠠᠷ',
      updateData: 'ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠰᠢᠨᠡᠴᠢᠯᠡᠬᠦ',
      viewTrend: 'ᠴᠢᠭ ᠬᠠᠨᠳᠤᠯᠭ᠎ᠠ ᠶᠢ ᠦᠵᠡᠬᠦ',
      bpReference: 'ᠬᠡᠪᠢᠶᠡᠨ ᠬᠢᠵᠠᠭᠠᠷ: ᠰᠢᠰᠲ᠋ᠣᠯᠢᠺ 90-140mmHg, ᠳᠢᠶᠠᠰᠲ᠋ᠣᠯᠢᠺ 60-90mmHg',
      bsReference: 'ᠥᠯᠥᠨ ᠦᠶ᠎ᠡ ᠶᠢᠨ ᠴᠤᠰᠤᠨ ᠤ ᠰᠠᠬᠠᠷ ᠤᠨ ᠬᠡᠪᠢᠶᠡᠨ ᠬᠢᠵᠠᠭᠠᠷ: 3.9-6.1mmol/L',
      hrReference: 'ᠨᠠᠰᠤᠨ ᠳᠤ ᠬᠦᠷᠡᠭᠴᠢᠳ ᠦᠨ ᠠᠮᠷᠠᠬᠤ ᠵᠢᠷᠦᠬᠡᠨ ᠴᠣᠬᠢᠯᠲᠠ ᠶᠢᠨ ᠬᠡᠪᠢᠶᠡᠨ ᠬᠢᠵᠠᠭᠠᠷ: 60-100 ᠤᠳᠠᠭ᠎ᠠ/ᠮᠢᠨ',
      weightReference: 'BMI ᠢᠨᠳᠧᠺᠰᠡᠭᠡᠷ ᠵᠢᠩᠭᠡᠨ ᠦᠨᠡᠯᠡᠨ᠎ᠡ ᠦᠦ, BMI=ᠵᠢᠩ(ᠺᠭ)/ᠥᠨᠳᠦᠷ(ᠮ)², ᠬᠡᠪᠢᠶᠡᠨ ᠬᠢᠵᠠᠭᠠᠷ 18.5-24.9',
      heightReference: 'ᠨᠠᠰᠤᠨ ᠳᠤ ᠬᠦᠷᠡᠭᠴᠢᠳ ᠦᠨ ᠥᠨᠳᠦᠷ ᠤᠳᠠᠮᠰᠢᠯ ᠪᠣᠯᠤᠨ ᠣᠷᠴᠢᠨ ᠤ ᠬᠦᠴᠦᠨ ᠵᠦᠢᠯ ᠡᠴᠡ ᠬᠠᠮᠠᠭᠠᠷᠬᠤ, ᠲᠣᠳᠣᠷᠬᠠᠢ ᠯᠠᠪᠯᠠᠬᠤ ᠬᠢᠵᠠᠭᠠᠷ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ',
      bloodTypeReference: 'ABO ᠴᠤᠰᠤᠨ ᠤ ᠪᠦᠯᠦᠭ A, B, AB ᠪᠣᠯᠤᠨ O ᠲᠥᠷᠯᠦᠭᠦᠳ ᠢ ᠪᠠᠭᠲᠠᠭᠠᠳᠠᠭ',
      defaultReference: 'ᠲᠣᠳᠣᠷᠬᠠᠢ ᠯᠠᠪᠯᠠᠬᠤ ᠬᠢᠵᠠᠭᠠᠷ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ'
    },
    // 病史详情
    medicalDetail: {
      title: 'ᠡᠪᠡᠳᠴᠢᠨ ᠦ ᠲᠡᠦᠬᠡ ᠶᠢᠨ ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ',
      description: 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠲᠠᠢᠯᠪᠤᠷᠢ',
      hospital: 'ᠡᠮᠨᠡᠯᠭᠡ',
      department: 'ᠲᠠᠰᠠᠭ',
      doctor: 'ᠡᠮᠴᠢ',
      medications: 'ᠡᠮ ᠦᠨ ᠵᠣᠷ',
      editInfo: 'ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠵᠠᠰᠠᠬᠤ',
      deleteRecord: 'ᠪᠢᠴᠯᠡᠭ ᠤᠰᠲᠤᠭᠠᠬᠤ',
      deleteConfirm: 'ᠡᠨᠡ ᠡᠪᠡᠳᠴᠢᠨ ᠦ ᠲᠡᠦᠬᠡ ᠶᠢ ᠤᠰᠲᠤᠭᠠᠬᠤ ᠳᠠᠭᠠᠨ ᠢᠲᠡᠭᠡᠯᠲᠡᠢ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ? ᠤᠰᠲᠤᠭᠠᠰᠤᠨ ᠤ ᠳᠠᠷᠠᠭ᠎ᠠ ᠰᠡᠷᠭᠡᠭᠡᠬᠦ ᠪᠣᠯᠤᠮᠵᠢᠭᠦᠢ.',
      deleteSuccess: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠤᠰᠲᠤᠭᠠᠭᠳᠠᠯᠠᠭ᠎ᠠ'
    },
    // 过敏详情
    allergyDetail: {
      title: 'ᠬᠠᠷᠰᠢᠯ ᠤᠨ ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ',
      reactions: 'ᠬᠠᠷᠰᠢᠯ ᠤᠨ ᠬᠠᠷᠢᠭᠤ ᠤᠷᠪᠠᠯ',
      severity: 'ᠬᠦᠨᠳᠦᠷᠡᠯ ᠦᠨ ᠵᠡᠷᠭᠡ',
      discoverTime: 'ᠢᠯᠡᠷᠡᠭᠦᠯᠦᠭᠰᠡᠨ ᠣᠭᠨᠣᠭ᠎ᠠ',
      measures: 'ᠠᠷᠭ᠎ᠠ ᠬᠡᠮᠵᠢᠶ᠎ᠡ',
      notes: 'ᠲᠡᠮᠳᠡᠭᠯᠡᠯ',
      mild: 'ᠬᠥᠩᠭᠡᠨ',
      moderate: 'ᠳᠤᠮᠳᠠ',
      severe: 'ᠬᠦᠨᠳᠦ',
      editInfo: 'ᠮᠡᠳᠡᠭᠡᠯᠡᠯ ᠵᠠᠰᠠᠬᠤ',
      deleteRecord: 'ᠪᠢᠴᠯᠡᠭ ᠤᠰᠲᠤᠭᠠᠬᠤ',
      deleteConfirm: 'ᠡᠨᠡ ᠬᠠᠷᠰᠢᠯ ᠤᠨ ᠪᠢᠴᠯᠡᠭ ᠢ ᠤᠰᠲᠤᠭᠠᠬᠤ ᠳᠠᠭᠠᠨ ᠢᠲᠡᠭᠡᠯᠲᠡᠢ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ? ᠤᠰᠲᠤᠭᠠᠰᠤᠨ ᠤ ᠳᠠᠷᠠᠭ᠎ᠠ ᠰᠡᠷᠭᠡᠭᠡᠬᠦ ᠪᠣᠯᠤᠮᠵᠢᠭᠦᠢ.',
      deleteSuccess: 'ᠠᠮᠵᠢᠯᠲᠠᠲᠠᠢ ᠤᠰᠲᠤᠭᠠᠭᠳᠠᠯᠠᠭ᠎ᠠ'
    },
    // 设置
    settings: {
      title: 'ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠭ᠎ᠠ',
      accountSecurity: 'ᠳᠠᠩᠰᠠ ᠪᠠ ᠠᠶᠤᠯᠭᠦᠢ ᠪᠠᠶᠢᠳᠠᠯ',
      changePassword: 'ᠨᠢᠭᠤᠴᠠ ᠦᠭᠡ ᠰᠣᠯᠢᠬᠤ',
      changeMobile: 'ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ ᠰᠣᠯᠢᠬᠤ',
      notifications: 'ᠮᠡᠳᠡᠭᠳᠡᠯ',
      pushNotification: 'Push ᠮᠡᠳᠡᠭᠳᠡᠯ',
      soundNotification: 'ᠳᠠᠭᠤᠲᠤ ᠮᠡᠳᠡᠭᠳᠡᠯ',
      generalSettings: 'ᠶᠡᠷᠦᠩᠬᠡᠢ ᠲᠣᠬᠢᠷᠠᠭᠤᠯᠭ᠎ᠠ',
      language: 'ᠬᠡᠯᠡ',
      clearCache: 'ᠺᠧᠰ ᠠᠷᠢᠯᠭᠠᠬᠤ',
      aboutUs: 'ᠪᠢᠳᠡᠨ ᠦ ᠲᠤᠬᠠᠢ',
      privacyPolicy: 'ᠨᠢᠭᠤᠴᠠᠯᠠᠯ ᠤᠨ ᠪᠣᠳᠣᠯᠭ᠎ᠠ',
      userAgreement: 'ᠬᠡᠷᠡᠭᠯᠡᠭᠴᠢ ᠶᠢᠨ ᠭᠧᠷᠧᠶ᠎ᠡ',
      aboutApp: 'ᠠᠫᠫ ᠤᠨ ᠲᠤᠬᠠᠢ',
      selectLanguage: 'ᠬᠡᠯᠡ ᠰᠣᠩᠭᠣᠬᠤ',
      chinese: '中文',
      mongolian: 'ᠮᠣᠩᠭᠣᠯ',
      languageSwitched: 'ᠬᠡᠯᠡ ᠰᠣᠯᠢᠭᠳᠠᠯᠠᠭ᠎ᠠ',
      clearCacheConfirm: 'ᠺᠧᠰ ᠢ ᠠᠷᠢᠯᠭᠠᠬᠤ ᠳᠠᠭᠠᠨ ᠢᠲᠡᠭᠡᠯᠲᠡᠢ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ?',
      clearCacheSuccess: 'ᠺᠧᠰ ᠠᠷᠢᠯᠭᠠᠭᠳᠠᠯᠠᠭ᠎ᠠ'
    },
    // 编辑资料页面
    editProfile: {
      changeAvatar: 'ᠵᠢᠷᠤᠭ ᠰᠣᠯᠢᠬᠤ ᠶᠢᠨ ᠲᠤᠯᠠ ᠳᠠᠷᠤᠨ᠎ᠠ ᠤᠤ',
      nickname: 'ᠨᠡᠷ᠎ᠡ',
      nicknamePlaceholder: 'ᠨᠡᠷ᠎ᠡ ᠪᠡᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      gender: 'ᠬᠦᠢᠰᠦ',
      male: 'ᠡᠷ᠎ᠡ',
      female: 'ᠡᠮ᠎ᠡ',
      birthday: 'ᠲᠥᠷᠥᠭᠰᠡᠨ ᠡᠳᠦᠷ',
      selectDate: 'ᠣᠭᠨᠣᠭ᠎ᠠ ᠶᠢ ᠰᠣᠩᠭᠣᠨ᠎ᠠ ᠤᠤ',
      phone: 'ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ',
      phonePlaceholder: 'ᠤᠲᠠᠰᠤᠨ ᠤ ᠳᠤᠭᠠᠷ ᠢᠶᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      email: 'ᠢᠮᠧᠯ',
      emailPlaceholder: 'ᠢᠮᠧᠯ ᠬᠠᠶᠠᠭ ᠢᠶᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ',
      address: 'ᠬᠠᠶᠠᠭ',
      addressPlaceholder: 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠬᠠᠶᠠᠭ ᠢᠶᠠᠨ ᠣᠷᠣᠭᠤᠯᠤᠨ᠎ᠠ ᠤᠤ'
    },
    // 文章
    articles: {
      title: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠥᠭᠦᠯᠡᠯ',
      detail: 'ᠥᠭᠦᠯᠡᠯ ᠦᠨ ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ',
      noArticles: 'ᠣᠳᠣᠭᠠᠬᠢ ᠥᠭᠦᠯᠡᠯ ᠪᠠᠶᠢᠬᠤᠭᠦᠢ ᠪᠠᠶᠢᠨ᠎ᠠ',
      relatedArticles: 'ᠬᠣᠯᠪᠣᠭᠠᠲᠠᠢ ᠥᠭᠦᠯᠡᠯᠯᠦᠭᠦᠳ',
      readMore: 'ᠴᠠᠭᠠᠰᠢ ᠤᠩᠰᠢᠬᠤ',
      shareArticle: 'ᠥᠭᠦᠯᠡᠯ ᠬᠤᠪᠢᠶᠠᠯᠴᠠᠬᠤ',
      likes: 'ᠲᠠᠭᠠᠯᠠᠭᠳᠠᠭᠰᠠᠨ',
      comments: 'ᠰᠡᠳᠬᠦᠭᠳᠡᠯ',
      category: 'ᠠᠩᠭᠢᠯᠠᠯ',
      popular: 'ᠠᠯᠳᠠᠷᠲᠠᠢ ᠥᠭᠦᠯᠡᠯᠯᠦᠭᠦᠳ',
      latest: 'ᠰᠢᠨ᠎ᠡ ᠥᠭᠦᠯᠡᠯᠯᠦᠭᠦᠳ',
      viewMore: 'ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠦᠵᠡᠬᠦ'
    }
  }
};

// 默认语言
const DEFAULT_LANG = 'zh';

// 获取当前语言设置
export const getCurrentLang = () => {
  return uni.getStorageSync('language') || DEFAULT_LANG;
};

// 设置语言
export const setLang = (lang) => {
  uni.setStorageSync('language', lang);
};

// 新增setLanguage方法，用于从系统设置切换语言
export const setLanguage = (lang) => {
  // 确保语言值有效
  const validLang = (lang === 'zh' || lang === 'mn_trad') ? lang : DEFAULT_LANG;
  
  console.log(`切换语言为: ${validLang}`);
  
  // 确保保存语言设置到存储
  try {
    uni.setStorageSync('language', validLang);
    console.log('语言设置已保存到本地存储:', validLang);
  } catch (e) {
    console.error('保存语言设置失败:', e);
  }
  
  return true;
};

// 获取翻译文本
export const t = (key) => {
  const currentLang = getCurrentLang();
  const keys = key.split('.');
  
  let value = messages[currentLang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      // 如果找不到对应的翻译，尝试使用默认语言
      let defaultValue = messages[DEFAULT_LANG];
      for (const dk of keys) {
        if (defaultValue && defaultValue[dk]) {
          defaultValue = defaultValue[dk];
        } else {
          return key; // 如果默认语言也没有这个翻译，返回原key
        }
      }
      return defaultValue;
    }
  }
  
  return value;
};

export default {
  messages,
  getCurrentLang,
  setLang,
  setLanguage,
  t
}; 