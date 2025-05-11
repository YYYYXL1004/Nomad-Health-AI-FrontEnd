import { createSSRApp } from "vue";
import App from "./App.vue";
import i18n from './i18n/index.js';
import { getBaseUrl, request } from './utils/request';
import { translate, getCurrentLang, setLanguage } from './utils/language';

export function createApp() {
  const app = createSSRApp(App);
  
  // 不再使用自动登录功能
  // autoLogin();
  
  // 国际化功能配置
  app.config.globalProperties.$t = translate;
  app.config.globalProperties.$i18n = i18n;
  app.config.globalProperties.$getCurrentLang = getCurrentLang;
  app.config.globalProperties.$setLanguage = setLanguage;
  
  // API功能配置
  app.config.globalProperties.$getBaseUrl = getBaseUrl;
  app.config.globalProperties.$request = request;
  app.config.globalProperties.baseUrl = 'http://localhost:5000';
  
  // 将request和baseUrl挂载到uni对象上，方便H5环境使用
  if (typeof window !== 'undefined') {
    uni.$request = request;
    uni.$getBaseUrl = getBaseUrl;
    uni.baseUrl = 'http://localhost:5000';
  }
  
  return {
    app
  }
}
