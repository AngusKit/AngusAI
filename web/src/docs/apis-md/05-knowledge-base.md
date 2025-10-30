# 知识库模块 API

**Figma来源**：知识库页面、创建知识库对话框、文档管理  
**模块说明**：知识库的创建、文档上传、检索、管理等功能

## 目录

- [获取知识库列表](#获取知识库列表)
- [获取知识库详情](#获取知识库详情)
- [创建知识库](#创建知识库)
- [更新知识库](#更新知识库)
- [删除知识库](#删除知识库)
- [上传文档](#上传文档)
- [获取文档列表](#获取文档列表)
- [删除文档](#删除文档)
- [启用/禁用文档](#启用禁用文档)
- [文档解析状态](#文档解析状态)

---

## 获取知识库列表

**接口路径**：`GET /api/v1/knowledge-bases`  
**接口说明**：获取知识库列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  keyword?: string;          // 搜索关键词
  orderBy?: 'createdDate' | 'modifiedDate' | 'documentsCount' | 'name';
  orderSort?: 'asc' | 'desc';
  tags?: string[];           // 标签筛选
}
```

**Figma对应**：

- 知识库列表页的搜索框、筛选器、排序选择器

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        name: string;
        icon: string;           // emoji
        iconBg: string;         // 背景色类名
        description: string;
        documentsCount: number;  // 文档数量
        totalSize: string;       // 总大小，如"2.5 MB"
        enabled: boolean;        // 是否启用
        createdDate: Date
        modifiedDate: Date;
        tags: string[];
        visibility: Visibility;  // 可见性
      }
    ],
    pagination: {
      pageNo: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 知识库列表的卡片
- 显示图标、名称、文档数、大小、启用状态

---

## 获取知识库详情

**接口路径**：`GET /api/v1/knowledge-bases/:id`  
**接口说明**：获取指定知识库的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    name: string;
    icon: string;
    iconBg: string;
    description: string;
    documentsCount: number;
    totalSize: string;
    enabled: boolean;
    createdDate: Date
    modifiedDate: Date;
    tags: string[];
    visibility: Visibility;

    // 统计信息
    stats: {
      totalDocuments: number;
      activeDocuments: number;   // 已启用的文档
      totalChunks: number;        // 总分段数
      avgChunkSize: number;       // 平均分段大小
    },

    // 配置信息
    config: {
      chunkSize: number;          // 分段大小
      chunkOverlap: number;       // 分段重叠
      embeddingModel: string;     // 向量化模型
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 选中知识库后右侧展示的详情面板

---

## 创建知识库

**接口路径**：`POST /api/v1/knowledge-bases`  
**接口说明**：创建新知识库

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|知识库名称|maxLength:50
  icon: string;              // 必填|图标emoji
  iconBg: string;            // 必填|背景色
  description: string;       // 必填|描述|maxLength:500
  visibility: Visibility;    // 必填|可见性
  tags?: string[];           // 可选|标签，最多5个

  // 配置（可选，使用默认值）
  config?: {
    chunkSize?: number;      // 分段大小，默认512
    chunkOverlap?: number;   // 重叠大小，默认50
    embeddingModel?: string; // 向量化模型
  }
}
```

**Figma对应**：

- 创建知识库对话框的所有表单字段
- 名称、图标选择器、描述、可见性、标签输入

### 响应数据

```typescript
{
  code: 201,
  msg: "知识库创建成功",
  data: {
    id: number;
    name: string;
    icon: string;
    iconBg: string;
    description: string;
    visibility: Visibility;
    createdDate: Date
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 知识库名称在用户空间内需唯一
2. 标签最多5个，每个不超过10字符
3. 图标从32个预设中选择
4. 创建后默认启用

---

## 更新知识库

**接口路径**：`PATCH /api/v1/knowledge-bases/:id`  
**接口说明**：更新知识库信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 请求参数

```typescript
{
  name?: string;
  icon?: string;
  iconBg?: string;
  description?: string;
  visibility?: Visibility;
  tags?: string[];
  config?: {
    chunkSize?: number;
    chunkOverlap?: number;
    embeddingModel?: string;
  }
}
```

**Figma对应**：

- 编辑知识库对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的知识库信息
  },
  datetime: 1706889600000
}
```

---

## 删除知识库

**接口路径**：`DELETE /api/v1/knowledge-bases/:id`  
**接口说明**：删除知识库

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 响应数据

```typescript
{
  code: 204,
  msg: "删除成功",
  datetime: 1706889600000
}
```

### 业务规则

1. 删除知识库会同时删除所有文档
2. 如果知识库被应用关联，需先解除关联
3. 软删除，保留30天可恢复

---

## 上传文档

**接口路径**：`POST /api/v1/knowledge-bases/:id/documents`  
**接口说明**：上传文档到知识库

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 请求参数

```typescript
{
  files: File[];             // 文件列表，支持多文件上传
}
```

**Figma对应**：

- 选中知识库后的上传区域
- 支持点击上传和拖拽上传

### 响应数据

```typescript
{
  code: 201,
  msg: "上传成功，开始处理",
  data: {
    documents: [
      {
        id: number;
        name: string;
        type: DocumentType;
        size: string;
        uploadedAt: number;
        status: 'processing';    // 上传后开始处理
      }
    ]
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 支持的文件类型：txt、pdf、docx、md、html
2. 单个文件最大10MB
3. 一次最多上传10个文件
4. 上传后自动进入处理队列
5. 文件名需唯一（同一知识库内）

---

## 获取文档列表

**接口路径**：`GET /api/v1/knowledge-bases/:id/documents`  
**接口说明**：获取知识库的文档列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  type?: DocumentType;       // 文件类型筛选
  status?: DocumentStatus;   // 状态筛选
  enabled?: boolean;         // 启用状态筛选
  orderBy?: 'name' | 'uploadedAt' | 'size';
  orderSort?: 'asc' | 'desc';
}
```

**Figma对应**：

- 选中知识库后下方的文档列表
- 搜索、筛选、排序功能

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        name: string;
        type: DocumentType;
        size: string;
        uploadedAt: number;
        status: DocumentStatus;
        enabled: boolean;
        chunks?: number;            // 分段数量
        processingProgress?: number; // 处理进度 0-100
        errorMessage?: string;       // 错误信息（处理失败时）
      }
    ],
    pagination: {
      pageNo: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 文档列表表格
- 显示文件名、类型、大小、上传时间、状态、启用开关

---

## 删除文档

**接口路径**：`DELETE /api/v1/knowledge-bases/:knowledgeBaseId/documents/:documentId`  
**接口说明**：删除指定文档

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  knowledgeBaseId: number; // 知识库ID
  documentId: number; // 文档ID
}
```

### 响应数据

```typescript
{
  code: 204,
  msg: "删除成功",
  datetime: 1706889600000
}
```

**Figma对应**：

- 文档列表中的删除按钮

---

## 启用/禁用文档

**接口路径**：`PATCH /api/v1/knowledge-bases/:knowledgeBaseId/documents/:documentId/toggle`  
**接口说明**：切换文档的启用状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  knowledgeBaseId: number;
  documentId: number;
}
```

### 请求参数

```typescript
{
  enabled: boolean; // true启用，false禁用
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "状态已更新",
  data: {
    id: number;
    enabled: boolean;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 文档列表中每行的启用/禁用开关

---

## 获取文档处理状态

**接口路径**：`GET /api/v1/knowledge-bases/:knowledgeBaseId/documents/:documentId/status`  
**接口说明**：获取文档的处理状态（用于轮询）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  knowledgeBaseId: number;
  documentId: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    status: DocumentStatus;
    processingProgress: number;  // 0-100
    chunks?: number;             // 已完成时的分段数
    errorMessage?: string;       // 错误信息
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 文档列表中显示的处理进度条

---

## 批量删除文档

**接口路径**：`POST /api/v1/knowledge-bases/:id/documents/batch-delete`  
**接口说明**：批量删除文档

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 请求参数

```typescript
{
  documentIds: number[];     // 文档ID列表
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "批量删除成功",
  data: {
    deletedCount: number;
    failedIds?: number[];    // 删除失败的ID
  },
  datetime: 1706889600000
}
```

---

## 文档检索

**接口路径**：`POST /api/v1/knowledge-bases/:id/search`  
**接口说明**：在知识库中检索相关内容

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 知识库ID
}
```

### 请求参数

```typescript
{
  query: string;             // 必填|检索查询
  limit?: number;            // 可选|返回数量，默认5
  threshold?: number;        // 可选|相似度阈值 0-1，默认0.7
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    results: [
      {
        documentId: number;
        documentName: string;
        chunkId: string;
        content: string;       // 分段内容
        score: number;         // 相似度分数 0-1
        metadata: {
          pageNo?: number;       // 页码（PDF）
          position?: string;   // 位置信息
        }
      }
    ]
  },
  datetime: 1706889600000
}
```

---

## 重新处理文档

**接口路径**：`POST /api/v1/knowledge-bases/:knowledgeBaseId/documents/:documentId/reprocess`  
**接口说明**：重新处理失败的文档

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  knowledgeBaseId: number;
  documentId: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "已加入处理队列",
  data: {
    id: number;
    status: 'processing';
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 文档处理流程

```
上传 → 验证 → 解析 → 分段 → 向量化 → 存储 → 完成
                                          ↓
                                        失败 → 可重试
```

### 文档状态流转

```
uploading → processing → completed
                     ↓
                   failed → 可重新处理
```

### 检索规则

1. 使用向量相似度检索
2. 只检索已启用的文档
3. 支持混合检索（关键词+语义）
4. 结果按相似度排序

---

**性能优化建议**：

1. 文档处理使用异步队列
2. 大文件分块上传
3. 处理状态轮询间隔建议3-5秒
4. 向量检索建议加缓存
5. 文档列表支持虚拟滚动
