<script>
import { getCurrentLang } from './i18n/index.js';

export default {
  globalData: {
    checkingLogin: false
  },
  
  onLaunch: function () {
    console.log('App Launch');
    
    // 初始化时，如果没有设置语言，则设置为默认语言
    if (!uni.getStorageSync('language')) {
      uni.setStorageSync('language', 'zh');
    }

    console.log('当前登录状态:', uni.getStorageSync('isLoggedIn'));
    
    // 检查登录状态
    this.checkLoginStatus();

    // 添加全局页面切换拦截器
    this.setupNavigationInterceptor();
    
    // 添加TabBar处理
    this.setupTabBarHandler();
    
    // 如果已经自动登录，直接进入首页
    setTimeout(() => {
      if (uni.getStorageSync('isLoggedIn')) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentPath = currentPage ? currentPage.route : '';
        
        // 如果当前在登录或注册页，则跳转到首页
        if (currentPath === 'pages/login/index' || currentPath === 'pages/register/index' || !currentPath) {
          console.log('已自动登录，跳转到首页');
          uni.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    }, 500);
  },
  onShow: function () {
    console.log('App Show');
    
    // 刷新语言设置
    const lang = uni.getStorageSync('language') || 'zh';
    console.log('App.vue - 当前语言:', lang);
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage ? currentPage.route : '';
      
      console.log('检查登录状态 - 当前路径:', currentPath);
      
      // 这些页面不需要登录
      const noAuthRequiredPages = ['pages/login/index', 'pages/register/index'];
      
      // 如果当前页面不需要登录验证，则直接返回
      if (noAuthRequiredPages.includes(currentPath)) {
        console.log('当前页面无需登录验证');
        return;
      }
      
      // 检查是否已登录
      const isLoggedIn = uni.getStorageSync('isLoggedIn');
      console.log('当前登录状态:', isLoggedIn);
      
      if (!isLoggedIn) {
        console.log('未登录，重定向到登录页面');
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }
    },
    
    // 设置导航拦截器
    setupNavigationInterceptor() {
      const self = this;
      console.log('设置导航拦截器');
      
      // 拦截页面跳转
      const originalSwitchTab = uni.switchTab;
      const originalNavigateTo = uni.navigateTo;
      const originalReLaunch = uni.reLaunch;
      const originalRedirectTo = uni.redirectTo;
      
      // 这些页面不需要登录
      const noAuthRequiredPages = ['/pages/login/index', '/pages/register/index'];
      
      // 防止死循环的计数器
      let redirectCount = 0;
      const MAX_REDIRECTS = 3;
      
      // 拦截switchTab
      uni.switchTab = (options) => {
        console.log('拦截 switchTab:', options.url);
        
        if (self.globalData.checkingLogin) {
          console.log('已在检查登录，直接执行switchTab');
          return originalSwitchTab.call(uni, options);
        }
        
        self.globalData.checkingLogin = true;
        
        try {
          // 检查登录状态
          const isLoggedIn = uni.getStorageSync('isLoggedIn');
          console.log('switchTab - 当前登录状态:', isLoggedIn);
          
          if (!isLoggedIn && !noAuthRequiredPages.includes(options.url)) {
            console.log('未登录，跳转至登录页');
            
            // 重置状态后跳转到登录页
            self.globalData.checkingLogin = false;
            
            uni.reLaunch({ url: '/pages/login/index' });
            return;
          }
          
          console.log('允许跳转:', options.url);
          self.globalData.checkingLogin = false;
          originalSwitchTab.call(uni, options);
        } catch (error) {
          console.error('switchTab 拦截器错误:', error);
          self.globalData.checkingLogin = false;
          originalSwitchTab.call(uni, options);
        }
      };
      
      // 拦截navigateTo
      uni.navigateTo = (options) => {
        console.log('拦截 navigateTo:', options.url);
        
        if (self.globalData.checkingLogin) {
          console.log('已在检查登录，直接执行navigateTo');
          return originalNavigateTo.call(uni, options);
        }
        
        self.globalData.checkingLogin = true;
        
        try {
          // 检查登录状态
          const isLoggedIn = uni.getStorageSync('isLoggedIn');
          console.log('navigateTo - 当前登录状态:', isLoggedIn);
          
          if (!isLoggedIn && !noAuthRequiredPages.includes(options.url)) {
            console.log('未登录，跳转至登录页');
            
            // 重置状态后跳转到登录页
            self.globalData.checkingLogin = false;
            uni.reLaunch({ url: '/pages/login/index' });
            return;
          }
          
          console.log('允许跳转:', options.url);
          self.globalData.checkingLogin = false;
          originalNavigateTo.call(uni, options);
        } catch (error) {
          console.error('navigateTo 拦截器错误:', error);
          self.globalData.checkingLogin = false;
          originalNavigateTo.call(uni, options);
        }
      };
      
      // 拦截reLaunch，确保登录后的跳转不会被再次拦截
      uni.reLaunch = (options) => {
        console.log('拦截 reLaunch:', options.url);
        
        // 防止死循环
        if (redirectCount >= MAX_REDIRECTS) {
          console.warn('检测到可能的重定向循环，强制执行原始跳转');
          redirectCount = 0;
          return originalReLaunch.call(uni, options);
        }
        
        if (self.globalData.checkingLogin) {
          console.log('已在检查登录，直接执行reLaunch');
          return originalReLaunch.call(uni, options);
        }
        
        self.globalData.checkingLogin = true;
        redirectCount++;
        
        try {
          // 执行跳转到登录页的操作或从登录页跳转出来的操作直接执行不检查
          if (options.url === '/pages/login/index' || options.url.startsWith('/pages/login/')) {
            console.log('目标是登录页，允许跳转');
            self.globalData.checkingLogin = false;
            redirectCount = 0;
            return originalReLaunch.call(uni, options);
          }
          
          // 如果是从登录页面跳转到其他页面，则直接允许不检查登录状态
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const currentPath = currentPage ? currentPage.route : '';
          
          console.log('当前页面:', currentPath);
          
          if (currentPath === 'pages/login/index') {
            console.log('从登录页跳转出来，允许不检查');
            self.globalData.checkingLogin = false;
            redirectCount = 0;
            return originalReLaunch.call(uni, options);
          }
          
          // 检查登录状态
          const isLoggedIn = uni.getStorageSync('isLoggedIn');
          console.log('reLaunch - 当前登录状态:', isLoggedIn);
          
          if (!isLoggedIn && !noAuthRequiredPages.includes(options.url)) {
            console.log('未登录，跳转至登录页');
            self.globalData.checkingLogin = false;
            
            // 确保不会是重复跳转到登录页
            if (currentPath !== 'pages/login/index') {
              uni.reLaunch({ url: '/pages/login/index' });
            }
            return;
          }
          
          console.log('允许跳转:', options.url);
          self.globalData.checkingLogin = false;
          redirectCount = 0;
          originalReLaunch.call(uni, options);
        } catch (error) {
          console.error('reLaunch 拦截器错误:', error);
          self.globalData.checkingLogin = false;
          redirectCount = 0;
          originalReLaunch.call(uni, options);
        }
      };
      
      // 拦截redirectTo
      uni.redirectTo = (options) => {
        console.log('拦截 redirectTo:', options.url);
        
        if (self.globalData.checkingLogin) {
          console.log('已在检查登录，直接执行redirectTo');
          return originalRedirectTo.call(uni, options);
        }
        
        self.globalData.checkingLogin = true;
        
        try {
          // 检查登录状态
          const isLoggedIn = uni.getStorageSync('isLoggedIn');
          console.log('redirectTo - 当前登录状态:', isLoggedIn);
          
          if (!isLoggedIn && !noAuthRequiredPages.includes(options.url)) {
            console.log('未登录，跳转至登录页');
            
            // 重置状态后跳转到登录页
            self.globalData.checkingLogin = false;
            uni.reLaunch({ url: '/pages/login/index' });
            return;
          }
          
          console.log('允许跳转:', options.url);
          self.globalData.checkingLogin = false;
          originalRedirectTo.call(uni, options);
        } catch (error) {
          console.error('redirectTo 拦截器错误:', error);
          self.globalData.checkingLogin = false;
          originalRedirectTo.call(uni, options);
        }
      };
    },
    
    // 设置TabBar处理
    setupTabBarHandler() {
      // 监听页面显示事件
      uni.onTabItemTap((item) => {
        console.log('点击了底部导航:', item.pagePath, item.index);
      });
    }
  }
}
</script>

<style>
/* 全局公共样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

/* 通用容器 */
.container {
  width: 100%;
  min-height: 100vh;
}

/* 通用导航头部 */
.nav-header {
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 20rpx;
  background-color: #8ab6c8;
  position: relative;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
}

.back-icon {
  color: #fff;
  font-size: 32rpx;
}

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

/* 通用内容容器 */
.content-container {
  flex: 1;
  padding: 20rpx;
}

/* 通用卡片样式 */
.card {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 通用列表项 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.list-item:last-child {
  border-bottom: none;
}

/* 通用按钮样式 */
.primary-btn {
  width: 100%;
  height: 90rpx;
  background-color: #8ab6c8;
  color: #fff;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  margin: 20rpx 0;
}

.secondary-btn {
  width: 100%;
  height: 90rpx;
  background-color: #f5f5f5;
  color: #8ab6c8;
  border: 1px solid #8ab6c8;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  margin: 20rpx 0;
}

/* 通用弹窗样式 */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
}

/* 全局样式 */
/* 底部导航的通用样式 */
.uni-tabbar {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.uni-tabbar-bottom {
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.uni-tabbar__icon {
  font-size: 46rpx !important;
  margin-bottom: 6rpx !important;
}

.uni-tabbar__label {
  font-size: 24rpx !important;
  line-height: 1.2 !important;
}
</style>
