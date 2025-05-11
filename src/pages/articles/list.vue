<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('articles.title') }}</text>
      </view>
    </view>
    
    <!-- 分类导航 -->
    <scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
      <view class="category-list">
        <view 
          v-for="(category, index) in categories" 
          :key="index"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @tap="selectCategory(category.id)"
        >
          <text>{{ currentLang === 'zh' ? category.name : category.nameMn }}</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 加载中状态 -->
    <view v-if="loading && !isLoadingMore" class="loading-container">
      <text>{{ $t('common.loading') }}</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error && !isLoadingMore" class="error-container">
      <text>{{ error }}</text>
      <button class="retry-btn" @tap="loadArticles">{{ $t('common.retry') }}</button>
    </view>
    
    <!-- 空状态 -->
    <view v-else-if="articles.length === 0" class="empty-container">
      <text>{{ $t('articles.noArticles') }}</text>
    </view>
    
    <!-- 文章列表 -->
    <scroll-view 
      v-else 
      class="articles-container" 
      scroll-y="true"
      @scrolltolower="handleLoadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
    >
      <view class="article-list">
        <view 
          v-for="(article, index) in articles" 
          :key="index"
          class="article-item"
          @tap="viewArticleDetail(article)"
        >
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
      
      <!-- 加载更多指示器 -->
      <view v-if="isLoadingMore && !isEnd" class="loading-more">
        <text>{{ $t('common.loadingMore') }}</text>
      </view>
      
      <!-- 全部加载完毕提示 -->
      <view v-if="isEnd && articles.length > 0" class="no-more">
        <text>{{ $t('common.noMoreData') }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';

// 当前语言
const currentLang = ref(getCurrentLang());

// 文章列表
const articles = ref([]);

// 分类列表
const categories = ref([]);

// 当前选择的分类
const selectedCategory = ref('all');

// 页面状态
const loading = ref(true);
const error = ref('');
const page = ref(1);
const limit = 10;
const isEnd = ref(false);
const isLoadingMore = ref(false);
const isRefreshing = ref(false);

// 页面加载时初始化
onMounted(() => {
  // 加载分类
  loadCategories();
  
  // 加载文章列表
  loadArticles();
});

// 加载分类
const loadCategories = () => {
  uni.getApp().config.globalProperties.$request({
    url: '/api/articles/categories',
    method: 'GET'
  }).then(res => {
    if (res.data && res.data.list) {
      // 添加"全部"分类
      categories.value = [
        {
          id: 'all',
          name: '全部',
          nameMn: 'ᠪᠦᠬᠦ'
        },
        ...res.data.list
      ];
    }
  }).catch(err => {
    console.error('获取文章分类失败', err);
    // 使用默认分类
    categories.value = [
      {
        id: 'all',
        name: '全部',
        nameMn: 'ᠪᠦᠬᠦ'
      },
      {
        id: 'health',
        name: '健康知识',
        nameMn: 'ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ'
      },
      {
        id: 'diet',
        name: '饮食营养',
        nameMn: 'ᠬᠣᠭᠣᠯᠠ ᠲᠡᠵᠢᠭᠡᠯ'
      },
      {
        id: 'exercise',
        name: '运动健身',
        nameMn: 'ᠳᠠᠰᠬᠠᠯ'
      }
    ];
  });
};

// 加载文章列表
const loadArticles = (append = false) => {
  if (!append) {
    loading.value = true;
    error.value = '';
    page.value = 1;
    isEnd.value = false;
  } else {
    if (isEnd.value) return;
    isLoadingMore.value = true;
  }
  
  const categoryParam = selectedCategory.value !== 'all' ? `&categoryId=${selectedCategory.value}` : '';
  
  uni.getApp().config.globalProperties.$request({
    url: `/api/articles?page=${page.value}&limit=${limit}${categoryParam}`,
    method: 'GET'
  }).then(res => {
    loading.value = false;
    isLoadingMore.value = false;
    isRefreshing.value = false;
    
    if (res.data) {
      const newArticles = res.data.list.map(item => {
        return {
          id: item.id,
          title: item.title,
          titleMn: item.titleMn,
          desc: item.description,
          descMn: item.descriptionMn,
          date: item.publishDate,
          views: item.viewCount,
          image: item.cover || '/static/images/article-default.jpg'
        };
      });
      
      if (append) {
        articles.value = [...articles.value, ...newArticles];
      } else {
        articles.value = newArticles;
      }
      
      // 判断是否还有更多
      if (!res.data.hasMore || newArticles.length < limit) {
        isEnd.value = true;
      }
    }
  }).catch(err => {
    loading.value = false;
    isLoadingMore.value = false;
    isRefreshing.value = false;
    
    if (!append) {
      error.value = (err.errors && err.errors[0]) || '获取文章失败';
      console.error('获取文章列表失败', err);
      
      // 使用测试数据
      articles.value = [
        {
          id: 'article1',
          title: '高血压的预防与控制',
          titleMn: 'Цусны даралт ихсэлтээс урьдчилан сэргийлэх',
          desc: '高血压是常见的慢性疾病，本文介绍如何通过饮食和运动进行有效预防和控制。',
          descMn: 'Цусны даралт ихсэх нь түгээмэл архаг өвчин бөгөөд энэхүү өгүүлэлд хоол хүнс, дасгал хөдөлгөөнөөр үр дүнтэй урьдчилан сэргийлэх болон хянах талаар танилцуулж байна.',
          date: '2023-11-15',
          views: 1256,
          image: '/static/images/article1.jpg'
        },
        {
          id: 'article2',
          title: '冬季养生指南',
          titleMn: 'Өвлийн улиралд эрүүл мэндээ хамгаалах зөвлөгөө',
          desc: '冬季气温降低，人体免疫力容易下降，本文提供冬季保健的实用建议。',
          descMn: 'Өвлийн улиралд температур буурч, хүний дархлаа буурах хандлагатай байдаг тул энэхүү өгүүлэлд өвлийн улиралд эрүүл мэндээ хамгаалах практик зөвлөгөөг өгч байна.',
          date: '2023-11-10',
          views: 982,
          image: '/static/images/article2.jpg'
        }
      ];
    }
  });
};

// 选择分类
const selectCategory = (categoryId) => {
  if (selectedCategory.value === categoryId) return;
  
  selectedCategory.value = categoryId;
  loadArticles();
};

// 下拉刷新
const handleRefresh = () => {
  isRefreshing.value = true;
  loadArticles();
};

// 加载更多
const handleLoadMore = () => {
  if (isLoadingMore.value || isEnd.value) return;
  
  page.value++;
  loadArticles(true);
};

// 查看文章详情
const viewArticleDetail = (article) => {
  uni.navigateTo({
    url: `/pages/articles/detail?id=${article.id}`
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航 */
.nav-header {
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #8ab6c8;
  padding: 0 30rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-icon {
  font-size: 36rpx;
  color: #fff;
}

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
}

/* 分类导航 */
.category-scroll {
  height: 80rpx;
  white-space: nowrap;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.category-list {
  display: inline-flex;
  padding: 0 20rpx;
}

.category-item {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 80rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #666;
}

.category-item.active {
  color: #8ab6c8;
  font-weight: bold;
  position: relative;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background-color: #8ab6c8;
}

/* 加载中状态 */
.loading-container, .error-container, .empty-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60rpx;
}

.loading-container text, .error-container text, .empty-container text {
  font-size: 30rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.retry-btn {
  width: 200rpx;
  height: 70rpx;
  background-color: #8ab6c8;
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 文章列表 */
.articles-container {
  flex: 1;
}

.article-list {
  padding: 20rpx;
}

.article-item {
  display: flex;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.article-image {
  width: 220rpx;
  height: 160rpx;
  flex-shrink: 0;
}

.article-info {
  flex: 1;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-desc {
  font-size: 24rpx;
  color: #666;
  flex: 1;
  margin-bottom: 10rpx;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
}

/* 加载更多和无更多数据提示 */
.loading-more, .no-more {
  text-align: center;
  padding: 20rpx 0;
}

.loading-more text, .no-more text {
  font-size: 24rpx;
  color: #999;
}
</style> 