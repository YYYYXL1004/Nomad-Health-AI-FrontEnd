#!/usr/bin/env node

/**
 * 前端变更生成后端任务清单脚本
 * 
 * 此脚本用于检测前端代码变更，并自动生成后端任务清单
 * 可以通过命令行手动运行，也可以集成到版本控制系统的钩子中
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
let config = {
  backendTasks: {
    enabled: true,
    taskPath: 'doc/backend_tasks',
    templatePath: 'doc/backend_tasks/templates/api_task_template.md',
    autoDetect: true,
    notifyOnChange: true,
    apiPatterns: [
      "this\\.$request\\(",
      "uni\\.(request|getApp\\(\\)\\.config\\.globalProperties\\.$request)\\(",
      "axios\\.",
      "fetch\\("
    ],
    filePatterns: [
      "**/*.vue",
      "**/*.js",
      "**/*.ts"
    ],
    excludePatterns: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**"
    ]
  }
};

// 尝试从.cursor-rules.json加载配置
try {
  const cursorRulesPath = path.resolve(process.cwd(), '.cursor-rules.json');
  if (fs.existsSync(cursorRulesPath)) {
    const cursorRules = JSON.parse(fs.readFileSync(cursorRulesPath, 'utf8'));
    config = { ...config, ...cursorRules };
  }
} catch (error) {
  console.error('无法加载.cursor-rules.json配置文件:', error.message);
}

// 创建目标目录（如果不存在）
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const taskPath = path.resolve(process.cwd(), config.backendTasks.taskPath);
ensureDirectoryExists(taskPath);

// 获取最近修改的文件
const getChangedFiles = () => {
  try {
    // 获取git未提交的修改文件
    const stdout = execSync('git diff --name-only --cached').toString();
    return stdout.split('\n').filter(file => file.trim() !== '');
  } catch (error) {
    console.error('获取修改文件失败:', error.message);
    return [];
  }
};

// 检查文件是否匹配模式
const isFileMatched = (file, patterns) => {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern);
    return regex.test(file);
  });
};

// 提取API调用
const extractApiCalls = (fileContent) => {
  const apiCalls = [];
  const apiPatterns = config.backendTasks.apiPatterns;
  
  apiPatterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'g');
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
      // 简单的API调用解析，实际项目中可能需要更复杂的解析逻辑
      const startIndex = match.index;
      let endIndex = startIndex;
      let openParenCount = 0;
      
      for (let i = startIndex; i < fileContent.length; i++) {
        if (fileContent[i] === '(') {
          openParenCount++;
        } else if (fileContent[i] === ')') {
          openParenCount--;
          if (openParenCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      const apiCallStr = fileContent.substring(startIndex, endIndex);
      
      // 尝试提取URL和方法
      let url = '';
      let method = 'GET';
      
      // 提取URL（简单实现，实际需要更复杂的解析）
      const urlMatch = apiCallStr.match(/['"]([^'"]*)['"]/);
      if (urlMatch) {
        url = urlMatch[1];
      }
      
      // 提取方法
      if (apiCallStr.includes('method:') || apiCallStr.includes('method =')) {
        const methodMatch = apiCallStr.match(/method:[ \t]*['"]([A-Z]+)['"]/);
        if (methodMatch) {
          method = methodMatch[1];
        }
      }
      
      apiCalls.push({
        call: apiCallStr,
        url,
        method
      });
    }
  });
  
  return apiCalls;
};

// 生成任务清单
const generateTaskList = (changedFiles) => {
  const apiChanges = [];
  
  changedFiles.forEach(file => {
    if (!isFileMatched(file, config.backendTasks.filePatterns) || 
        isFileMatched(file, config.backendTasks.excludePatterns)) {
      return;
    }
    
    try {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const apiCalls = extractApiCalls(fileContent);
        
        if (apiCalls.length > 0) {
          apiChanges.push({
            file,
            apis: apiCalls
          });
        }
      }
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error.message);
    }
  });
  
  return apiChanges;
};

// 创建任务清单文件
const createTaskFile = (apiChanges) => {
  if (apiChanges.length === 0) {
    console.log('未检测到API变更，不创建任务清单');
    return;
  }
  
  try {
    // 读取模板
    const templatePath = path.resolve(process.cwd(), config.backendTasks.templatePath);
    let template = '';
    
    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      console.warn('未找到模板文件，使用默认模板');
      template = `# 后端任务清单\n\n## 基本信息\n\n- **任务创建时间**：{timestamp}\n- **前端变更描述**：\n- **优先级**：\n- **预计工作量**：\n\n## API变更详情\n\n{api_details}\n`;
    }
    
    // 替换模板中的变量
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    template = template.replace('{YYYY-MM-DD HH:MM:SS}', timestamp);
    
    // 生成API详情部分
    let apiDetailsContent = '';
    apiChanges.forEach((change, index) => {
      change.apis.forEach((api, apiIndex) => {
        apiDetailsContent += `### ${index+1}.${apiIndex+1} API\n\n`;
        apiDetailsContent += `- **请求方式**：${api.method || '待确定'}\n`;
        apiDetailsContent += `- **接口路径**：${api.url || '待确定'}\n`;
        apiDetailsContent += `- **变更类型**：新增\n`;
        apiDetailsContent += `- **接口描述**：\n`;
        apiDetailsContent += `- **所属模块**：\n`;
        apiDetailsContent += `- **前端调用位置**：${change.file}\n\n`;
        
        apiDetailsContent += `#### 请求参数\n\n`;
        apiDetailsContent += `| 参数名 | 类型 | 是否必须 | 描述 | 示例值 |\n`;
        apiDetailsContent += `|-------|------|---------|------|--------|\n`;
        apiDetailsContent += `| | | | | |\n\n`;
        
        apiDetailsContent += `#### 响应参数\n\n`;
        apiDetailsContent += `| 参数名 | 类型 | 描述 | 示例值 |\n`;
        apiDetailsContent += `|-------|------|------|--------|\n`;
        apiDetailsContent += `| code | integer | 状态码 | 200 |\n`;
        apiDetailsContent += `| message | string | 状态描述 | "success" |\n`;
        apiDetailsContent += `| data | object | 返回数据 | {} |\n\n`;
        
        apiDetailsContent += `#### 响应示例\n\n`;
        apiDetailsContent += `\`\`\`json\n{\n  "code": 200,\n  "message": "success",\n  "data": {}\n}\n\`\`\`\n\n`;
      });
    });
    
    // 将API详情插入模板
    if (template.includes('{api_details}')) {
      template = template.replace('{api_details}', apiDetailsContent);
    } else {
      const apiDetailMarker = '## API变更详情';
      const apiDetailIndex = template.indexOf(apiDetailMarker);
      if (apiDetailIndex !== -1) {
        template = template.substring(0, apiDetailIndex + apiDetailMarker.length) + 
                  '\n\n' + apiDetailsContent + 
                  template.substring(apiDetailIndex + apiDetailMarker.length);
      } else {
        template += '\n\n## API变更详情\n\n' + apiDetailsContent;
      }
    }
    
    // 生成文件名
    const dateStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    const taskFileName = `task_${dateStr}.md`;
    const taskFilePath = path.join(taskPath, taskFileName);
    
    // 写入文件
    fs.writeFileSync(taskFilePath, template, 'utf8');
    console.log(`任务清单已生成: ${taskFilePath}`);
    
    return taskFilePath;
  } catch (error) {
    console.error('创建任务清单文件失败:', error.message);
    return null;
  }
};

// 主流程
const main = () => {
  console.log('开始检测API变更...');
  
  // 获取变更文件
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('未检测到文件变更');
    return;
  }
  
  console.log(`检测到 ${changedFiles.length} 个变更文件`);
  
  // 生成任务列表
  const apiChanges = generateTaskList(changedFiles);
  if (apiChanges.length === 0) {
    console.log('未检测到API变更');
    return;
  }
  
  console.log(`检测到 ${apiChanges.length} 个文件中有API变更`);
  
  // 创建任务清单文件
  const taskFilePath = createTaskFile(apiChanges);
  if (taskFilePath) {
    console.log('后端任务清单生成成功!');
  } else {
    console.log('后端任务清单生成失败');
  }
};

// 执行主流程
main(); 