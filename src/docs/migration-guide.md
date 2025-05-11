# 项目重构迁移指南

本文档提供将旧代码迁移到新架构的指南和最佳实践。

## 架构变更概述

### 重构前
- API请求直接在组件中调用
- 缺乏明确的类型定义
- 国际化逻辑分散
- 工具函数不集中

### 重构后
- 分层架构：服务层、工具层、Hooks层
- 引入TypeScript类型系统
- 统一配置管理
- 抽象可复用逻辑为Hooks

## 迁移步骤

### 1. API调用迁移

#### 旧代码
```js
// 在页面组件中直接调用API
onMounted(() => {
  uni.request({
    url: 'http://example.com/api/data',
    success: (res) => {
      this.data = res.data
    }
  })
})
```

#### 新代码
```js
// 使用服务层
import { dataService } from '@/services';

onMounted(async () => {
  try {
    const res = await dataService.getData();
    if (res.code === 200) {
      data.value = res.data;
    }
  } catch (error) {
    console.error('获取数据失败', error);
  }
});
```

### 2. 国际化迁移

#### 旧代码
```js
// 直接在模板中判断语言
<text>{{ language === 'zh' ? '中文文本' : '蒙古文文本' }}</text>

// 或在js中判断
const title = this.language === 'zh' ? '中文标题' : '蒙古文标题';
```

#### 新代码
```js
// 使用useLanguage hook
import { useLanguage } from '@/hooks';

const { getText } = useLanguage();

// 在模板中使用
<text>{{ getText('中文文本', '蒙古文文本') }}</text>

// 在js中使用
const title = getText('中文标题', '蒙古文标题');
```

### 3. 本地存储迁移

#### 旧代码
```js
// 直接使用键名
uni.setStorageSync('token', 'abc123');
const token = uni.getStorageSync('token');
```

#### 新代码
```js
// 使用配置中定义的键名
import { CONFIG } from '@/utils';

uni.setStorageSync(CONFIG.STORAGE.TOKEN, 'abc123');
const token = uni.getStorageSync(CONFIG.STORAGE.TOKEN);
```

### 4. 页面组件迁移

#### 旧代码
```vue
<template>
  <view>
    <text>{{title}}</text>
    <button @tap="fetchData">加载</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      list: []
    }
  },
  methods: {
    fetchData() {
      // 直接调用API
    }
  },
  onLoad() {
    this.fetchData()
  }
}
</script>
```

#### 新代码
```vue
<template>
  <view>
    <text>{{title}}</text>
    <button @tap="fetchData">加载</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLanguage, useLoading } from '@/hooks';
import { dataService } from '@/services';
import { showToast } from '@/utils';

const { getText } = useLanguage();
const { withLoading } = useLoading();

const title = ref(getText('标题', '蒙古文标题'));
const list = ref([]);

const fetchData = async () => {
  const result = await withLoading(
    () => dataService.getList(),
    { loadingText: '加载中...', errorText: '加载失败' }
  );
  
  if (result?.code === 200) {
    list.value = result.data.list;
  }
};

onMounted(() => {
  fetchData();
});
</script>
```

## 常见迁移问题

### 问题1: 类型错误
如果遇到类型错误，请查看`src/types/index.d.ts`文件，确保使用正确的类型定义。

### 问题2: 服务方法找不到
确保对应的服务已经在服务层实现，并且已正确导入。可以检查`src/services/`目录下的文件。

### 问题3: 配置项访问错误
确保正确导入CONFIG，并使用正确的路径访问配置项。例如：`CONFIG.API.BASE_URL`。

## 建议迁移顺序

1. 先迁移工具函数和通用组件
2. 迁移服务层API调用
3. 迁移页面组件
4. 添加TypeScript类型

## 测试策略

在迁移过程中，建议采用以下测试策略：

1. 单元测试关键工具函数和服务
2. 集成测试确保API调用正常
3. 手动测试页面功能和交互
4. 回归测试确保原有功能正常

## 注意事项

- 迁移过程中保持功能不变，先求稳定再优化
- 遵循项目规范，保持代码风格一致
- 及时处理废弃的旧代码，避免代码冗余
- 适当添加注释，帮助理解代码意图 