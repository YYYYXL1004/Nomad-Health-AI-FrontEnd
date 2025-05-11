/**
 * 平台兼容性工具函数
 */

/**
 * 获取应用实例，兼容不同平台
 * @returns {Object|null} 应用实例
 */
export const getAppInstance = () => {
  try {
    // H5环境
    if (typeof getApp === 'function') {
      return getApp();
    }
    // 小程序、App环境
    if (typeof uni !== 'undefined' && typeof uni.getApp === 'function') {
      return uni.getApp();
    }
  } catch (e) {
    console.error('获取app实例失败:', e);
  }
  return null;
};

/**
 * 获取全局request方法
 * @returns {Function} request方法
 */
export const getGlobalRequest = () => {
  const app = getAppInstance();
  if (app && app.config && app.config.globalProperties) {
    return app.config.globalProperties.$request;
  }
  // 使用挂载到uni对象上的方法
  if (typeof uni !== 'undefined' && uni.$request) {
    return uni.$request;
  }
  // 兜底使用uni.request
  return uni.request;
};

/**
 * 获取基础URL
 * @returns {string} 基础URL
 */
export const getBaseUrl = () => {
  // 从应用实例获取
  const app = getAppInstance();
  if (app && app.config && app.config.globalProperties) {
    return app.config.globalProperties.baseUrl || '';
  }
  
  // 从uni对象获取
  if (typeof uni !== 'undefined' && uni.baseUrl) {
    return uni.baseUrl;
  }
  
  // 兜底返回默认值
  return 'http://localhost:5000';
}; 