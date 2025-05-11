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


## 零基础用户部署指南

本指南适合对前端开发不太熟悉的用户，帮助您从零开始部署和运行敕勒云诊前端项目。

### 1. 环境安装

首先，您需要安装以下基础软件：

1. **安装Git**
   - 访问 [Git官网](https://git-scm.com/downloads) 下载并安装适合您操作系统的版本
   - 安装完成后，打开命令行（Windows用户打开PowerShell或命令提示符，Mac用户打开Terminal）
   - 输入 `git --version` 确认安装成功

2. **安装Node.js**
   - 访问 [Node.js官网](https://nodejs.org/) 下载并安装LTS版本（长期支持版）
   - 安装完成后，在命令行中输入 `node -v` 和 `npm -v` 确认安装成功

3. **安装pnpm**（推荐的包管理器）
   - 在命令行中运行：`npm install -g pnpm`
   - 输入 `pnpm -v` 确认安装成功

4. **安装HBuilderX**（用于运行和打包项目）
   - 访问 [HBuilderX官网](https://www.dcloud.io/hbuilderx.html) 下载并安装App开发版
   - 启动HBuilderX确认安装成功

### 2. 获取项目代码

1. **克隆GitHub仓库**
   - 打开命令行，导航到您想存放项目的目录：`cd 您想要的目录路径`
   - 运行以下命令克隆项目：
   ```bash
   git clone git@github.com:YYYYXL1004/Nomad-Health-AI-FrontEnd.git
   ```
   - 如果您使用HTTPS方式，可以使用：
   ```bash
   git clone https://github.com/YYYYXL1004/Nomad-Health-AI-FrontEnd.git
   ```

2. **进入项目目录**
   ```bash
   cd Nomad-Health-AI-FrontEnd
   ```

### 3. 安装项目依赖

在项目目录中，运行以下命令安装所有依赖：
```bash
pnpm install
```

### 4. 配置项目

1. **配置环境变量**
   - 在项目根目录找到 `.env.example` 文件（如果存在）
   - 复制为 `.env.local` 文件，并按需修改配置
   - 确保API地址设置正确

2. **检查配置文件**
   - 打开 `src/config/` 目录下的配置文件
   - 根据您的实际环境调整相关配置

### 5. 运行项目

有两种方式可以运行项目：

**方式一：使用命令行**
```bash
# 运行H5版本
pnpm dev:h5
```

**方式二：使用HBuilderX**
1. 打开HBuilderX
2. 选择"文件" > "导入" > "从本地目录导入"
3. 选择您克隆的项目目录
4. 项目导入后，点击运行按钮选择运行到浏览器或模拟器

### 6. 构建与发布

**构建H5版本**
```bash
pnpm build:h5
```
构建完成后，`dist/build/h5` 目录包含了可部署的文件。

**构建小程序版本**
```bash
# 微信小程序
pnpm build:mp-weixin
```

**发布APP**
请参考上方的 "打包APK" 章节。

### 7. 部署到服务器

**静态网站方式部署**
1. 将构建好的H5版本文件上传至您的Web服务器
2. 配置服务器的Web服务（如Nginx、Apache等）
3. 配置正确的URL重写规则以支持前端路由

**简易部署示例（Nginx）**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/dist/build/h5;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 8. 常见问题解答

1. **运行时出现依赖错误**
   - 尝试删除 `node_modules` 目录，然后重新运行 `pnpm install`
   
2. **API无法连接**
   - 检查配置文件中的API地址是否正确
   - 确认后端服务是否已启动并可访问
   
3. **页面样式异常**
   - 检查您的浏览器是否为最新版本
   - 尝试清除浏览器缓存

4. **如何更新到最新版本**
   ```bash
   git pull
   pnpm install
   ```

如需更多帮助，请参考项目文档或联系项目维护者。

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


## 文档
详细文档请查看 `src/docs/` 目录：
- [项目架构文档](src/docs/architecture.md)
- [迁移指南](src/docs/migration-guide.md)
- [前后端接口文档](src/docs/api-interface.md)
- [APK打包详细指南](src/docs/apk-packaging.md)
