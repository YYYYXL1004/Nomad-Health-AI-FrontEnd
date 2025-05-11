# 后端任务清单：健康记录模块API

## 基本信息

- **任务创建时间**：2023-11-10 14:30:00
- **前端变更描述**：健康记录页面新增健康报告查询和详情功能
- **优先级**：高
- **预计工作量**：2人/天
- **提交人**：张三

## API变更详情

### 1. 获取健康报告列表

- **请求方式**：GET
- **接口路径**：/api/health/reports
- **变更类型**：新增
- **接口描述**：获取用户的健康报告列表，支持分页和筛选
- **所属模块**：健康记录
- **前端调用位置**：src/pages/my/health-records.vue:208

#### 请求参数

| 参数名 | 类型 | 是否必须 | 描述 | 示例值 |
|-------|------|---------|------|--------|
| page | integer | 否 | 页码，默认为1 | 1 |
| limit | integer | 否 | 每页记录数，默认为10 | 10 |
| status | string | 否 | 报告状态筛选，可选值：normal,attention,warning,low | "normal" |
| startDate | string | 否 | 开始日期筛选 | "2023-01-01" |
| endDate | string | 否 | 结束日期筛选 | "2023-12-31" |

#### 响应参数

| 参数名 | 类型 | 描述 | 示例值 |
|-------|------|------|--------|
| code | integer | 状态码 | 200 |
| message | string | 状态描述 | "success" |
| data | object | 返回数据 | {} |
| data.total | integer | 总记录数 | 20 |
| data.pages | integer | 总页数 | 2 |
| data.list | array | 报告列表 | [] |
| data.list[].id | string | 报告ID | "1" |
| data.list[].title | string | 报告标题 | "常规体检报告" |
| data.list[].summary | string | 报告摘要 | "整体健康状态良好" |
| data.list[].date | string | 报告日期 | "2023-06-15" |
| data.list[].status | string | 报告状态 | "normal" |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "pages": 2,
    "list": [
      {
        "id": "1",
        "title": "常规体检报告",
        "summary": "整体健康状态良好，建议增加运动量",
        "date": "2023-06-15",
        "status": "normal"
      },
      {
        "id": "2",
        "title": "慢性病风险评估",
        "summary": "低风险，请保持健康生活方式",
        "date": "2023-04-20",
        "status": "low"
      }
    ]
  }
}
```

### 2. 获取健康报告详情

- **请求方式**：GET
- **接口路径**：/api/health/report/{id}
- **变更类型**：新增
- **接口描述**：获取特定健康报告的详细内容
- **所属模块**：健康记录
- **前端调用位置**：src/pages/health/report-detail.vue

#### 请求参数

| 参数名 | 类型 | 是否必须 | 描述 | 示例值 |
|-------|------|---------|------|--------|
| id | string | 是 | 报告ID | "1" |

#### 响应参数

| 参数名 | 类型 | 描述 | 示例值 |
|-------|------|------|--------|
| code | integer | 状态码 | 200 |
| message | string | 状态描述 | "success" |
| data | object | 报告详情 | {} |
| data.id | string | 报告ID | "1" |
| data.title | string | 报告标题 | "常规体检报告" |
| data.date | string | 报告日期 | "2023-06-15" |
| data.hospital | string | 医院名称 | "北京协和医院" |
| data.doctorName | string | 医生姓名 | "王医生" |
| data.status | string | 报告状态 | "normal" |
| data.summary | string | 报告摘要 | "整体健康状态良好" |
| data.content | array | 报告内容 | [] |
| data.content[].category | string | 检查类别 | "血常规" |
| data.content[].items | array | 检查项目 | [] |
| data.content[].items[].name | string | 项目名称 | "白细胞计数" |
| data.content[].items[].value | string | 检查结果 | "6.5" |
| data.content[].items[].unit | string | 单位 | "10^9/L" |
| data.content[].items[].reference | string | 参考范围 | "3.5-9.5" |
| data.content[].items[].status | string | 状态 | "normal" |
| data.recommendations | array | 健康建议 | [] |
| data.recommendations[].content | string | 建议内容 | "增加运动量" |
| data.recommendations[].importance | string | 重要性 | "high" |

#### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "1",
    "title": "常规体检报告",
    "date": "2023-06-15",
    "hospital": "北京协和医院",
    "doctorName": "王医生",
    "status": "normal",
    "summary": "整体健康状态良好，建议增加运动量",
    "content": [
      {
        "category": "血常规",
        "items": [
          {
            "name": "白细胞计数",
            "value": "6.5",
            "unit": "10^9/L",
            "reference": "3.5-9.5",
            "status": "normal"
          },
          {
            "name": "红细胞计数",
            "value": "4.8",
            "unit": "10^12/L",
            "reference": "4.3-5.8",
            "status": "normal"
          }
        ]
      },
      {
        "category": "生化检查",
        "items": [
          {
            "name": "血糖",
            "value": "5.5",
            "unit": "mmol/L",
            "reference": "3.9-6.1",
            "status": "normal"
          }
        ]
      }
    ],
    "recommendations": [
      {
        "content": "建议每周进行3-5次中等强度的有氧运动，每次30分钟以上",
        "importance": "high"
      },
      {
        "content": "保持均衡饮食，减少高脂肪食物摄入",
        "importance": "medium"
      }
    ]
  }
}
```

## 后端实现建议

- **数据库变更**：需要创建health_reports表，存储健康报告的基本信息；创建health_report_details表，存储报告详细内容；创建health_recommendations表，存储健康建议
- **缓存策略**：健康报告列表可使用Redis缓存，缓存时间建议设置为10分钟
- **权限控制**：用户只能查看自己的健康报告，需要进行用户身份验证
- **性能要求**：报告列表接口响应时间控制在200ms以内，报告详情接口响应时间控制在300ms以内
- **注意事项**：报告内容可能较大，建议实现分段加载或压缩传输

## 联调计划

- **前端Mock**：已实现基本的Mock数据
- **预计后端完成时间**：2023-11-15
- **联调时间安排**：2023-11-16至2023-11-17

## 任务状态跟踪

- [ ] 后端接口设计确认
- [ ] 接口开发完成
- [ ] 单元测试通过
- [ ] 接口文档更新
- [ ] 前后端联调完成
- [ ] 测试环境部署验证
- [ ] 任务完成 