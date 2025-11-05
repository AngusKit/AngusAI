# 接口集管理模块 API

**Figma来源**：接口集页面、创建对话框、导入对话框、接口配置、安全配置  
**模块说明**：管理API接口集合、支持OpenAPI/Swagger/Postman导入、接口认证配置等功能

## 目录
- [获取接口集列表](#获取接口集列表)
- [创建接口集](#创建接口集)
- [导入接口集](#导入接口集)
- [获取接口集详情](#获取接口集详情)
- [更新接口集](#更新接口集)
- [删除接口集](#删除接口集)
- [接口端点管理](#接口端点管理)
- [导出OpenAPI规范](#导出openapi规范)
- [安全配置管理](#安全配置管理)

---

## 获取接口集列表

**接口路径**：`GET /api/v1/api-collections`  
**接口说明**：获取所有API接口集列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;                     // 页码，默认1
  pageSize?: number;                 // 每页数量，默认10
  keyword?: string;                  // 搜索关键词（名称、描述）
  source?: 'openapi' | 'swagger' | 'postman' | 'manual';  // 来源筛选
  visibility?: 'private' | 'team' | 'public';  // 可见性筛选
  sortBy?: 'name' | 'createdAt' | 'updatedAt';  // 排序字段
  sortOrder?: 'asc' | 'desc';        // 排序方向
}
```

**Figma对应**：
- `keyword` → 搜索框
- `source` → 来源筛选器（OpenAPI/Swagger/Postman）
- `visibility` → 可见性筛选
- 接口集卡片列表

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: string;                  // 接口集ID
        name: string;                // 接口集名称
        description: string;         // 描述
        
        // 来源信息
        source: 'openapi' | 'swagger' | 'postman' | 'manual';
        sourceLabel: string;         // "OpenAPI 3.0"
        sourceIcon: string;          // 图标标识
        
        // 统计信息
        endpointsCount: number;      // 接口端点总数
        enabledCount: number;        // 已启用的接口数
        
        // 可见性
        visibility: 'private' | 'team' | 'public';
        visibilityLabel: string;     // "私有"
        
        // 时间
        createdAt: number;
        createdDate: string;         // "2024-01-15"
        updatedAt: number;
        updatedDate: string;
        lastUsedAt?: number;
        
        // 配置状态
        hasServerConfig: boolean;    // 是否配置了服务器
        hasSecurityConfig: boolean;  // 是否配置了安全认证
        
        // 拥有者
        ownerId: number;
        ownerName: string;
      }
    ],
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 接口集卡片网格
- 每个卡片显示：名称、描述、来源图标、接口数量、可见性、创建时间

---

## 创建接口集

**接口路径**：`POST /api/v1/api-collections`  
**接口说明**：手动创建一个空的API接口集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 请求参数

```typescript
{
  name: string;                      // 必填|接口集名称|maxLength:100
  description?: string;              // 可选|描述|maxLength:500
  source?: 'manual';                 // 来源，手动创建时固定为manual
  visibility?: 'private' | 'team' | 'public';  // 可见性，默认private
  
  // 可选：服务器配置
  serverConfig?: {
    url: string;                     // 服务器地址
    description?: string;            // 描述
  };
  
  // 可选：安全配置
  securityConfig?: SecurityConfig;   // 见下方定义
}
```

**Figma对应**：
- 创建接口集对话框
- 名称输入框
- 描述输入框
- 可见性选择器

### 响应数据

```typescript
{
  code: 201,
  message: "接口集创建成功",
  data: {
    id: string;
    name: string;
    description: string;
    source: string;
    visibility: string;
    endpointsCount: 0;
    createdAt: number;
  },
  timestamp: 1730649625000
}
```

---

## 导入接口集

**接口路径**：`POST /api/v1/api-collections/import`  
**接口说明**：从OpenAPI/Swagger/Postman文件导入接口集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  file: File;                        // 必填|上传的文件
  type: 'openapi' | 'swagger' | 'postman';  // 必填|文件类型
  name?: string;                     // 可选|自定义名称（不填则使用文件中的名称）
  visibility?: 'private' | 'team' | 'public';  // 可见性
  
  // 导入策略
  importStrategy: {
    conflictStrategy: 'overwrite' | 'ignore' | 'merge';  // 冲突处理策略
    importSecurity: boolean;         // 是否导入安全配置
    importServers: boolean;          // 是否导入服务器配置
    importTags: boolean;             // 是否导入标签
    enableByDefault: boolean;        // 默认启用所有接口
  };
}
```

**Figma对应**：
- 导入按钮
- 导入对话框
- 文件选择器
- 导入策略配置
- 冲突处理选项

### 响应数据

```typescript
{
  code: 201,
  message: "接口集导入成功",
  data: {
    collectionId: string;
    name: string;
    source: string;
    
    // 导入统计
    importStats: {
      totalEndpoints: number;        // 总端点数
      importedEndpoints: number;     // 成功导入
      skippedEndpoints: number;      // 跳过（冲突）
      errors: number;                // 错误数
    };
    
    // 导入详情
    importDetails: {
      endpoint: string;
      status: 'imported' | 'skipped' | 'error';
      reason?: string;
    }[];
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. **支持的文件格式**：
   - OpenAPI 3.0 (.json, .yaml, .yml)
   - Swagger 2.0 (.json, .yaml)
   - Postman Collection v2.1 (.json)

2. **冲突处理**：
   - `overwrite`：覆盖现有接口
   - `ignore`：跳过重复接口
   - `merge`：合并配置

3. **文件大小限制**：最大10MB

---

## 获取接口集详情

**接口路径**：`GET /api/v1/api-collections/:id`  
**接口说明**：获取指定接口集的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string;                        // 接口集ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 基本信息
    id: string;
    name: string;
    description: string;
    source: string;
    visibility: string;
    
    // 统计
    endpointsCount: number;
    enabledCount: number;
    
    // 服务器配置
    serverConfig?: {
      url: string;
      description?: string;
    };
    
    // 安全配置
    securityConfig?: SecurityConfig;
    
    // 接口端点列表
    endpoints: APIEndpoint[];        // 见下方定义
    
    // 标签统计
    tags: {
      name: string;
      count: number;
    }[];
    
    // 分类统计
    categories: {
      name: string;
      count: number;
    }[];
    
    // 时间信息
    createdAt: number;
    updatedAt: number;
    lastUsedAt?: number;
    
    // 拥有者信息
    owner: {
      id: number;
      name: string;
      avatar?: string;
    };
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 接口集详情页
- 接口端点列表
- 服务器配置显示
- 安全配置显示
- 标签和分类统计

---

## 更新接口集

**接口路径**：`PATCH /api/v1/api-collections/:id`  
**接口说明**：更新接口集信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 路径参数

```typescript
{
  id: string;                        // 接口集ID
}
```

### 请求参数

```typescript
{
  name?: string;                     // 名称
  description?: string;              // 描述
  visibility?: 'private' | 'team' | 'public';  // 可见性
  serverConfig?: {
    url?: string;
    description?: string;
  };
  securityConfig?: SecurityConfig;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "接口集已更新",
  data: {
    id: string;
    name: string;
    description: string;
    updatedAt: number;
  },
  timestamp: 1730649625000
}
```

---

## 删除接口集

**接口路径**：`DELETE /api/v1/api-collections/:id`  
**接口说明**：删除指定的接口集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string;                        // 接口集ID
}
```

### 查询参数

```typescript
{
  force?: boolean;                   // 强制删除（即使被引用）
}
```

### 响应数据

```typescript
{
  code: 204,
  message: "接口集已删除",
  timestamp: 1730649625000
}
```

### 业务规则

1. 只有owner可以删除
2. 如果接口集被工作流引用，需要force=true才能删除
3. 删除后无法恢复

---

## 接口端点管理

### 获取端点列表

**接口路径**：`GET /api/v1/api-collections/:collectionId/endpoints`  
**接口说明**：获取接口集的端点列表

#### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;                  // 搜索名称、路径
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  category?: string;                 // 分类筛选
  tag?: string;                      // 标签筛选
  enabled?: boolean;                 // 启用状态筛选
  sortBy?: 'name' | 'method' | 'lastUsed';
  sortOrder?: 'asc' | 'desc';
}
```

#### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: APIEndpoint[];            // 见下方定义
    pagination: Pagination;
  },
  timestamp: 1730649625000
}
```

### 添加端点

**接口路径**：`POST /api/v1/api-collections/:collectionId/endpoints`  
**接口说明**：手动添加接口端点

#### 请求参数

```typescript
{
  name: string;                      // 必填|端点名称
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // 必填
  path: string;                      // 必填|路径
  description?: string;
  category?: string;                 // 分类
  tags?: string[];                   // 标签
  enabled?: boolean;                 // 默认true
  
  // 可选：请求配置
  requestConfig?: {
    headers?: Record<string, string>;
    queryParams?: Record<string, any>;
    body?: any;
  };
  
  // 可选：响应配置
  responseConfig?: {
    successStatus?: number;          // 成功状态码，默认200
    contentType?: string;
  };
}
```

### 更新端点

**接口路径**：`PATCH /api/v1/api-collections/:collectionId/endpoints/:endpointId`

### 删除端点

**接口路径**：`DELETE /api/v1/api-collections/:collectionId/endpoints/:endpointId`

### 切换端点状态

**接口路径**：`PATCH /api/v1/api-collections/:collectionId/endpoints/:endpointId/toggle`  
**接口说明**：启用/禁用端点

#### 响应数据

```typescript
{
  code: 200,
  message: "端点状态已更新",
  data: {
    endpointId: string;
    enabled: boolean;
  },
  timestamp: 1730649625000
}
```

---

## 导出OpenAPI规范

**接口路径**：`GET /api/v1/api-collections/:id/export`  
**接口说明**：导出接口集为OpenAPI 3.0规范

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: string;                        // 接口集ID
}
```

### 查询参数

```typescript
{
  format?: 'json' | 'yaml';          // 导出格式，默认json
  includeDisabled?: boolean;         // 是否包含禁用的端点，默认false
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    spec: string;                    // OpenAPI规范内容
    format: 'json' | 'yaml';
    downloadUrl?: string;            // 下载链接（可选）
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 查看OpenAPI规范按钮
- 导出按钮
- 规范预览对话框

---

## 安全配置管理

### 配置认证方式

**接口路径**：`PUT /api/v1/api-collections/:id/security`  
**接口说明**：配置接口集的安全认证方式

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 请求参数

```typescript
{
  type: SecurityType;                // 认证类型
  config: SecurityConfig;            // 配置详情
}
```

### SecurityType 枚举

```typescript
enum SecurityType {
  API_KEY = 'apiKey',                // API密钥
  HTTP_BASIC = 'httpBasic',          // HTTP Basic
  BEARER = 'bearer',                 // Bearer Token
  OAUTH2_PASSWORD = 'oauth2Password', // OAuth2密码模式
  OAUTH2_CLIENT = 'oauth2Client',    // OAuth2客户端模式
  CUSTOM = 'custom'                  // 自定义认证
}
```

### SecurityConfig 定义

```typescript
// API Key 认证
interface ApiKeyConfig {
  type: 'apiKey';
  name: string;                      // 参数名称，如 "X-API-Key"
  value: string;                     // API密钥值
  in: 'header' | 'query' | 'cookie'; // 位置
}

// HTTP Basic 认证
interface HttpBasicConfig {
  type: 'httpBasic';
  username: string;
  password: string;
}

// Bearer Token 认证
interface BearerConfig {
  type: 'bearer';
  token: string;
}

// OAuth2 密码模式
interface OAuth2PasswordConfig {
  type: 'oauth2Password';
  tokenUrl: string;                  // Token获取地址
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
}

// OAuth2 客户端模式
interface OAuth2ClientConfig {
  type: 'oauth2Client';
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
}

// 自定义认证
interface CustomConfig {
  type: 'custom';
  params: {
    id: string;
    name: string;                    // 参数名
    value: string;                   // 参数值
    location: 'header' | 'query' | 'cookie';  // 位置
  }[];
}

type SecurityConfig = 
  | ApiKeyConfig 
  | HttpBasicConfig 
  | BearerConfig 
  | OAuth2PasswordConfig 
  | OAuth2ClientConfig 
  | CustomConfig;
```

**Figma对应**：
- 安全配置对话框
- 认证类型选择
- API Key配置表单
- OAuth2配置表单
- 自定义参数配置

### 响应数据

```typescript
{
  code: 200,
  message: "安全配置已保存",
  data: {
    id: string;
    securityType: SecurityType;
    updatedAt: number;
  },
  timestamp: 1730649625000
}
```

---

## 测试接口端点

**接口路径**：`POST /api/v1/api-collections/:collectionId/endpoints/:endpointId/test`  
**接口说明**：测试接口端点是否可用

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 请求参数

```typescript
{
  // 可选：覆盖默认参数
  headers?: Record<string, string>;
  queryParams?: Record<string, any>;
  body?: any;
  
  // 可选：超时设置
  timeout?: number;                  // 毫秒，默认30000
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "测试完成",
  data: {
    success: boolean;
    statusCode: number;
    responseTime: number;            // 响应时间（毫秒）
    responseHeaders: Record<string, string>;
    responseBody: any;
    error?: string;                  // 失败时的错误信息
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 测试接口按钮
- 测试结果显示对话框

---

## 数据类型定义

### APIEndpoint（接口端点）

```typescript
interface APIEndpoint {
  id: string;
  name: string;                      // 端点名称
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;                      // 路径，如 "/v1/chat/completions"
  description: string;               // 描述
  category: string;                  // 分类，如 "chat"
  tags: string[];                    // 标签
  enabled: boolean;                  // 是否启用
  
  // 统计
  lastUsedAt?: number;
  lastUsedDate?: string;
  usageCount?: number;               // 使用次数
  
  // 配置
  requestConfig?: {
    headers?: Record<string, string>;
    queryParams?: Record<string, any>;
    body?: any;
  };
  
  responseConfig?: {
    successStatus?: number;
    contentType?: string;
  };
}
```

---

## 使用场景示例

### 1. 创建接口集

```http
POST /api/v1/api-collections
Content-Type: application/json

{
  "name": "OpenAI API",
  "description": "OpenAI GPT-4 和相关模型的接口集合",
  "visibility": "private",
  "serverConfig": {
    "url": "https://api.openai.com",
    "description": "OpenAI官方API服务器"
  }
}
```

### 2. 导入Swagger文件

```http
POST /api/v1/api-collections/import
Content-Type: multipart/form-data

file=@openapi.json
type=openapi
visibility=team
importStrategy={"conflictStrategy":"merge","importSecurity":true}
```

### 3. 配置API Key认证

```http
PUT /api/v1/api-collections/abc123/security
Content-Type: application/json

{
  "type": "apiKey",
  "config": {
    "type": "apiKey",
    "name": "X-API-Key",
    "value": "sk-xxxxxxxxxxxxx",
    "in": "header"
  }
}
```

### 4. 添加接口端点

```http
POST /api/v1/api-collections/abc123/endpoints
Content-Type: application/json

{
  "name": "Create Chat Completion",
  "method": "POST",
  "path": "/v1/chat/completions",
  "description": "创建聊天补全请求",
  "category": "chat",
  "tags": ["GPT-4", "Streaming"],
  "enabled": true
}
```

### 5. 测试接口

```http
POST /api/v1/api-collections/abc123/endpoints/ep456/test
Content-Type: application/json

{
  "body": {
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }
}
```

---

## 业务规则说明

### 权限控制

1. **创建**：所有成员
2. **查看**：根据visibility控制
3. **编辑**：仅owner
4. **删除**：仅owner
5. **导入**：所有成员

### 可见性规则

- **private**：仅创建者可见
- **team**：团队成员可见
- **public**：所有人可见（只读）

### 安全配置

1. 敏感信息（密码、密钥）加密存储
2. 测试接口时不返回完整的安全配置
3. 导出时可选择是否包含安全配置

### 导入策略

1. **文件验证**：检查格式、版本兼容性
2. **冲突处理**：根据策略处理重复接口
3. **批量导入**：大文件异步处理
4. **错误处理**：部分失败不影响其他接口导入

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 41901 | 接口集不存在 |
| 41902 | 接口端点不存在 |
| 41903 | 无权访问该接口集 |
| 41904 | 导入文件格式错误 |
| 41905 | 导入文件过大 |
| 41906 | OpenAPI规范无效 |
| 41907 | 安全配置无效 |
| 41908 | 接口集被引用，无法删除 |
| 41909 | 接口测试失败 |

---

**最佳实践**：

1. 定期同步最新的API规范
2. 为每个环境（开发/测试/生产）创建独立的接口集
3. 使用标签和分类组织接口
4. 定期测试接口可用性
5. 敏感信息使用环境变量管理
6. 导出规范用于团队协作和文档生成
