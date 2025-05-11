# Cursor规则：前端变更生成后端任务清单

## 规则概述

当前端项目发生变更且涉及后端API接口变更时，Cursor将自动检测并协助生成标准化的后端任务清单，促进前后端团队高效协作。

## 触发条件

以下情况将触发后端任务清单生成：

1. 新增调用后端API的代码
2. 修改现有API调用的请求参数或响应处理
3. 删除API调用
4. 前端组件中使用新的数据结构，需要后端支持
5. 用户手动请求生成任务清单

## 任务清单生成流程

1. **检测API变更**：
   - 监控`.js`, `.ts`, `.vue`文件中与API相关的代码变更
   - 识别HTTP请求模式（如`this.$request`, `axios`, `fetch`等）
   - 分析请求URL、方法、参数和响应处理

2. **分析变更类型**：
   - 新增：检测新添加的API调用
   - 修改：比较API调用的参数、URL或响应处理变化
   - 删除：检测被移除的API调用

3. **生成任务清单**：
   - 使用模板创建新的任务清单文件
   - 填充API详情、请求参数、响应结构等信息
   - 保存到`doc/backend_tasks/`目录

4. **通知与确认**：
   - 通知前端开发人员确认任务清单
   - 允许手动调整和完善清单内容

## 命令与快捷键

- `/generate-backend-tasks`：手动触发后端任务清单生成
- `Alt+Shift+G`：快速生成当前文件相关的后端任务
- `/update-backend-task <task-id>`：更新现有任务清单

## 配置选项

在项目根目录的`.cursor-rules.json`文件中配置规则行为：

```json
{
  "backendTasks": {
    "enabled": true,
    "taskPath": "doc/backend_tasks",
    "templatePath": "doc/backend_tasks/templates/api_task_template.md",
    "autoDetect": true,
    "notifyOnChange": true,
    "apiPatterns": [
      "this.$request\\(",
      "uni\\.(request|getApp\\(\\)\\.config\\.globalProperties\\.$request)\\(",
      "axios\\.",
      "fetch\\("
    ],
    "filePatterns": [
      "**/*.vue",
      "**/*.js",
      "**/*.ts"
    ],
    "excludePatterns": [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**"
    ]
  }
}
```

## 使用指南

### 前端开发人员

1. **自动检测**：当你修改涉及API的代码并保存时，Cursor会提示是否需要生成任务清单
2. **手动生成**：使用命令`/generate-backend-tasks`手动触发
3. **确认与编辑**：检查自动生成的任务清单，根据需要进行编辑和完善
4. **提交任务**：确认无误后，提交任务清单给后端开发人员

### 后端开发人员

1. **接收任务**：从`doc/backend_tasks/`获取最新的任务清单
2. **实现API**：根据任务清单中的详细规范实现API
3. **更新状态**：实现完成后，更新任务清单中的状态
4. **通知前端**：API就绪后通知前端开发人员进行联调

## 最佳实践

1. **精确描述**：确保API的参数和响应结构描述清晰、准确
2. **包含示例**：提供请求和响应的实际示例，便于理解
3. **注明调用位置**：在任务清单中注明前端代码中调用此API的位置
4. **定期同步**：前后端团队定期同步API变更和实现进度
5. **版本控制**：将任务清单纳入版本控制，记录API演进历史

## 任务清单模板

任务清单使用标准模板，确保信息的完整性和一致性，详见`doc/backend_tasks/templates/api_task_template.md`

## 示例

参考`doc/backend_tasks/examples/health_records_api_task.md`了解实际的任务清单示例。

## 注意事项

1. 自动生成的任务清单可能不完整，需要人工确认和补充
2. 对于复杂的业务逻辑，建议在任务清单中提供详细说明
3. API变更可能影响现有功能，注意标注兼容性要求
4. 定期清理已完成的任务清单，保持目录整洁

## 相关资源

- [API设计指南](doc/api_design_guidelines.md)
- [前后端接口约定](doc/frontend_backend_contract.md)
- [API文档规范](doc/api_documentation_standards.md)

---

通过遵循这些规则，前后端团队可以更高效地协作，减少沟通成本，提高开发效率。 