import { ref, watch, onMounted, computed } from 'vue';
import { 
  getCurrentLang, 
  setLanguage, 
  translate, 
  getTextByLang, 
  isMongolian, 
  isTraditionalMongolian,
  getLanguageDirection,
  getWritingMode,
  getTextDirection,
  getSupportedLanguages,
  getLanguageName
} from '../utils/language';

// 语言切换Hook
export function useLanguage() {
  const currentLang = ref(getCurrentLang());
  const supportedLanguages = ref(getSupportedLanguages());
  
  // 计算属性：当前语言是否为蒙古语
  const isMongolianLang = computed(() => isMongolian(currentLang.value));
  
  // 计算属性：当前语言是否为传统蒙古文
  const isTraditionalMongolianLang = computed(() => isTraditionalMongolian(currentLang.value));
  
  // 计算属性：语言方向类型 (horizontal/vertical)
  const languageDirection = computed(() => getLanguageDirection(currentLang.value));
  
  // 计算属性：CSS writing-mode
  const writingMode = computed(() => getWritingMode(currentLang.value));
  
  // 计算属性：文本方向
  const textDirection = computed(() => getTextDirection(currentLang.value));
  
  // 计算属性：当前语言名称
  const currentLangName = computed(() => getLanguageName(currentLang.value));
  
  // 监听语言变化
  watch(() => getCurrentLang(), (newLang) => {
    console.log('监听到语言变化:', currentLang.value, '->', newLang);
    if (newLang !== currentLang.value) {
      currentLang.value = newLang;
    }
  }, { immediate: true });
  
  // 初始化
  onMounted(() => {
    currentLang.value = getCurrentLang();
  });
  
  // 切换语言
  const switchLanguage = (lang) => {
    if (lang === currentLang.value) return;
    
    setLanguage(lang);
    currentLang.value = lang;
    
    // 根据不同语言显示对应的提示
    let toastMessage = '已切换为中文';
    if (lang === 'mn-cyrl') {
      toastMessage = 'Монгол руу шилжсэн';
    } else if (lang === 'mn_trad') {
      toastMessage = 'ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡᠨᠳᠦ ᠰᠣᠯᠢᠭᠳᠠᠪᠠ';
    }
    
    uni.showToast({
      title: toastMessage,
      icon: 'none',
      duration: 2000
    });
  };
  
  // 获取文本（根据当前语言返回对应文本）
  const getText = (zhText, mnCyrlText, mnMongText) => {
    return getTextByLang(zhText, mnCyrlText, mnMongText);
  };
  
  // 格式化支持垂直排版的文本（针对传统蒙古文）
  const formatVerticalText = (text) => {
    if (!isTraditionalMongolianLang.value || !text) return text;
    
    // 在传统蒙古文模式下处理文本排版
    // 这里可以添加特定的排版逻辑，如字符间距调整等
    return text;
  };
  
  return {
    currentLang,
    supportedLanguages,
    isMongolianLang,
    isTraditionalMongolianLang,
    languageDirection,
    writingMode,
    textDirection,
    currentLangName,
    switchLanguage,
    t: translate, // 简写t方法，方便模板中使用
    getText,
    formatVerticalText
  };
}