// 导出所有工具函数
export * from './request';
export * from './language';
export * from './format';
export * from './validate';

// 导出配置
export { default as CONFIG } from '../config';

// 常量导出
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  IS_LOGGED_IN: 'isLoggedIn',
  USER_INFO: 'userInfo',
  LANGUAGE: 'language'
};

// 工具函数

// 显示加载提示
export const showLoading = (title = '加载中...') => {
  uni.showLoading({
    title,
    mask: true
  });
};

// 隐藏加载提示
export const hideLoading = () => {
  uni.hideLoading();
};

// 显示提示
export const showToast = (title, icon = 'none', duration = 2000) => {
  uni.showToast({
    title,
    icon,
    duration
  });
};

// 显示模态对话框
export const showModal = (options) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: () => {
        reject(new Error('模态框显示失败'));
      }
    });
  });
};

// 页面跳转
export const navigateTo = (url, params = {}) => {
  // 构建带参数的URL
  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = query ? `${url}?${query}` : url;
  
  uni.navigateTo({
    url: fullUrl
  });
};

// 重定向页面
export const redirectTo = (url, params = {}) => {
  // 构建带参数的URL
  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = query ? `${url}?${query}` : url;
  
  uni.redirectTo({
    url: fullUrl
  });
}; 