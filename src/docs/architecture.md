# 项目架构文档

## 项目概述
本项目是一个基于 uni-app 开发的健康咨询平台，支持中蒙双语，主要面向内蒙古地区的牧民提供医疗健康服务。

## 技术栈
- 前端框架: Vue 3 + uni-app
- 状态管理: Vue 3 Composition API
- 网络请求: uni.request
- 国际化: vue-i18n
- 构建工具: Vite

## 项目结构
```
src/
  ├── api/             # 旧的API调用（已替换为services）
  ├── assets/          # 静态资源
  ├── components/      # 公共组件
  ├── config/          # 配置文件
  ├── docs/            # 项目文档
  ├── hooks/           # 自定义Hooks
  ├── i18n/            # 国际化资源
  ├── pages/           # 页面文件
  ├── services/        # 服务层
  ├── static/          # 静态资源
  ├── types/           # TypeScript类型定义
  ├── utils/           # 工具函数
  ├── App.vue          # 应用入口组件
  ├── main.js          # 应用入口文件
  ├── manifest.json    # uni-app配置文件
  ├── pages.json       # 页面配置
  └── uni.scss         # 全局样式
```

## 核心模块

### 1. 配置模块 (config)
集中管理项目配置，包括API地址、超时设置、存储键名等。
```js
// 使用示例
import CONFIG from '@/config';
console.log(CONFIG.API.BASE_URL);
```

### 2. 工具函数 (utils)
提供各类实用工具函数，如请求封装、格式化、验证等。
```js
// 使用示例
import { formatDate, request, showToast } from '@/utils';
```

### 3. 服务层 (services)
处理与后端API交互的逻辑，按业务模块组织。
```js
// 使用示例
import { authService } from '@/services';
const result = await authService.login(account, password);
```

### 4. Hooks (hooks)
提供可复用的状态逻辑。
```js
// 使用示例
import { useAuth } from '@/hooks';
const { login, userInfo } = useAuth();
```

### 5. 类型定义 (types)
TypeScript类型定义，提供类型安全。
```ts
// 使用示例
import { TUserInfo } from '@/types';
const userInfo: TUserInfo = { ... };
```

## 主要功能模块

### 1. 认证模块
处理用户登录、注册、找回密码等功能。
- 相关文件: `services/auth.service.js`, `hooks/useAuth.js`

### 2. 用户模块
处理用户信息相关功能。
- 相关文件: `services/user.service.js`

### 3. 健康模块
处理健康报告、健康文章等功能。
- 相关文件: `services/health.service.js`

### 4. 问诊模块
处理在线问诊会话、消息等功能。
- 相关文件: `services/consult.service.js`

### 5. 国际化模块
处理中蒙双语切换功能。
- 相关文件: `i18n/index.js`, `utils/language.js`, `hooks/useLanguage.js`

## 最佳实践

### 1. 页面组件结构
```vue
<template>
  <!-- 页面模板 -->
</template>

<script setup>
// 导入依赖
import { ref, onMounted } from 'vue';
import { useAuth, useLanguage } from '@/hooks';
import { healthService } from '@/services';
import { showToast, formatDate } from '@/utils';

// 使用Hooks
const { userInfo } = useAuth();
const { currentLang, getText } = useLanguage();

// 响应式数据
const list = ref([]);
const isLoading = ref(false);

// 方法定义
const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await healthService.getReports();
    if (res.code === 200) {
      list.value = res.data.list;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    showToast('加载失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss">
/* 组件样式 */
</style>
```

### 2. 响应式与状态管理
- 使用 `ref` 和 `reactive` 管理组件状态
- 使用自定义 Hooks 共享状态逻辑
- 复杂状态考虑使用 Pinia 等状态管理库

### 3. 网络请求
- 统一使用 `services` 层处理API请求
- 处理请求错误和加载状态
- 使用 `useLoading` hook简化加载状态管理

```js
import { useLoading } from '@/hooks';

const { withLoading } = useLoading();

const result = await withLoading(
  () => healthService.getReports(),
  { loadingText: '加载中...', errorText: '加载失败' }
);
```

### 4. 国际化
- 使用 `useLanguage` hook管理语言
- 使用 `getText` 函数动态获取中蒙文本

```js
const { getText } = useLanguage();
const title = getText('健康报告', 'Эрүүл мэндийн тайлан');
```

## 代码规范
- 遵循项目规范文件（.cursorrules）中的规则
- 组件名使用PascalCase命名
- 函数名使用camelCase命名
- TypeScript类型定义使用T前缀
- 接口使用I前缀 