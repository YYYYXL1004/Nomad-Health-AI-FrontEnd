<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @tap="handleBack">
        <text class="back-icon">«</text>
      </view>
      <view class="page-title">
        <text>{{ $t('articles.detail') }}</text>
      </view>
    </view>
    
    <!-- 加载中状态 -->
    <view v-if="loading" class="loading-container">
      <text>{{ $t('common.loading') }}</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <text>{{ error }}</text>
      <button class="retry-btn" @tap="loadArticleDetail">{{ $t('common.retry') }}</button>
    </view>
    
    <!-- 文章详情 -->
    <scroll-view v-else class="article-detail-container" scroll-y="true">
      <!-- 文章头部信息 -->
      <view class="article-header">
        <text class="article-title">{{ currentLang === 'zh' ? article.title : article.titleMn }}</text>
        <view class="article-meta">
          <text class="article-author">{{ article.author }}</text>
          <text class="article-date">{{ article.publishDate }}</text>
        </view>
        <view class="article-stats">
          <text class="article-views">{{ article.readCount }} {{ currentLang === 'zh' ? '阅读' : 'ᠦᠵᠡᠭᠰᠡᠨ' }}</text>
          <text class="article-likes">{{ article.likeCount }} {{ currentLang === 'zh' ? '点赞' : 'ᠲᠠᠭᠠᠯᠠᠭᠳᠠᠭᠰᠠᠨ' }}</text>
        </view>
      </view>
      
      <!-- 文章内容 -->
      <view class="article-content">
        <rich-text :nodes="currentLang === 'zh' ? article.content : article.contentMn"></rich-text>
      </view>
      
      <!-- 相关文章 -->
      <view v-if="article.relatedArticles && article.relatedArticles.length > 0" class="related-articles">
        <text class="related-title">{{ $t('articles.relatedArticles') }}</text>
        <view 
          v-for="(related, index) in article.relatedArticles" 
          :key="index"
          class="related-item"
          @tap="viewArticleDetail(related.id)"
        >
          <text class="related-item-title">{{ currentLang === 'zh' ? related.title : related.titleMn }}</text>
          <text class="related-item-arrow">»</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentLang } from '@/i18n/index.js';

// 当前语言
const currentLang = ref(getCurrentLang());

// 文章ID
const articleId = ref('');

// 文章详情
const article = ref({
  title: '',
  titleMn: '',
  content: '',
  contentMn: '',
  author: '',
  authorTitle: '',
  publishDate: '',
  readCount: 0,
  likeCount: 0,
  relatedArticles: []
});

// 页面状态
const loading = ref(true);
const error = ref('');

// 页面加载时初始化
onMounted(() => {
  // 获取文章ID
  const query = uni.getLaunchOptionsSync().query || {};
  if (uni.getEnterOptionsSync) {
    const enterOptions = uni.getEnterOptionsSync();
    if (enterOptions && enterOptions.query) {
      Object.assign(query, enterOptions.query);
    }
  }
  
  // 尝试从页面参数中获取文章ID
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.options) {
    Object.assign(query, currentPage.options);
  }
  
  articleId.value = query.id;
  
  if (articleId.value) {
    loadArticleDetail();
  } else {
    error.value = currentLang.value === 'zh' ? '文章ID无效' : 'ᠥᠭᠦᠯᠡᠯ ᠦᠨ ID ᠪᠤᠷᠤᠭᠤ ᠪᠠᠢᠨ᠎ᠠ';
    loading.value = false;
  }
});

// 加载文章详情
const loadArticleDetail = () => {
  loading.value = true;
  error.value = '';
  
  uni.getApp().config.globalProperties.$request({
    url: `/api/articles/${articleId.value}`,
    method: 'GET'
  }).then(res => {
    loading.value = false;
    
    if (res.data) {
      article.value = {
        title: res.data.title,
        titleMn: res.data.titleMn || res.data.title,
        content: res.data.content,
        contentMn: res.data.contentMn || res.data.content,
        author: res.data.author,
        authorTitle: res.data.authorTitle,
        publishDate: res.data.publishDate,
        readCount: res.data.readCount || 0,
        likeCount: res.data.likeCount || 0,
        relatedArticles: res.data.relatedArticles || []
      };
    }
  }).catch(err => {
    loading.value = false;
    error.value = (err.errors && err.errors[0]) || (currentLang.value === 'zh' ? '获取文章详情失败' : 'ᠥᠭᠦᠯᠡᠯ ᠦᠨ ᠳᠡᠯᠭᠡᠷᠡᠩᠭᠦᠢ ᠢ ᠠᠪᠴᠤ ᠴᠢᠳᠠᠭᠰᠠᠨ ᠦᠭᠡᠢ');
    console.error('获取文章详情失败', err);
    
    // 测试数据
    if (process.env.NODE_ENV === 'development') {
      article.value = {
        title: '高血压的预防与控制',
        titleMn: 'ᠴᠢᠰᠦᠨ ᠦ ᠳᠠᠷᠤᠯᠲᠠ ᠢᠬᠡᠰᠬᠦ ᠡᠴᠡ ᠤᠷᠢᠳᠴᠢᠯᠠᠨ ᠰᠡᠷᠭᠡᠶᠢᠯᠡᠬᠦ',
        content: '<p>高血压是现代社会常见的慢性疾病，它可以导致多种严重的健康问题，如心脏病、中风和肾脏疾病。然而，通过适当的生活方式调整和医疗管理，高血压是可以被有效控制的。</p><p><strong>什么是高血压？</strong></p><p>当你的血压持续高于正常水平（120/80 mmHg）时，就被诊断为高血压。具体来说，如果你的收缩压（上压）持续高于140 mmHg或舒张压（下压）持续高于90 mmHg，则需要关注。</p><p><strong>高血压的风险因素</strong></p><ul><li>年龄增长</li><li>家族遗传史</li><li>超重或肥胖</li><li>缺乏体育锻炼</li><li>高盐饮食</li><li>过量饮酒</li><li>吸烟</li><li>长期压力</li></ul><p><strong>预防和控制高血压的方法</strong></p><ol><li><strong>健康饮食</strong>：采用低盐、低脂、高纤维的饮食方式，如地中海饮食或DASH饮食计划。</li><li><strong>定期运动</strong>：每周至少进行150分钟的中等强度有氧运动，如快走、游泳或骑自行车。</li><li><strong>保持健康体重</strong>：减轻体重可以显著降低血压。</li><li><strong>限制酒精摄入</strong>：男性每天不超过两杯标准酒精饮料，女性不超过一杯。</li><li><strong>戒烟</strong>：吸烟会损伤血管壁并加速动脉硬化。</li><li><strong>减少压力</strong>：通过冥想、深呼吸或瑜伽等方式管理压力。</li><li><strong>定期监测血压</strong>：了解自己的血压状况，必要时寻求医疗帮助。</li><li><strong>按时服药</strong>：如果已经被诊断为高血压，请按医嘱服用药物。</li></ol><p>记住，预防和控制高血压是一个长期过程，需要持续的生活方式改变和医疗监督。如果你有高血压的家族史或其他风险因素，请定期咨询医生，及早采取预防措施。</p>',
        contentMn: '<p>Цусны даралт ихсэх нь орчин үеийн нийгэмд түгээмэл тохиолддог архаг өвчин бөгөөд зүрхний өвчин, инсульт, бөөрний өвчин зэрэг олон төрлийн ноцтой эрүүл мэндийн асуудлыг үүсгэж болно. Гэсэн хэдий ч зохистой амьдралын хэв маяг, эмнэлгийн тусламжаар цусны даралт ихсэлтийг үр дүнтэй хянах боломжтой.</p><p><strong>Цусны даралт ихсэлт гэж юу вэ?</strong></p><p>Таны цусны даралт хэвийн хэмжээнээс (120/80 мм муб) тогтмол өндөр байвал цусны даралт ихсэлт гэж оношлогддог. Тодруулбал, хэрэв таны систолын даралт (дээд даралт) 140 мм мөнгөн усны багананаас их эсвэл диастолын даралт (доод) 90 мм мөнгөн усны багананаас их байвал анхаарах хэрэгтэй.</p><p><strong>Цусны даралт ихсэх эрсдэлт хүчин зүйлс</strong></p><ul><li>Нас ахих</li><li>Удамшлын түүх</li><li>Илүүдэл жин, таргалалт</li><li>Бие махбодийн дасгал хөдөлгөөний дутагдал</li><li>Давсны хэрэглээ их</li><li>Архи хэтрүүлэх</li><li>Тамхи татах</li><li>Удаан хугацааны стресс</li></ul><p><strong>Цусны даралт ихсэлтээс урьдчилан сэргийлэх, хянах арга замууд</strong></p><ol><li><strong>Эрүүл хооллолт</strong>: Давс, өөх тос багатай, шүүс ихтэй хоол хүнсээр хооллох, тухайлбал Газар дундын тэнгисийн хоолны дэглэм эсвэл DASH хоолны төлөвлөгөө.</li><li><strong>Тогтмол дасгал хийх</strong>: Долоо хоногт дор хаяж 150 минутын дунд зэргийн эрчимтэй аэробик дасгал хийх, жишээлбэл хурдан алхах, усанд сэлэх, дугуй унах.</li><li><strong>Эрүүл жинг хадгалах</strong>: Жингээ бууруулснаар цусны даралтыг үлэмж бууруулж болно.</li><li><strong>Согтууруулах ундаа хязгаарлах</strong>: Эрэгтэй хүн өдөрт стандарт согтууруулах ундаа хоёроос илүүгүй, эмэгтэй хүн нэгээс илүүгүй уух хэрэгтэй.</li><li><strong>Тамхи татахаа болих</strong>: Тамхи судасны ханыг гэмтээж, судасны хатуурлыг түргэсгэдэг.</li><li><strong>Стрессийг багасгах</strong>: Бясалгал, гүн амьсгал, иог зэргээр стрессээ зохицуулах.</li><li><strong>Тогтмол цусны даралтаа хянах</strong>: Өөрийн цусны даралтын байдлыг мэдэж, шаардлагатай үед эмнэлгийн тусламж эрэх.</li><li><strong>Эмээ цагт нь уух</strong>: Хэрэв танд цусны даралт ихсэлт гэж оношилсон бол эмчийн зааврын дагуу эм уух хэрэгтэй.</li></ol><p>Цусны даралт ихсэлтээс урьдчилан сэргийлэх, хянах нь удаан хугацааны үйл явц бөгөөд тогтмол амьдралын хэв маягийн өөрчлөлт, эмнэлгийн хяналт шаардагддаг гэдгийг санаарай. Хэрэв танд цусны даралт ихсэлтийн гэр бүлийн түүх эсвэл бусад эрсдэлт хүчин зүйл байгаа бол эмчтэйгээ тогтмол зөвлөлдөж, эрт урьдчилан сэргийлэх арга хэмжээ авна уу.</p>',
        author: '王医生',
        authorTitle: '心血管内科主任医师',
        publishDate: '2023-11-15',
        readCount: 1256,
        likeCount: 458,
        relatedArticles: [
          {
            id: 'article2',
            title: '降压药物的正确使用方法',
            titleMn: 'ᠴᠢᠰᠦᠨ ᠦ ᠳᠠᠷᠤᠯᠲᠠ ᠪᠠᠭᠤᠷᠠᠭᠤᠯᠬᠤ ᠡᠮ ᠢ ᠵᠥᠪ ᠬᠡᠷᠡᠭᠯᠡᠬᠦ ᠠᠷᠭ᠎ᠠ'
          },
          {
            id: 'article3',
            title: '心脏健康与饮食',
            titleMn: 'ᠵᠢᠷᠦᠬᠡᠨ ᠦ ᠡᠷᠡᠭᠦᠯ ᠮᠡᠨᠳᠦ ᠪᠠ ᠬᠣᠭᠣᠯᠠ ᠲᠡᠵᠢᠭᠡᠯ'
          }
        ]
      };
    }
  });
};

// 查看相关文章
const viewArticleDetail = (id) => {
  uni.navigateTo({
    url: `/pages/articles/detail?id=${id}`
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
  background-color: #fff;
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

/* 加载中状态 */
.loading-container, .error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60rpx;
}

.loading-container text, .error-container text {
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

/* 文章详情 */
.article-detail-container {
  flex: 1;
  padding: 30rpx;
}

.article-header {
  margin-bottom: 40rpx;
}

.article-title {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.article-author {
  font-size: 26rpx;
  color: #666;
}

.article-date {
  font-size: 24rpx;
  color: #999;
}

.article-stats {
  display: flex;
  gap: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.article-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 40rpx;
}

/* 相关文章 */
.related-articles {
  margin-top: 40rpx;
  border-top: 1rpx solid #eee;
  padding-top: 30rpx;
}

.related-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.related-item-title {
  font-size: 28rpx;
  color: #555;
  flex: 1;
}

.related-item-arrow {
  font-size: 28rpx;
  color: #999;
}
</style> 