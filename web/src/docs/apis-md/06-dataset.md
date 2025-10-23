# 数据集模块 API

**Figma来源**：数据集页面、创建数据集对话框、数据源管理  
**模块说明**：数据集的创建、管理、数据导入、数据源连接等功能

## 目录
- [获取数据集列表](#获取数据集列表)
- [获取数据集详情](#获取数据集详情)
- [创建数据集](#创建数据集)
- [更新数据集](#更新数据集)
- [删除数据集](#删除数据集)
- [上传数据](#上传数据)
- [数据源管理](#数据源管理)
- [数据预览](#数据预览)
- [数据导出](#数据导出)

---

## 获取数据集列表

**接口路径**：`GET /api/v1/datasets`  
**接口说明**：获取数据集列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;           // 搜索关键词（名称、描述）
  type?: DataType;            // 数据类型筛选：text | table | datasource
  status?: 'active' | 'inactive' | 'preparing';
  visibility?: Visibility;    // 可见性筛选
  sortBy?: 'createdAt' | 'updatedAt' | 'dataCount' | 'name';
  sortOrder?: 'asc' | 'desc';
  tags?: string[];            // 标签筛选
}
```

**Figma对应**：
- `keyword` → 搜索框
- `type` → 数据类型筛选（文本/表格/数据源）
- `status` → 状态筛选
- 表格视图展示

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
        description: string;
        icon: string;            // emoji
        iconBg: string;          // 背景色类名
        type: DataType;          // text | table | datasource
        dataCount: string;       // "12.5K 条"
        size: string;            // "2.8 MB"
        status: 'active' | 'inactive' | 'preparing';
        statusColor: string;     // 状态颜色类名
        visibility: Visibility;
        createdAt: number;
        updatedAt: number;
        updateTime: string;      // "2023-10-12"
        creator: string;
        createdBy: number;
        tags: string[];
        
        // 统计信息
        stats?: {
          totalRecords: number;
          columns?: number;       // 表格数据的列数
          dataSources?: number;   // 数据源数量
        };
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
- 数据集列表表格
- 每行显示：图标、名称、类型、数据量、大小、状态、更新时间

---

## 获取数据集详情

**接口路径**：`GET /api/v1/datasets/:id`  
**接口说明**：获取指定数据集的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
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
    description: string;
    icon: string;
    iconBg: string;
    type: DataType;
    dataCount: string;
    size: string;
    status: string;
    statusColor: string;
    visibility: Visibility;
    createdAt: number;
    updatedAt: number;
    creator: string;
    createdBy: number;
    tags: string[];
    
    // 配置信息
    config: {
      // 文本数据配置
      textConfig?: {
        encoding: string;        // 编码格式
        delimiter?: string;      // 分隔符
        hasHeader: boolean;      // 是否有表头
      };
      
      // 表格数据配置
      tableConfig?: {
        columns: Array<{
          name: string;
          type: 'string' | 'number' | 'date' | 'boolean';
          nullable: boolean;
        }>;
        primaryKey?: string;
        indexes?: string[];
      };
      
      // 数据源配置
      dataSourceConfig?: {
        type: 'mysql' | 'postgresql' | 'mongodb' | 'api' | 'file';
        connection?: {
          host?: string;
          port?: number;
          database?: string;
          username?: string;
          // 密码不返回
        };
        syncSchedule?: string;   // cron表达式
        lastSyncTime?: number;
      };
      
      // 数据处理配置
      processing?: {
        cleaningRules?: string[];
        transformRules?: string[];
      };
    };
    
    // 统计信息
    stats: {
      totalRecords: number;
      totalSize: number;        // 字节
      columns?: number;
      dataSources?: number;
      lastUpdateTime: number;
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 选中数据集后展开的详情面板
- 不同类型数据集显示不同的配置项

---

## 创建数据集

**接口路径**：`POST /api/v1/datasets`  
**接口说明**：创建新数据集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|数据集名称|maxLength:50
  description: string;       // 必填|描述|maxLength:500
  icon?: string;             // 可选|图标emoji
  iconBg?: string;           // 可选|背景色
  type: DataType;            // 必填|数据类型：text | table | datasource
  visibility: Visibility;    // 必填|可见性
  tags?: string[];           // 可选|标签，最多5个
  
  // 配置（根据type不同而不同）
  config?: {
    textConfig?: {
      encoding?: string;
      delimiter?: string;
      hasHeader?: boolean;
    };
    tableConfig?: {
      columns?: Array<{
        name: string;
        type: string;
        nullable?: boolean;
      }>;
    };
    dataSourceConfig?: {
      type?: string;
      connection?: any;
      syncSchedule?: string;
    };
  };
}
```

**Figma对应**：
- 创建数据集对话框
- 名称、描述、类型选择、可见性、标签

### 响应数据

```typescript
{
  code: 201,
  message: "数据集创建成功",
  data: {
    id: number;
    name: string;
    type: DataType;
    status: 'preparing';     // 新创建默认为准备中
    createdAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 数据集名称在用户空间内需唯一
2. 标签最多5个，每个不超过10字符
3. 创建后默认状态为preparing
4. 需要上传数据后状态变为active

---

## 更新数据集

**接口路径**：`PATCH /api/v1/datasets/:id`  
**接口说明**：更新数据集基本信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 请求参数

```typescript
{
  name?: string;
  description?: string;
  icon?: string;
  iconBg?: string;
  visibility?: Visibility;
  tags?: string[];
}
```

**Figma对应**：
- 编辑数据集对话框

### 响应数据

```typescript
{
  code: 200,
  message: "更新成功",
  data: {
    // 返回更新后的数据集信息
  },
  timestamp: 1706889600000
}
```

---

## 删除数据集

**接口路径**：`DELETE /api/v1/datasets/:id`  
**接口说明**：删除数据集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
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

1. 删除数据集会同时删除所有数据
2. 如果数据集被应用关联，需先解除关联
3. 软删除，保留30天可恢复

---

## 上传数据（文本/表格）

**接口路径**：`POST /api/v1/datasets/:id/upload`  
**接口说明**：上传数据到数据集

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 请求参数

```typescript
{
  file?: File;               // 文件上传（文本/CSV/Excel）
  data?: string;             // 直接粘贴的文本数据
  append?: boolean;          // 是否追加（默认false，覆盖）
}
```

**Figma对应**：
- 选中文本/表格数据集后的上传区域
- 支持文件上传和直接粘贴

### 响应数据

```typescript
{
  code: 201,
  message: "上传成功，开始处理",
  data: {
    uploadId: string;
    recordsCount: number;    // 预估记录数
    status: 'processing';
    estimatedTime: number;   // 预计处理时间（秒）
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 文本数据：支持txt、json、csv
2. 表格数据：支持csv、xlsx、xls
3. 单次上传最大100MB
4. 自动检测编码和分隔符
5. 上传后异步处理

---

## 添加数据源

**接口路径**：`POST /api/v1/datasets/:id/datasources`  
**接口说明**：添加数据源连接

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID（必须是datasource类型）
}
```

### 请求参数

```typescript
{
  name: string;              // 必填|数据源名称
  sourceType: 'file' | 'api' | 'database' | 'web' | 'cloud';
  
  // 数据库连接
  database?: {
    type: 'mysql' | 'postgresql' | 'mongodb' | 'redis';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;        // 加密传输
    tables?: string[];       // 要同步的表
  };
  
  // API连接
  api?: {
    url: string;
    method: 'GET' | 'POST';
    headers?: Record<string, string>;
    auth?: {
      type: 'bearer' | 'basic' | 'apikey';
      credentials: any;
    };
  };
  
  // 文件连接
  file?: {
    path: string;
    type: 'csv' | 'json' | 'xml' | 'excel';
    encoding?: string;
  };
  
  // 同步配置
  syncConfig?: {
    schedule?: string;       // cron表达式
    autoSync: boolean;
  };
}
```

**Figma对应**：
- 添加数据源对话框
- 不同类型显示不同的表单

### 响应数据

```typescript
{
  code: 201,
  message: "数据源添加成功",
  data: {
    id: number;
    name: string;
    sourceType: string;
    status: 'connected' | 'connecting' | 'failed';
    recordCount?: number;
    lastSyncTime?: number;
  },
  timestamp: 1706889600000
}
```

---

## 获取数据源列表

**接口路径**：`GET /api/v1/datasets/:id/datasources`  
**接口说明**：获取数据集的数据源列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  sourceType?: string;       // 数据源类型筛选
  status?: string;           // 状态筛选
}
```

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
        sourceType: 'file' | 'api' | 'database' | 'web' | 'cloud';
        sourceTypeLabel: string;
        typeIcon: string;
        typeColor: string;
        size: string;
        status: 'connected' | 'processing' | 'failed' | 'inactive';
        statusColor: string;
        addedTime: string;
        recordCount: string;
        lastSync?: string;
        
        // 连接信息（敏感信息隐藏）
        connection?: {
          host?: string;
          database?: string;
          // 不返回密码等敏感信息
        };
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
- 数据源类型数据集的数据源列表
- 左侧列表显示

---

## 同步数据源

**接口路径**：`POST /api/v1/datasets/:datasetId/datasources/:sourceId/sync`  
**接口说明**：手动触发数据源同步

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  datasetId: number;         // 数据集ID
  sourceId: number;          // 数据源ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "同步已启动",
  data: {
    syncId: string;
    status: 'syncing';
    startedAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 删除数据源

**接口路径**：`DELETE /api/v1/datasets/:datasetId/datasources/:sourceId`  
**接口说明**：删除数据源

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  datasetId: number;
  sourceId: number;
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

---

## 数据预览

**接口路径**：`GET /api/v1/datasets/:id/preview`  
**接口说明**：预览数据集数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 查询参数

```typescript
{
  page?: number;             // 页码，默认1
  pageSize?: number;         // 每页数量，默认20，最大100
  sourceId?: number;         // 数据源ID（数据源类型）
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 文本数据
    textData?: {
      content: string[];     // 文本行数组
      total: number;
    };
    
    // 表格数据
    tableData?: {
      columns: Array<{
        name: string;
        type: string;
      }>;
      rows: any[][];         // 行数据
      total: number;
    };
    
    // 数据源数据（数据库表）
    dataSourceData?: {
      tableName?: string;
      columns: Array<{
        name: string;
        type: string;
      }>;
      rows: any[][];
      total: number;
    };
    
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
- 选中数据源时右侧的记录预览表格

---

## 数据导出

**接口路径**：`GET /api/v1/datasets/:id/export`  
**接口说明**：导出数据集数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 查询参数

```typescript
{
  format?: 'csv' | 'json' | 'excel' | 'sql';  // 导出格式
  sourceId?: number;         // 数据源ID（可选）
}
```

### 响应数据

返回文件下载

---

## 获取数据集统计

**接口路径**：`GET /api/v1/datasets/statistics`  
**接口说明**：获取数据集模块的统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    totalDatasets: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    totalRecords: {
      value: string;         // "45.8K"
      rawValue: number;
      change: string;
      trend: 'up' | 'down';
    },
    activeDatasets: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    storageUsage: {
      used: string;          // "1.8GB"
      total: string;         // "10GB"
      usedBytes: number;
      totalBytes: number;
      percentage: number;    // 18
      change: string;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 数据集页面顶部的4个统计卡片

---

## 测试数据源连接

**接口路径**：`POST /api/v1/datasets/test-connection`  
**接口说明**：测试数据源连接是否可用

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  sourceType: 'database' | 'api' | 'file';
  connection: any;           // 连接配置，同添加数据源的参数
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "连接成功",
  data: {
    status: 'success' | 'failed';
    message?: string;
    details?: {
      latency: number;       // 延迟（毫秒）
      recordCount?: number;  // 可访问的记录数
    };
  },
  timestamp: 1706889600000
}
```

---

## 批量删除数据

**接口路径**：`POST /api/v1/datasets/:id/batch-delete`  
**接口说明**：批量删除数据记录

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 数据集ID
}
```

### 请求参数

```typescript
{
  recordIds?: number[];      // 记录ID列表
  filter?: {                 // 或者使用过滤条件
    [key: string]: any;
  };
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "批量删除成功",
  data: {
    deletedCount: number;
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 数据集类型

1. **文本数据（text）**
   - 支持txt、json、csv格式
   - 适用于非结构化文本
   - 可用于NLP训练

2. **表格数据（table）**
   - 支持csv、excel格式
   - 结构化数据
   - 支持列定义和类型

3. **数据源（datasource）**
   - 连接外部数据库
   - 支持API接口
   - 自动同步更新

### 数据处理流程

```
上传/连接 → 验证 → 解析 → 清洗 → 存储 → 索引 → 完成
```

### 状态流转

```
preparing → processing → active
                      ↓
                    failed → 可重试
                    
active → inactive（停用）
```

### 权限控制

- **private**: 仅自己可见
- **team**: 团队成员可见
- **public**: 所有人可见（只读）

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 40301 | 数据集不存在 |
| 40302 | 数据格式不支持 |
| 40303 | 数据集类型不匹配 |
| 40304 | 数据源连接失败 |
| 40305 | 存储空间不足 |
| 40306 | 数据量超过限制 |

---

**性能优化建议**：

1. 大文件上传使用分片上传
2. 数据预览限制最大100条
3. 数据导出异步生成，提供下载链接
4. 数据源同步使用队列处理
5. 表格数据使用虚拟滚动
6. 统计数据缓存5分钟
