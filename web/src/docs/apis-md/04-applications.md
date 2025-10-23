# 应用管理模块 API

**Figma来源**：我的应用页面、创建应用对话框、应用设置页面  
**模块说明**：应用的创建、编辑、删除、配置、发布等功能

## 目录

- [获取应用列表](#获取应用列表)
- [获取应用详情](#获取应用详情)
- [创建应用](#创建应用)
- [更新应用基本信息](#更新应用基本信息)
- [删除应用](#删除应用)
- [发布应用](#发布应用)
- [更新应用配置](#更新应用配置)
- [复制应用](#复制应用)
- [分享应用](#分享应用)

---

## 获取应用列表

**接口路径**：`GET /api/v1/applications`  
**接口说明**：获取当前用户的应用列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;              // 页码，默认1
  pageSize?: number;          // 每页数量，默认20
  keyword?: string;           // 关键词搜索（名称、描述）
  category?: ApplicationCategory;  // 分类筛选
  status?: ApplicationStatus;      // 状态筛选
  sortBy?: 'createdAt' | 'updatedAt' | 'apiCalls' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 搜索框输入
- `category` → 分类筛选下拉框
- `status` → 状态筛选（已发布/草稿）
- `sortBy` → 排序方式选择器

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: number;
        name: string;
        icon: string;            // emoji或URL
        description: string;
        category: ApplicationCategory;
        status: ApplicationStatus;
        createdAt: number;
        updatedAt: number;
        lastModified: string;    // "2小时前"
        apiCalls: number;
        createdBy: number;

        // 配置信息（简略）
        model?: string;          // 使用的模型
        knowledgeBaseCount?: number;  // 关联知识库数
        workflowCount?: number;       // 关联工作流数
      }
    ],
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 应用列表页的卡片网格
- 每个卡片显示：图标、名称、描述、状态、调用次数、最后修改时间

---

## 获取应用详情

**接口路径**：`GET /api/v1/applications/:id`  
**接口说明**：获取指定应用的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    id: number;
    name: string;
    icon: string;
    description: string;
    category: ApplicationCategory;
    status: ApplicationStatus;
    createdAt: number;
    updatedAt: number;
    createdBy: number;

    // 详细配置
    config: {
      // 模型配置
      model: {
        provider: string;
        modelName: string;
        temperature: number;
        maxTokens: number;
        topP: number;
        frequencyPenalty: number;
        presencePenalty: number;
      },

      // 关联资源
      resources: {
        knowledgeBase?: {
          id: number;
          name: string;
        },
        dataset?: {
          id: number;
          name: string;
        },
        workflows: Array<{
          id: number;
          name: string;
          enabled: boolean;
        }>;
      },

      // 提示词配置
      prompts: {
        system: string;
        context?: string;
      },

      // 对话设置
      conversation: {
        welcomeMessage: string;
        openingQuestions: string[];
        maxHistoryLength: number;
      },

      // 功能设置
      features: {
        enableFileUpload: boolean;
        enableVoiceInput: boolean;
        enableImageInput: boolean;
        enableSuggestions: boolean;
        enableHistory: boolean;
      },

      // 安全设置
      security: {
        enableContentFilter: boolean;
        enableDataEncryption: boolean;
        dataRetentionDays: number;
        enableAnonymization: boolean;
      },

      // 发布设置
      publish: {
        publicAccess: boolean;
        embedEnabled: boolean;
        apiEnabled: boolean;
      }
    },

    // 统计数据
    stats: {
      totalApiCalls: number;
      totalTokens: number;
      avgResponseTime: number;
      successRate: number;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 应用设置页面的所有Tab内容
- 基本信息、模型配置、关联资源、提示词等各个配置项

---

## 创建应用

**接口路径**：`POST /api/v1/applications`  
**接口说明**：创建新应用

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|应用名称|maxLength:50
  icon: string;              // 必填|应用图标（emoji或URL）
  description: string;       // 必填|应用描述|maxLength:500
  category: ApplicationCategory;  // 必填|应用分类
  language?: Language;       // 可选|默认语言，默认zh-CN

  // 可选：从模板创建
  templateId?: number;       // 模板ID
}
```

**Figma对应**：

- 创建应用对话框的表单字段
- 名称输入框、图标选择器、描述输入框、分类选择器

### 响应数据

```typescript
{
  code: 201,
  message: "应用创建成功",
  data: {
    id: number;
    name: string;
    icon: string;
    description: string;
    category: ApplicationCategory;
    status: 'draft';         // 新创建默认为草稿
    createdAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 新创建的应用默认状态为草稿
2. 自动初始化默认配置
3. 如果从模板创建，复制模板的所有配置
4. 应用名称在用户空间内需唯一

---

## 更新应用基本信息

**接口路径**：`PATCH /api/v1/applications/:id`  
**接口说明**：更新应用的基本信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 请求参数

```typescript
{
  name?: string;
  icon?: string;
  description?: string;
  category?: ApplicationCategory;
  language?: Language;
}
```

**Figma对应**：

- 应用设置页 → 基本信息Tab
- 编辑应用对话框

### 响应数据

```typescript
{
  code: 200,
  message: "更新成功",
  data: {
    // 返回更新后的应用信息
  },
  timestamp: 1706889600000
}
```

---

## 更新应用配置

**接口路径**：`PUT /api/v1/applications/:id/config`  
**接口说明**：更新应用的详细配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 请求参数

```typescript
{
  model?: {
    provider?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  },

  resources?: {
    knowledgeBaseId?: number | null;  // 关联的知识库ID，null表示取消关联
    datasetId?: number | null;        // 关联的数据集ID
    workflowIds?: number[];           // 关联的工作流ID列表
  },

  prompts?: {
    system?: string;
    context?: string;
  },

  conversation?: {
    welcomeMessage?: string;
    openingQuestions?: string[];
    maxHistoryLength?: number;
  },

  features?: {
    enableFileUpload?: boolean;
    enableVoiceInput?: boolean;
    enableImageInput?: boolean;
    enableSuggestions?: boolean;
    enableHistory?: boolean;
  },

  security?: {
    enableContentFilter?: boolean;
    enableDataEncryption?: boolean;
    dataRetentionDays?: number;
    enableAnonymization?: boolean;
  },

  publish?: {
    publicAccess?: boolean;
    embedEnabled?: boolean;
    apiEnabled?: boolean;
  }
}
```

**Figma对应**：

- 应用设置页的各个Tab配置项
- 模型配置、关联资源、提示词、对话设置、功能、安全、发布设置

### 响应数据

```typescript
{
  code: 200,
  message: "配置更新成功",
  data: {
    // 返回更新后的完整配置
  },
  timestamp: 1706889600000
}
```

---

## 删除应用

**接口路径**：`DELETE /api/v1/applications/:id`  
**接口说明**：删除指定应用

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 响应数据

```typescript
{
  code: 204,
  message: "删除成功",
  timestamp: 1706889600000
}
```

### 业务规则

1. 只能删除自己创建的应用
2. 删除应用不会删除关联的知识库、数据集、工作流
3. 删除前需要确认对话框（前端实现）
4. 软删除，保留30天可恢复

---

## 发布应用

**接口路径**：`POST /api/v1/applications/:id/publish`  
**接口说明**：发布应用（从草稿变为已发布）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "应用已发布",
  data: {
    id: number;
    status: 'published';
    publishedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 发布前需检查必填配置项
2. 已发布的应用可以取消发布回到草稿状态
3. 发布后立即生效

---

## 取消发布应用

**接口路径**：`POST /api/v1/applications/:id/unpublish`  
**接口说明**：取消发布应用（变为草稿）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "已取消发布",
  data: {
    id: number;
    status: 'draft';
  },
  timestamp: 1706889600000
}
```

---

## 复制应用

**接口路径**：`POST /api/v1/applications/:id/duplicate`  
**接口说明**：复制应用（包含所有配置）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 源应用ID
}
```

### 请求参数

```typescript
{
  name?: string;             // 可选|新应用名称，默认为"xxx的副本"
}
```

### 响应数据

```typescript
{
  code: 201,
  message: "复制成功",
  data: {
    // 返回新应用的完整信息
  },
  timestamp: 1706889600000
}
```

---

## 分享应用

**接口路径**：`POST /api/v1/applications/:id/share`  
**接口说明**：生成应用分享链接或邀请码

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 请求参数

```typescript
{
  shareType: 'link' | 'invite_code';  // 分享类型
  permissions?: string[];              // 权限列表
  expiresIn?: number;                  // 有效期（小时），0表示永久
}
```

**Figma对应**：

- 分享应用对话框
- 分享方式选择、权限设置、有效期设置

### 响应数据

```typescript
{
  code: 200,
  message: "分享链接已生成",
  data: {
    shareId: string;
    shareType: 'link' | 'invite_code';
    shareUrl?: string;        // 分享链接
    inviteCode?: string;      // 邀请码
    qrCode?: string;          // 二维码图片URL
    expiresAt?: number;       // 过期时间
  },
  timestamp: 1706889600000
}
```

---

## 获取应用统计

**接口路径**：`GET /api/v1/applications/:id/statistics`  
**接口说明**：获取应用的详细统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 查询参数

```typescript
{
  startDate?: number;
  endDate?: number;
  period?: 'hour' | 'day' | 'week' | 'month';
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    overview: {
      totalCalls: number;
      totalTokens: number;
      totalCost: number;
      avgResponseTime: number;
      successRate: number;
    },
    trends: {
      calls: Array<{
        timestamp: number;
        value: number;
      }>;
      tokens: Array<{
        timestamp: number;
        value: number;
      }>;
      responseTime: Array<{
        timestamp: number;
        value: number;
      }>;
    },
    topUsers: Array<{
      userId: number;
      username: string;
      callCount: number;
    }>;
  },
  timestamp: 1706889600000
}
```

---

## 导出应用配置

**接口路径**：`GET /api/v1/applications/:id/export`  
**接口说明**：导出应用配置为JSON文件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 应用ID
}
```

### 响应数据

返回JSON文件下载

---

## 导入应用配置

**接口路径**：`POST /api/v1/applications/import`  
**接口说明**：从JSON文件导入应用配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  file: File;                // 配置文件
  name?: string;             // 应用名称，默认使用文件中的
}
```

### 响应数据

```typescript
{
  code: 201,
  message: "导入成功",
  data: {
    // 返回创建的应用信息
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 应用状态流转

```
创建 → 草稿 → 发布 → 已发布
              ↑______|

已发布 → 取消发布 → 草稿
```

### 权限控制

1. 创建者拥有应用的所有权限
2. 团队成员根据角色拥有不同权限
3. 公开应用任何人可访问（只读）

### 验证规则

1. 名称：1-50字符
2. 描述：最多500字符
3. 模型参数需在有效范围内
4. 关联资源必须存在且有权限访问

---

**注意事项**：

1. 应用配置更新建议使用分段API，避免一次性传输大量数据
2. 发布前应进行完整性检查
3. 统计数据建议异步计算，实时查询可能较慢
