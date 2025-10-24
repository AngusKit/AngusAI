# AngusAI 后端接口文档

基于Figma UI设计倒推的后端接口定义，遵循RESTful API设计规范。

## 📁 目录结构

```
apis-md/
├── README.md                    # 接口文档总览
├── 01-auth.md                   # 认证授权模块
├── 02-dashboard.md              # 工作台模块
├── 03-chat.md                   # AI对话模块
├── 04-applications.md           # 应用管理模块
├── 05-knowledge-base.md         # 知识库模块
├── 06-dataset.md                # 数据集模块
├── 07-workflow.md               # 工作流模块
├── 08-prompt-library.md         # 提示词库模块
├── 09-plugin-market.md          # 插件市场模块
├── 10-model-management.md       # 模型管理模块
├── 11-api-keys.md               # API密钥管理模块
├── 12-team.md                   # 团队管理模块
├── 13-billing.md                # 计费订阅模块
├── 14-settings.md               # 系统设置模块
└── common-types.md              # 公共类型定义
```

## 🎯 设计原则

### 1. RESTful 规范

- 使用标准HTTP方法：GET, POST, PUT, PATCH, DELETE
- 资源路径使用复数名词，如 `/api/applications`
- 使用HTTP状态码表示响应状态

### 2. 命名规范

- **路径**：小写单词，使用连字符分隔，如 `/api/knowledge-bases`
- **参数**：小驼峰命名，如 `pageSize`, `createdDate`
- **响应字段**：小驼峰命名，保持一致性

### 3. 统一响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  },
  "timestamp": 1706889600000
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "name",
      "message": "名称不能为空"
    }
  ],
  "timestamp": 1706889600000
}
```

#### 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": 1706889600000
}
```

## 📊 状态码规范

| 状态码 | 说明                      |
| ------ | ------------------------- |
| 200    | 请求成功                  |
| 201    | 创建成功                  |
| 204    | 删除成功（无返回内容）    |
| 400    | 请求参数错误              |
| 401    | 未授权（token无效或过期） |
| 403    | 禁止访问（无权限）        |
| 404    | 资源不存在                |
| 409    | 资源冲突（如重复创建）    |
| 422    | 验证失败                  |
| 500    | 服务器内部错误            |
| 503    | 服务暂时不可用            |

## 🔐 认证方式

所有API（除登录/注册外）都需要在请求头中携带JWT Token：

```http
Authorization: Bearer <JWT_TOKEN>
```

## 📌 公共参数

### 分页参数

```typescript
{
  page?: number;        // 页码，默认1
  pageSize?: number;    // 每页数量，默认20
  orderBy?: string;      // 排序字段
  orderSort?: 'asc' | 'desc';  // 排序方向，默认desc
}
```

### 搜索参数

```typescript
{
  keyword?: string;     // 关键词搜索
  searchFields?: string[];  // 搜索字段
}
```

### 过滤参数

```typescript
{
  filters?: {
    [field: string]: any;  // 动态过滤条件
  }
}
```

## 📝 时间格式

- 统一使用Unix时间戳（毫秒）
- ISO 8601格式作为备选：`2024-02-02T12:00:00Z`

## 🔄 版本控制

- 当前版本：v1
- API路径包含版本号：`/api/v1/...`
- 向后兼容原则

## 🌐 国际化

- 支持语言：zh-CN（简体中文）、zh-TW（繁体中文）、en-US（英语）、ja-JP（日语）、ko-KR（韩语）
- 请求头指定语言：`Accept-Language: zh-CN`

## 📱 客户端类型

请求头标识客户端：

```http
X-Client-Type: web | mobile | desktop
X-Client-Version: 1.0.0
```

## 🔗 相关文档

- [Figma设计稿](#)
- [前端项目仓库](#)
- [API测试环境](#)
- [开发者指南](#)

---

**文档版本**：v2.0.0 🎉  
**最后更新**：2024-02-02（全部14个模块已完成！221个接口）  
**维护团队**：AngusAI开发团队  
**完成度**：100% ✅
