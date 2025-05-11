# 敕勒云诊 - 内蒙古牧民健康咨询平台 (前端)

## 项目简介
敕勒云诊是一个基于Vue3+Flask实现的跨平台应用，旨在为内蒙古地区的牧民提供便捷的医疗健康服务。平台支持中蒙双语，实现了健康咨询、在线问诊、健康报告查看等核心功能。本仓库为项目的前端部分。

## 技术栈
- 前端框架: Vue 3
- 跨平台解决方案: uni-app
- UI组件库: uView UI
- 状态管理: Pinia
- 网络请求: uni.request / axios
- 国际化: vue-i18n
- 构建工具: Vite
- 后端技术: Flask (Python)

## 项目特点
- 支持中蒙双语切换
- 适配多端（H5、微信小程序、App）
- 遵循现代前端架构设计
- 完善的类型系统支持
- 与Flask后端无缝对接

## 最近更新（2024年5月）
项目已完成架构重构，主要改进包括：
- 采用分层架构，提高代码可维护性
- 引入TypeScript类型系统
- 抽象通用逻辑为Hooks
- 统一配置管理
- 规范化代码风格
- 优化用户界面交互体验

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- HBuilderX >= 3.6.0
- Android Studio (用于打包APK)

### 安装依赖
```bash
# 推荐使用pnpm
pnpm install
```

### 开发
```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# 支付宝小程序
pnpm dev:mp-alipay
```

### 构建
```bash
# H5
pnpm build:h5

# 微信小程序
pnpm build:mp-weixin

# 支付宝小程序
pnpm build:mp-alipay
```

### 打包APK
1. **环境准备**
   - 安装 Android Studio
   - 下载并配置 JDK（推荐版本 1.8 或 11）
   - 配置 Android SDK 环境变量

2. **使用HBuilderX打包**
   - 打开HBuilderX，点击菜单栏的「发行」
   - 选择「原生App-云打包」
   - 选择「Android」平台
   - 配置证书信息（可使用HBuilder云端证书）
   - 配置应用信息（应用名称、包名、版本号等）
   - 点击「打包」按钮

3. **离线打包（高级）**
   - 在HBuilderX中选择「发行」-「原生App-本地打包」
   - 导出Android本地打包资源
   - 使用Android Studio打开本地打包工程
   - 修改相关配置（如图标、启动页、权限等）
   - 执行Build APK操作

4. **Android App Bundle打包**
   - 在HBuilderX中选择「发行」-「原生App-云打包」
   - 打包类型选择「Android App Bundle」
   - 按照提示完成后续操作

5. **注意事项**
   - 确保APP图标和启动页符合规范
   - 合理配置应用权限
   - 打包前务必全面测试H5版本
   - 打包APK前需要先配置好数字签名证书
   - 线上发布前需将API地址切换到生产环境

## 项目结构
```
src/
  ├── api/             # API调用接口
  ├── assets/          # 静态资源
  ├── components/      # 公共组件
  ├── config/          # 配置文件
  ├── docs/            # 项目文档
  ├── hooks/           # 自定义Hooks
  ├── i18n/            # 国际化资源
  ├── pages/           # 页面文件
  ├── services/        # 服务层（与Flask后端交互）
  ├── static/          # 静态资源
  ├── store/           # Pinia状态管理
  ├── types/           # TypeScript类型定义
  ├── utils/           # 工具函数
  └── App.vue          # 应用入口组件
```

## 核心功能
- 用户认证：登录、注册、找回密码
- 健康报告：查看、分析健康指标
- 健康文章：浏览健康知识
- 在线问诊：与医生/AI在线咨询
- 个人中心：管理个人信息和设置
- 预约挂号：线上预约医生
- 健康档案：个人健康数据管理

## 国内依赖镜像设置
```bash
# npm
npm config set registry https://registry.npmmirror.com/

# yarn
yarn config set registry https://registry.npmmirror.com

# pnpm
pnpm config set registry https://registry.npmmirror.com
```

## 文档
详细文档请查看 `src/docs/` 目录：
- [项目架构文档](src/docs/architecture.md)
- [迁移指南](src/docs/migration-guide.md)
- [前后端接口文档](src/docs/api-interface.md)
- [APK打包详细指南](src/docs/apk-packaging.md)
