<template>
  <view class="container">
    <!-- 顶部应用名称 -->
    <view class="header">
      <text class="app-title">{{ $t('home.title') }}</text>
    </view>
    
    <!-- 登录提示弹窗 -->
    <view class="login-popup" v-if="showLoginPopup">
      <view class="popup-mask" @tap="closeLoginPopup"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ currentLang === 'zh' ? '登录提示' : 'ᠨᠡᠪᠲᠡᠷᠡᠬᠦ ᠰᠠᠨᠠᠭᠤᠯᠭ᠎ᠠ' }}</text>
        </view>
        <view class="popup-body">
          <text class="popup-text">{{ currentLang === 'zh' ? '欢迎使用敕勒云诊，医疗健康服务系统，请登录后体验完整功能' : 'ᠴᠡᠯᠡᠭᠡᠷ ᠲᠠᠯ᠎ᠠ ᠶᠢᠨ ᠡᠭᠦᠯᠡᠨ ᠣᠨᠣᠰᠢᠯᠠᠭ᠎ᠠ᠂ ᠡᠮ ᠡᠮᠨᠡᠯᠭᠡ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡᠨ ᠦ ᠰᠢᠰᠲ᠋ᠧᠮ ᠢ ᠬᠡᠷᠡᠭᠯᠡᠬᠦ ᠶᠢ ᠪᠠᠶᠠᠷᠯᠠᠨ ᠤᠭᠲᠤᠵᠤ ᠪᠠᠶᠢᠨ᠎ᠠ᠂ ᠲᠡᠮᠳᠡᠭᠯᠡᠭᠰᠡᠨ ᠦ ᠳᠠᠷᠠᠭ᠎ᠠ ᠪᠦᠷᠢᠨ ᠪᠦᠲᠦᠨ ᠴᠢᠳᠠᠮᠵᠢ ᠶᠢ ᠲᠤᠷᠰᠢᠵᠤ ᠦᠵᠡᠭᠡᠷᠡᠢ' }}</text>
        </view>
        <view class="popup-footer">
          <button class="popup-btn cancel-btn" @tap="closeLoginPopup">{{ currentLang === 'zh' ? '稍后再说' : 'ᠪᠣᠯᠢᠬᠤ' }}</button>
          <button class="popup-btn confirm-btn" @tap="goToLogin">{{ currentLang === 'zh' ? '立即登录' : 'ᠨᠡᠪᠲᠡᠷᠡᠬᠦ' }}</button>
        </view>
      </view>
    </view>
    
    <!-- 浮动登录按钮，未登录时显示 -->
    <view class="floating-login-btn" v-if="!isUserLoggedIn && !isGuestMode" @tap="goToLogin">
      <text>{{ currentLang === 'zh' ? '登录' : 'ᠨᠡᠪᠲᠡᠷᠡᠬᠦ' }}</text>
    </view>
    
    <!-- 广播轮播图 -->
    <view class="broadcast-container">
      <swiper class="broadcast-swiper" circular autoplay interval="3000" duration="500" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff">
        <swiper-item v-for="(item, index) in broadcasts" :key="index" @tap="navigateToBroadcast(item)">
          <view class="broadcast-item" :style="{ backgroundColor: item.color }">
            <image class="broadcast-image" :src="item.image" mode="aspectFill"></image>
            <view class="broadcast-overlay">
              <text class="broadcast-title">{{ currentLang === 'zh' ? item.title : item.titleMn }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- 健康服务卡片 -->
    <view class="service-section">
      <view class="service-title">
        <text>{{ currentLang === 'zh' ? '健康服务' : 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡ' }}</text>
      </view>
      <view class="service-grid">
        <view class="service-item" @tap="navigateToService('healthReport')">
          <view class="service-icon health-report-icon">📊</view>
          <text class="service-name">{{ $t('home.healthReport') }}</text>
        </view>
        <view class="service-item" @tap="navigateToService('healthAdvice')">
          <view class="service-icon health-advice-icon">💬</view>
          <text class="service-name">{{ $t('home.healthAdvice') }}</text>
        </view>
        <view class="service-item" @tap="navigateToConsult">
          <view class="service-icon consult-now-icon">👨‍⚕️</view>
          <text class="service-name">{{ currentLang === 'zh' ? '在线问诊' : 'ᠴᠠᠭ ᠳᠠᠷᠤᠢ ᠵᠥᠪᠯᠡᠭᠥᠯᠭᠡ' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 健康文章卡片 -->
    <view class="article-section">
      <view class="section-header">
        <text class="section-title">{{ currentLang === 'zh' ? '健康文章' : 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠥᠭᠦᠯᠡᠯ' }}</text>
        <text class="view-more" @tap="viewMoreArticles">{{ $t('articles.viewMore') }} ></text>
      </view>
      
      <view class="article-list">
        <view class="article-item" v-for="(article, index) in articles" :key="index" @tap="viewArticle(article)">
          <image class="article-image" :src="article.image" mode="aspectFill"></image>
          <view class="article-info">
            <text class="article-title">{{ currentLang === 'zh' ? article.title : article.titleMn }}</text>
            <text class="article-desc">{{ currentLang === 'zh' ? article.desc : article.descMn }}</text>
            <view class="article-meta">
              <text class="article-date">{{ article.date }}</text>
              <text class="article-views">{{ article.views }} {{ currentLang === 'zh' ? '浏览' : 'ᠦᠵᠡᠭᠰᠡᠨ' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部辅助入口 -->
    <view class="helper-section">
      <view class="helper-item" @tap="navigateToHelp">
        <view class="helper-icon">❓</view>
        <text>{{ currentLang === 'zh' ? '使用帮助' : 'ᠲᠤᠰᠠᠯᠠᠮᠵᠢ' }}</text>
      </view>
      <view class="helper-item" @tap="navigateToContact">
        <view class="helper-icon">📞</view>
        <text>{{ currentLang === 'zh' ? '联系我们' : 'ᠬᠣᠯᠪᠣᠭ᠎ᠠ ᠪᠠᠷᠢᠬᠤ' }}</text>
      </view>
    </view>
  </view>
  
  <!-- 使用通用底部导航栏组件 -->
  <custom-tab-bar active="home" />
</template>

<script>
import { getCurrentLang } from '@/i18n/index.js';
import CustomTabBar from '@/components/CustomTabBar.vue';
import { request } from '@/utils/request.js';
import CONFIG from '@/config';

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      // 当前语言
      currentLang: getCurrentLang(),
      // 登录提示弹窗状态
      showLoginPopup: false,
      // 广播数据
      broadcasts: [
        {
          title: '“健康内蒙古2030”实施方案',
          titleMn: '《 ᠡᠷᠡᠭᠦᠯ ᠡᠩᠬᠡ ᠥᠪᠥᠷ ᠮᠣᠩᠭᠣᠯ᠎ᠤ᠋ᠨ 2030 》 ᠤ᠋ ᠬᠡᠷᠡᠭᠵᠢᠭᠦᠯᠬᠦ ᠲᠥᠰᠦᠯ',
          image: '/static/images/broadcast1.png',
          color: '#8ab6c8',
          url: 'https://wjw.nmg.gov.cn/zfxxgk/fdzzgknr/ghxx/202105/t20210514_1497851.html',
          type: 'web'
        },
        {
          title: '季节性疾病预防指南',
          titleMn: 'ᠤᠯᠠᠷᠢᠯ ᠤᠨ ᠡᠪᠡᠳᠴᠢᠨ ᠡᠴᠡ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ ᠭᠠᠷ ᠤᠨ ᠠᠪᠯᠠᠭ᠎ᠠ',
          image: '/static/images/broadcast2.png',
          color: '#7aacbe',
          url: 'https://news.qq.com/rain/a/20250506A07HKV00',
          type: 'web'
        },
        {
          title: '内蒙古健康饮食建议',
          titleMn: 'ᠥᠪᠥᠷ ᠮᠣᠩᠭᠣᠯ ᠤᠨ ᠡᠷᠡᠭᠦᠯ ᠬᠣᠭᠣᠯᠠᠯᠠᠯᠲᠠ ᠶᠢᠨ ᠵᠥᠪᠯᠡᠮᠵᠢ',
          image: '/static/images/broadcast3.png',
          color: '#69a2b4',
          url: 'https://wjw.nmg.gov.cn/ztlm/dqzt/jknmgxd/jknmgxd_msxd/202502/t20250228_2674281.html',
          type: 'web'
        }
      ],
      // 健康文章
      articles: [],
      // 健康报告
      healthReports: [],
      // 健康建议
      healthAdvice: [],
      // 用户是否已登录
      isUserLoggedIn: uni.getStorageSync('isLoggedIn'),
      // 是否是游客模式
      isGuestMode: uni.getStorageSync('isGuestMode')
    }
  },
  // 页面生命周期
  onLoad() {
    // 检查是否已登录或游客模式
    const isLoggedIn = uni.getStorageSync('isLoggedIn');
    const isGuestMode = uni.getStorageSync('isGuestMode');
    
    // 更新状态
    this.isUserLoggedIn = isLoggedIn;
    this.isGuestMode = isGuestMode;
    
    // 输出登录状态调试信息
    console.log('======= 调试信息 =======');
    console.log('登录状态 isLoggedIn:', isLoggedIn);
    console.log('游客模式 isGuestMode:', isGuestMode);
    console.log('登录状态类型:', typeof isLoggedIn);
    console.log('本地存储所有数据:', uni.getStorageInfoSync());
    console.log('========================');
    
    if (!isLoggedIn) {
      console.log('用户未登录，显示登录提示弹窗');
      console.log('showLoginPopup 设置前:', this.showLoginPopup);
      // 显示登录提示弹窗
      this.showLoginPopup = true;
      console.log('showLoginPopup 设置后:', this.showLoginPopup);
      // 仍然加载一些基本数据以展示内容
      this.useDefaultArticles();
    } else {
      console.log('用户已登录或游客模式，正常加载首页');
      // 正常加载页面数据
      this.refreshPageData();
    }
  },
  // 页面显示时执行
  onShow() {
    // 检查是否已登录或游客模式
    const isLoggedIn = uni.getStorageSync('isLoggedIn');
    const isGuestMode = uni.getStorageSync('isGuestMode');
    console.log('onShow: 检查登录状态:', isLoggedIn, '游客模式:', isGuestMode);
    
    // 更新登录状态和游客模式状态
    this.isUserLoggedIn = isLoggedIn;
    this.isGuestMode = isGuestMode;
    
    if (isLoggedIn) {
      console.log('onShow: 用户已登录或使用游客模式，刷新页面数据');
      // 隐藏登录提示
      this.showLoginPopup = false;
      // 刷新页面数据
      this.refreshPageData();
    } else {
      console.log('onShow: 用户未登录，显示登录提示');
      // 如果未登录，显示登录提示
      this.showLoginPopup = true;
      // 加载默认文章
      this.useDefaultArticles();
    }
    
    // 检测语言变化
    const newLang = getCurrentLang();
    if (newLang !== this.currentLang) {
      console.log('检测到语言变化，从', this.currentLang, '变为', newLang);
      this.currentLang = newLang;
      this.refreshPageData();
    }
  },
  methods: {
    // 页面加载和语言变化时刷新数据
    refreshPageData() {
      console.log('刷新主页数据，当前语言:', this.currentLang);
      // 更新当前语言
      this.currentLang = getCurrentLang();
      
      // 检查是否是游客模式
      const isGuestMode = uni.getStorageSync('isGuestMode');
      if (isGuestMode) {
        console.log('游客模式：使用默认数据，不调用API');
        // 游客模式下使用默认数据
        this.useDefaultArticles();
        return;
      }
      
      // 非游客模式下正常初始化数据
      this.fetchBanners();
      this.fetchArticles();
      this.fetchHealthReports();
      this.fetchHealthAdvice();
    },
    
    // 获取轮播图数据
    fetchBanners() {
      // 可以添加实际的接口调用，这里暂时使用静态数据
    },
    
    // 获取文章列表
    fetchArticles() {
      // 直接使用导入的request函数
      request({
        url: '/articles',
        method: 'GET',
        data: {
          page: 1,
          limit: 2
        }
      }).then(res => {
        if (res.data && res.data.list && res.data.list.length > 0) {
          // 转换API数据到前端需要的格式
          this.articles = res.data.list.map(item => {
            return {
              id: item.articleId,
              title: item.title,
              titleMn: item.titleMn,
              desc: item.summary,
              descMn: item.summaryMn,
              image: item.coverImage || '/static/images/article-default.jpg',
              date: item.publishTime,
              views: item.viewCount,
              url: item.articleUrl || null,
              type: item.articleUrl && item.articleUrl.startsWith('http') ? 'web' : 'page'
            };
          });
        } else {
          this.useDefaultArticles();
        }
      }).catch(err => {
        console.error('获取文章列表失败', err);
        this.useDefaultArticles();
      });
    },
    
    // 使用默认文章数据
    useDefaultArticles() {
      this.articles = [
        {
          id: 1,
          title: '牧区常见传染病预防措施',
          titleMn: 'ᠪᠡᠯᠴᠢᠭᠡᠷ ᠤᠨ ᠪᠦᠰᠡ ᠳᠤ ᠲᠦᠭᠡᠮᠡᠯ ᠬᠠᠯᠳᠠᠪᠤᠷᠢᠲᠤ ᠡᠪᠡᠳᠴᠢᠨ ᠡᠴᠡ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ ᠠᠷᠭ᠎ᠠ ᠬᠡᠮᠵᠢᠶ᠎ᠡ',
          desc: '了解如何预防和应对牧区常见传染性疾病...',
          descMn: 'ᠪᠡᠯᠴᠢᠭᠡᠷ ᠤᠨ ᠪᠦᠰᠡ ᠳᠤ ᠲᠦᠭᠡᠮᠡᠯ ᠬᠠᠯᠳᠠᠪᠤᠷᠢᠲᠤ ᠡᠪᠡᠳᠴᠢᠨ ᠡᠴᠡ ᠬᠡᠷᠬᠢᠨ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ ᠲᠤᠬᠠᠢ...',
          image: '/static/images/article1.png',
          date: '2024-06-15',
          views: 2458,
          url: 'https://www.gov.cn/zhengce/zhengceku/2022-09/20/content_5710720.htm',
          type: 'web'
        },
        {
          id: 2,
          title: '牧民饮食健康指南',
          titleMn: 'ᠮᠠᠯᠴᠢᠳ ᠤᠨ ᠬᠣᠭᠣᠯᠠ ᠲᠡᠵᠢᠭᠡᠯ ᠦᠨ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠶᠢᠨ ᠵᠢᠷᠤᠮᠯᠠᠯ',
          desc: '合理的饮食结构对牧民健康的重要性...',
          descMn: 'ᠮᠠᠯᠴᠢᠳ ᠤᠨ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠳᠤ ᠵᠣᠬᠢᠰᠲᠠᠢ ᠬᠣᠭᠣᠯᠠᠨ ᠤ ᠳᠡᠭᠯᠡᠮ ᠦᠨ ᠠᠴᠢ ᠬᠣᠯᠪᠣᠭᠳᠠᠯ...',
          image: '/static/images/article2.png',
          date: '2023-07-05',
          views: 1895,
          url: 'https://mp.weixin.qq.com/s/p9unbyWO3_AgnxmMoaWqLg',
          type: 'web'
        }
      ];
    },
    
    // 获取健康报告列表
    fetchHealthReports() {
      request({
        url: '/health/reports',
        method: 'GET',
        data: {
          page: 1,
          limit: 3
        }
      }).then(res => {
        if (res.data && res.data.list && res.data.list.length > 0) {
          this.healthReports = res.data.list;
        }
      }).catch(err => {
        console.error('获取健康报告失败', err);
      });
    },
    
    // 获取健康建议
    fetchHealthAdvice() {
      request({
        url: '/api/health/advice',
        method: 'GET'
      }).then(res => {
        if (res.data && res.data.adviceList) {
          this.healthAdvice = res.data.adviceList;
        }
      }).catch(err => {
        console.error('获取健康建议失败', err);
      });
    },
    
    // 导航到健康服务详情页
    navigateToService(type) {
      // 检查是否是游客模式
      const isGuestMode = uni.getStorageSync('isGuestMode');
      if (isGuestMode) {
        // 游客模式下显示提示
        uni.showToast({
          title: this.currentLang === 'zh' ? '游客模式下无法访问此功能' : 'ᠵᠣᠴᠢᠨ ᠬᠡᠯᠪᠡᠷᠢ ᠳᠤ ᠡᠨᠡ ᠴᠢᠳᠠᠮᠵᠢ ᠶᠢ ᠬᠡᠷᠡᠭᠯᠡᠬᠦ ᠪᠣᠯᠤᠮᠵᠢᠭᠦᠢ',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      if (type === 'healthReport') {
        // 健康报告直接跳转到我的健康档案
        uni.switchTab({
          url: '/pages/my/index',
          success: () => {
            // 延迟执行，确保页面已加载
            setTimeout(() => {
              uni.$emit('navigateToHealthRecord');
            }, 300);
          }
        });
      } else if (type === 'healthAdvice') {
        // 显示功能开发中提示
        uni.showToast({
          title: this.currentLang === 'zh' ? '该功能正在开发中' : 'ᠡᠨᠡᠬᠦ ᠴᠢᠳᠠᠮᠵᠢ ᠨᠢ ᠬᠥᠭᠵᠢᠭᠦᠯᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ',
          icon: 'none',
          duration: 2000
        });
      } else {
        uni.navigateTo({
          url: `/pages/services/${type}`
        });
      }
    },
    
    // 导航到问诊页
    navigateToConsult() {
      // 检查是否是游客模式
      const isGuestMode = uni.getStorageSync('isGuestMode');
      if (isGuestMode) {
        // 游客模式下显示提示
        uni.showToast({
          title: this.currentLang === 'zh' ? '游客模式下无法访问此功能' : 'ᠵᠣᠴᠢᠨ ᠬᠡᠯᠪᠡᠷᠢ ᠳᠤ ᠡᠨᠡ ᠴᠢᠳᠠᠮᠵᠢ ᠶᠢ ᠬᠡᠷᠡᠭᠯᠡᠬᠦ ᠪᠣᠯᠤᠮᠵᠢᠭᠦᠢ',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      uni.switchTab({
        url: '/pages/consult/index'
      });
    },
    
    // 查看更多文章
    viewMoreArticles() {
      uni.navigateTo({
        url: '/pages/articles/list'
      });
    },
    
    // 查看文章详情
    viewArticle(article) {
      // 检查文章是否有URL和类型
      if (article.url && article.type) {
        if (article.type === 'web') {
          // 如果是外部链接，使用浏览器打开
          this.openWebUrl(article.url, article.title);
        } else {
          // 如果是内部页面，使用导航
          uni.navigateTo({
            url: article.url,
            fail: (err) => {
              console.error('打开文章页面失败:', err);
              uni.showToast({
                title: this.currentLang === 'zh' ? '页面跳转失败' : 'ᠬᠤᠭᠤᠴᠠᠭ᠎ᠠ ᠨᠢ ᠳᠠᠭᠤᠰᠤᠭᠰᠠᠨ',
                icon: 'none'
              });
            }
          });
        }
      } else {
        // 没有设置URL时，使用默认的文章详情页
        uni.navigateTo({
          url: `/pages/articles/detail?id=${article.id}`
        });
      }
    },
    
    // 导航到使用帮助页面
    navigateToHelp() {
      // 显示弹窗提示
      uni.showModal({
        title: this.currentLang === 'zh' ? '使用帮助' : 'ᠲᠤᠰᠠᠯᠠᠮᠵᠢ',
        content: this.currentLang === 'zh' ? 
          '如需使用帮助，请拨打客服电话：0471-12345678\n或发送邮件至：support@chileyunzhen.com' : 
          'ᠲᠤᠰᠠᠯᠠᠮᠵᠢ ᠳᠤ ᠬᠡᠷᠡᠭᠯᠡᠬᠦ ᠳᠤ᠂ ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡᠨ ᠦ ᠤᠲᠠᠰᠤ 0471-12345678 ᠳᠤ ᠳᠠᠭᠤᠳᠠᠭᠠᠷᠠᠢ\nᠡᠰᠡᠭᠦᠯᠡ ᠡᠨᠡ ᠴᠠᠬᠢᠯᠭᠠᠨ ᠬᠠᠶᠠᠭ ᠲᠤ support@chileyunzhen.com ᠢᠯᠡᠭᠡᠷᠡᠢ',
        showCancel: false,
        confirmText: this.currentLang === 'zh' ? '我知道了' : 'ᠮᠡᠳᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ'
      });
    },
    
    // 导航到联系我们页面
    navigateToContact() {
      // 显示弹窗提示
      uni.showModal({
        title: this.currentLang === 'zh' ? '联系我们' : 'ᠬᠣᠯᠪᠣᠭ᠎ᠠ ᠪᠠᠷᠢᠬᠤ',
        content: this.currentLang === 'zh' ? 
          '客服电话：0471-12345678\n工作时间：周一至周五 9:00-18:00\n邮箱：contact@chileyunzhen.com' : 
          'ᠦᠢᠯᠡᠴᠢᠯᠡᠭᠡᠨ ᠦ ᠤᠲᠠᠰᠤ: 0471-12345678\nᠠᠵᠢᠯ ᠤᠨ ᠴᠠᠭ: ᠳᠠᠪᠠᠭ᠎ᠠ - ᠭᠤᠷᠪᠠᠨ 9:00-18:00\nᠴᠠᠬᠢᠯᠭᠠᠨ ᠬᠠᠶᠠᠭ: contact@chileyunzhen.com',
        showCancel: false,
        confirmText: this.currentLang === 'zh' ? '我知道了' : 'ᠮᠡᠳᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ'
      });
    },
    
    // 关闭登录弹窗
    closeLoginPopup() {
      this.showLoginPopup = false;
      // 关闭弹窗后仍然加载基本数据
      this.refreshPageData();
    },
    
    // 跳转到登录页面
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      });
    },
    
    // 导航到轮播图对应的页面或网址
    navigateToBroadcast(item) {
      console.log('点击轮播图:', item.title, item.url);
      
      if (!item.url) {
        console.log('该轮播图没有设置跳转链接');
        return;
      }
      
      // 根据类型决定跳转方式
      if (item.type === 'web') {
        // 跳转到外部网页
        this.openWebUrl(item.url, item.title);
      } else {
        // 跳转到内部页面
        uni.navigateTo({
          url: item.url,
          fail: (err) => {
            console.error('页面跳转失败:', err);
            uni.showToast({
              title: this.currentLang === 'zh' ? '页面跳转失败' : 'ᠬᠤᠭᠤᠴᠠᠭ᠎ᠠ ᠨᠢ ᠳᠠᠭᠤᠰᠤᠭᠰᠠᠨ',
              icon: 'none'
            });
          }
        });
      }
    },
    
    // 打开外部网页
    openWebUrl(url, title) {
      // 根据不同平台环境选择不同的打开方式
      // #ifdef H5
      // H5环境直接在新窗口打开
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
      // #endif
      
      // #ifndef H5
      // 非H5环境使用webview组件打开
      uni.navigateTo({
        url: `/pages/common/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`,
        fail: (err) => {
          console.error('打开网页失败:', err);
          uni.showToast({
            title: this.currentLang === 'zh' ? '打开网页失败' : 'ᠸᠧᠪ ᠨᠡᠭᠡᠭᠡᠵᠦ ᠳᠠᠭᠤᠰᠤᠭᠰᠠᠨ',
            icon: 'none'
          });
        }
      });
      // #endif
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  padding-bottom: 120rpx; /* 为底部导航留出空间 */
  background-color: #f7f9fc;
}

/* 顶部应用名称 */
.header {
  background-color: #8ab6c8;
  padding: 30rpx;
  text-align: center;
}

.app-title {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 500;
}

/* 广播轮播图 */
.broadcast-container {
  height: 320rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.broadcast-swiper {
  width: 100%;
  height: 100%;
}

.broadcast-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.broadcast-image {
  width: 100%;
  height: 100%;
}

.broadcast-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.broadcast-title {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
}

/* 健康服务网格 */
.service-section {
  margin: 30rpx 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.service-title {
  margin-bottom: 20rpx;
}

.service-title text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.service-item {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8fbfd;
  padding: 30rpx 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  border: 1px solid rgba(138, 182, 200, 0.2);
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  margin-bottom: 15rpx;
}

.service-name {
  font-size: 26rpx;
  color: #333;
  text-align: center;
}

/* 健康文章列表 */
.article-section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.view-more {
  font-size: 24rpx;
  color: #8ab6c8;
}

.article-list {
  display: flex;
  flex-direction: column;
}

.article-item {
  display: flex;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.article-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.article-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.article-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
}

.article-date, .article-views {
  font-size: 22rpx;
  color: #999;
}

/* 底部辅助入口 */
.helper-section {
  display: flex;
  padding: 0 20rpx;
  margin-bottom: 120rpx; /* 增加底部间距，为导航栏留出空间 */
}

.helper-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin: 0 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.helper-icon {
  margin-right: 10rpx;
  font-size: 28rpx;
}

.helper-item text {
  font-size: 26rpx;
  color: #666;
}

/* 登录提示弹窗样式 */
.login-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.popup-content {
  position: relative;
  width: 85%;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  z-index: 10000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  padding: 24px 20px;
  text-align: center;
  background-color: #8ab6c8;
}

.popup-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.popup-body {
  padding: 30px 24px;
  text-align: center;
}

.popup-text {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.popup-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.popup-btn {
  flex: 1;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  background-color: transparent;
  border: none;
}

.cancel-btn {
  border-right: 1px solid #eee;
  color: #666;
}

.confirm-btn {
  color: #ffffff;
  background-color: #8ab6c8;
  font-weight: bold;
}

/* 浮动登录按钮样式 */
.floating-login-btn {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #8ab6c8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
  z-index: 999;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}
</style>
