import { ref } from 'vue';
import { showLoading, hideLoading, showToast } from '../utils';

// 加载状态Hook
export function useLoading() {
  const isLoading = ref(false);
  const error = ref(null);
  
  // 包装异步函数，自动处理加载状态
  const withLoading = async (fn, options = {}) => {
    const {
      loadingText = '加载中...',
      successText = '',
      errorText = '操作失败，请稍后重试',
      showSuccessToast = false,
      showErrorToast = true,
      throwError = false
    } = options;
    
    isLoading.value = true;
    error.value = null;
    
    if (loadingText) {
      showLoading(loadingText);
    }
    
    try {
      const result = await fn();
      
      if (showSuccessToast && successText) {
        showToast(successText, 'success');
      }
      
      return result;
    } catch (err) {
      error.value = err;
      
      if (showErrorToast) {
        showToast(errorText, 'none');
      }
      
      if (throwError) {
        throw err;
      }
      
      return null;
    } finally {
      isLoading.value = false;
      hideLoading();
    }
  };
  
  return {
    isLoading,
    error,
    withLoading
  };
} 