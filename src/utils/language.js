import i18n from '../i18n/index.js';
import CONFIG from '../config';

// 获取当前语言
export const getCurrentLang = () => {
  return uni.getStorageSync(CONFIG.STORAGE.LANGUAGE) || CONFIG.DEFAULTS.LANGUAGE;
};

// 检查是否是蒙古语(任何变体)
export const isMongolian = (lang) => {
  return lang === 'mn-cyrl' || lang === 'mn_trad';
};

// 检查是否是传统蒙古文
export const isTraditionalMongolian = (lang) => {
  return lang === 'mn_trad';
};

// 检查是否是西里尔蒙古语
export const isCyrillicMongolian = (lang) => {
  return lang === 'mn-cyrl';
};

// 获取语言显示方向
export const getLanguageDirection = (lang) => {
  const langConfig = CONFIG.LANGUAGES.find(l => l.code === lang);
  return langConfig?.type || 'horizontal';
};

// 获取语言写作模式 (CSS writing-mode属性)
export const getWritingMode = (lang) => {
  if (isTraditionalMongolian(lang)) {
    return CONFIG.VERTICAL_TEXT.WRITING_MODE;
  }
  return 'horizontal-tb';
};

// 获取文本方向 (CSS direction属性)
export const getTextDirection = (lang) => {
  if (isTraditionalMongolian(lang)) {
    return CONFIG.VERTICAL_TEXT.DIRECTION;
  }
  return 'ltr';
};

// 设置语言
export const setLanguage = (lang) => {
  try {
    // 确保语言代码有效
    const validLanguages = CONFIG.LANGUAGES.map(l => l.code);
    if (!validLanguages.includes(lang)) {
      console.warn(`不支持的语言: ${lang}, 使用默认语言代替`);
      lang = CONFIG.DEFAULTS.LANGUAGE;
    }
    
    uni.setStorageSync(CONFIG.STORAGE.LANGUAGE, lang);
    console.log('应用语言已切换为:', lang);
    
    // 应用语言方向样式
    applyLanguageStyles(lang);
    
    return true;
  } catch (e) {
    console.error('设置语言失败:', e);
    return false;
  }
};

// 应用语言相关的样式
export const applyLanguageStyles = (lang) => {
  const direction = getLanguageDirection(lang);
  const writingMode = getWritingMode(lang);
  const textDirection = getTextDirection(lang);
  
  // 更新文档根元素的自定义属性
  document.documentElement.setAttribute('data-lang-dir', direction);
  document.documentElement.setAttribute('data-writing-mode', writingMode);
  document.documentElement.setAttribute('data-text-direction', textDirection);
  
  // 添加特定语言的类
  document.documentElement.classList.remove('lang-zh', 'lang-mn-cyrl', 'lang-mn_trad');
  document.documentElement.classList.add(`lang-${lang}`);
  
  // 为传统蒙古文添加垂直文本类
  if (isTraditionalMongolian(lang)) {
    document.documentElement.classList.add('vertical-text');
  } else {
    document.documentElement.classList.remove('vertical-text');
  }
};

// 获取指定语言的名称
export const getLanguageName = (langCode) => {
  const lang = CONFIG.LANGUAGES.find(l => l.code === langCode);
  return lang ? lang.name : langCode;
};

// 翻译文本
export const translate = (key) => {
  try {
    const result = i18n.t(key);
    return result;
  } catch (e) {
    console.error('国际化翻译错误:', e, key);
    return key;
  }
};

// 根据当前语言获取文本
export const getTextByLang = (zhText, mnCyrlText, mnMongText) => {
  const currentLang = getCurrentLang();
  
  if (currentLang === 'zh') {
    return zhText;
  } else if (currentLang === 'mn-cyrl') {
    return mnCyrlText || zhText;
  } else if (currentLang === 'mn_trad') {
    return mnMongText || mnCyrlText || zhText;
  }
  
  return zhText;
};

// 获取所有支持的语言
export const getSupportedLanguages = () => {
  return CONFIG.LANGUAGES;
};