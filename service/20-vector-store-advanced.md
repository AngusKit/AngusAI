# 向量存储源管理模块 API（高级版）

**Figma来源**：向量存储源页面、创建/编辑对话框、连接测试、统计卡片  
**模块说明**：管理向量数据库连接、支持20+主流向量数据库、连接测试、性能监控等功能

## 目录
- [获取存储源列表](#获取存储源列表)
- [创建存储源](#创建存储源)
- [更新存储源](#更新存储源)
- [删除存储源](#删除存储源)
- [连接测试](#连接测试)
- [切换启用状态](#切换启用状态)
- [同步向量数据](#同步向量数据)
- [获取统计信息](#获取统计信息)
- [支持的数据库类型](#支持的数据库类型)

---

## 获取存储源列表

**接口路径**：`GET /api/v1/vector-stores`  
**接口说明**：获取已配置的向量存储源列表

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
  type?: VectorStoreType;           // 数据库类型筛选
  status?: 'connected' | 'disconnected' | 'testing';  // 状态筛选
  enabled?: boolean;                 // 启用状态筛选
  sortBy?: 'name' | 'createdTime' | 'lastSync' | 'indexCount';
  sortOrder?: 'asc' | 'desc';
}
```

**Figma对应**：
- `keyword` → 搜索框
- `type` → 类型筛选下拉框
- `status` → 状态筛选
- 存储源卡片列表/表格视图

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: number;                  // 存储源ID
        name: string;                // 名称
        type: VectorStoreType;       // 数据库类型
        typeLabel: string;           // "Pinecone"
        typeIcon: string;            // 图标emoji "🌲"
        description: string;         // 描述
        
        // 连接信息
        endpoint: string;            // 连接地址
        status: 'connected' | 'disconnected' | 'testing';
        statusLabel: string;         // "已连接"
        statusColor: string;         // 状态颜色类名
        
        // 状态
        enabled: boolean;            // 是否启用
        
        // 向量配置
        dimension: number;           // 向量维度
        indexCount: number;          // 索引数量
        
        // 时间
        createdTime: string;         // "2024-01-15 10:30"
        createdTimestamp: number;
        lastSync: string;            // 最后同步时间
        lastSyncTimestamp: number;
        
        // 配置（脱敏）
        config: {
          [key: string]: string;     // 配置项（密码已脱敏）
        };
        
        // 性能指标
        performance?: {
          avgQueryTime: number;      // 平均查询时间（ms）
          todayQueries: number;      // 今日查询次数
          uptime: number;            // 运行时间（秒）
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
  timestamp: 1730649625000
}
```

**Figma对应**：
- 存储源卡片网格/列表
- 每个卡片显示：名称、类型图标、状态、维度、索引数、最后同步时间

---

## 创建存储源

**接口路径**：`POST /api/v1/vector-stores`  
**接口说明**：创建新的向量存储源配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 请求参数

```typescript
{
  name: string;                      // 必填|名称|maxLength:100
  type: VectorStoreType;            // 必填|数据库类型
  description?: string;              // 可选|描述|maxLength:500
  endpoint: string;                  // 必填|连接地址
  dimension: number;                 // 必填|向量维度|min:1|max:4096
  
  // 根据不同类型，config字段内容不同
  config: VectorStoreConfig;         // 必填|配置信息
  
  // 可选配置
  enabled?: boolean;                 // 是否启用，默认true
  autoSync?: boolean;                // 是否自动同步，默认false
  syncInterval?: number;             // 同步间隔（分钟），默认60
}
```

**Figma对应**：
- 创建存储源对话框
- 名称输入框
- 类型选择器（20+选项）
- 描述输入
- 端点地址输入
- 维度输入
- 动态配置表单（根据类型变化）

### VectorStoreConfig 示例

```typescript
// Pinecone
interface PineconeConfig {
  apiKey: string;                    // API密钥
  environment: string;               // 环境，如 "us-east-1"
  index: string;                     // 索引名称
}

// Chroma
interface ChromaConfig {
  collection: string;                // 集合名称
  authToken?: string;                // 认证令牌（可选）
}

// Elasticsearch
interface ElasticsearchConfig {
  username: string;
  password: string;
  index: string;
  cloudId?: string;                  // Elastic Cloud ID（可选）
}

// Qdrant
interface QdrantConfig {
  apiKey: string;
  collection: string;
}

// MongoDB Atlas
interface MongoDBAtlasConfig {
  username: string;
  password: string;
  database: string;
  collection: string;
  clusterUrl?: string;
}

// PGvector
interface PGvectorConfig {
  username: string;
  password: string;
  database: string;
  table: string;
  schema?: string;                   // 默认public
}

// Redis
interface RedisConfig {
  password?: string;
  database?: number;                 // 默认0
  indexName: string;
}

// Weaviate
interface WeaviateConfig {
  apiKey?: string;
  className: string;                 // 类名
}

// Milvus
interface MilvusConfig {
  username?: string;
  password?: string;
  collection: string;
  token?: string;
}

// 更多类型的配置...
```

### 响应数据

```typescript
{
  code: 201,
  message: "存储源创建成功",
  data: {
    id: number;
    name: string;
    type: VectorStoreType;
    endpoint: string;
    status: 'disconnected';          // 新创建默认未连接
    createdTime: string;
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 创建后默认状态为 `disconnected`
2. 建议创建后立即执行连接测试
3. 敏感信息（密码、密钥）加密存储
4. 同一类型的存储源名称不能重复

---

## 更新存储源

**接口路径**：`PATCH /api/v1/vector-stores/:id`  
**接口说明**：更新存储源配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 路径参数

```typescript
{
  id: number;                        // 存储源ID
}
```

### 请求参数

```typescript
{
  name?: string;
  description?: string;
  endpoint?: string;
  dimension?: number;
  config?: Partial<VectorStoreConfig>;  // 部分更新配置
  enabled?: boolean;
  autoSync?: boolean;
  syncInterval?: number;
}
```

**Figma对应**：
- 编辑存储源对话框
- 表单字段（与创建相同）

### 响应数据

```typescript
{
  code: 200,
  message: "存储源已更新",
  data: {
    id: number;
    name: string;
    updatedAt: number;
    // 如果endpoint或config变化，状态重置为disconnected
    status: 'connected' | 'disconnected';
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 更新endpoint或config后，状态自动变为 `disconnected`
2. 需要重新执行连接测试
3. 正在使用中的存储源建议先禁用再更新

---

## 删除存储源

**接口路径**：`DELETE /api/v1/vector-stores/:id`  
**接口说明**：删除存储源配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                        // 存储源ID
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
  message: "存储源已删除",
  timestamp: 1730649625000
}
```

### 业务规则

1. 如果存储源被知识库引用，需要 `force=true` 才能删除
2. 删除前会提示影响范围
3. 删除后无法恢复，建议先禁用观察

---

## 连接测试

**接口路径**：`POST /api/v1/vector-stores/:id/test`  
**接口说明**：测试向量存储源的连接状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                        // 存储源ID
}
```

### 请求参数

```typescript
{
  timeout?: number;                  // 超时时间（秒），默认30
}
```

**Figma对应**：
- 测试连接按钮
- 连接测试中的加载状态
- 测试结果显示

### 响应数据

```typescript
{
  code: 200,
  message: "连接测试完成",
  data: {
    success: boolean;                // 是否成功
    status: 'connected' | 'disconnected';
    
    // 测试详情
    testDetails: {
      responseTime: number;          // 响应时间（ms）
      indexCount: number;            // 索引数量
      dimension: number;             // 向量维度
      version?: string;              // 数据库版本
    };
    
    // 失败原因（如果失败）
    error?: {
      code: string;
      message: string;
      details?: string;
    };
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 测试过程中状态显示为 `testing`
2. 测试超时自动失败
3. 测试成功后更新 `indexCount` 等信息
4. 测试结果会记录到操作日志

---

## 切换启用状态

**接口路径**：`PATCH /api/v1/vector-stores/:id/toggle`  
**接口说明**：启用或禁用存储源

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                        // 存储源ID
}
```

### 请求参数

```typescript
{
  enabled: boolean;                  // 目标状态
}
```

**Figma对应**：
- 启用/禁用切换开关
- 确认对话框

### 响应数据

```typescript
{
  code: 200,
  message: "状态已更新",
  data: {
    id: number;
    enabled: boolean;
    updatedAt: number;
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 禁用后不能被新的知识库选择
2. 已有的知识库仍可继续使用
3. 禁用不会断开连接，只是标记为不可用

---

## 同步向量数据

**接口路径**：`POST /api/v1/vector-stores/:id/sync`  
**接口说明**：手动触发向量数据同步

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                        // 存储源ID
}
```

### 请求参数

```typescript
{
  fullSync?: boolean;                // 是否全量同步，默认false（增量）
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "同步任务已启动",
  data: {
    taskId: string;                  // 同步任务ID
    status: 'pending' | 'processing';
    estimatedTime: number;           // 预计完成时间（秒）
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 同步期间存储源仍可正常使用
2. 大量数据采用异步同步
3. 同步完成后更新 `lastSync` 时间

---

## 获取统计信息

**接口路径**：`GET /api/v1/vector-stores/statistics`  
**接口说明**：获取向量存储源的统计数据

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
    // 总体统计
    overview: {
      totalStores: number;           // 存储源总数
      connectedStores: number;       // 已连接数
      totalVectors: number;          // 向量总数
      todayQueries: number;          // 今日查询数
    };
    
    // 类型分布
    typeDistribution: {
      type: VectorStoreType;
      typeLabel: string;
      count: number;
      percentage: number;
    }[];
    
    // 使用率排行
    topStores: {
      id: number;
      name: string;
      type: VectorStoreType;
      queryCount: number;            // 查询次数
      indexCount: number;            // 索引数量
      avgResponseTime: number;       // 平均响应时间
    }[];
    
    // 性能趋势
    performanceTrend: {
      timestamp: number;
      date: string;                  // "2024-11-03"
      totalQueries: number;
      avgResponseTime: number;
      errorRate: number;             // 错误率（百分比）
    }[];
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 统计卡片（总数、已连接、向量总数、今日查询）
- 类型分布图表
- 使用率排行列表
- 性能趋势图

---

## 支持的数据库类型

### VectorStoreType 枚举

```typescript
enum VectorStoreType {
  // 商业云服务
  PINECONE = 'PINECONE',                          // Pinecone 🌲
  QDRANT = 'QDRANT',                              // Qdrant ⚡
  WEAVIATE = 'WEAVIATE',                          // Weaviate 🕸️
  MILVUS = 'MILVUS',                              // Milvus 🦅
  
  // Azure系列
  AZURE_AI_SERVICE = 'AZURE_AI_SERVICE',          // Azure AI Service ☁️
  AZURE_COSMOS_DB = 'AZURE_COSMOS_DB',            // Azure Cosmos DB 🌐
  
  // 开源向量数据库
  CHROMA = 'CHROMA',                              // Chroma 🎨
  ELASTICSEARCH = 'ELASTICSEARCH',                 // Elasticsearch 🔍
  OPENSEARCH = 'OPENSEARCH',                      // OpenSearch 🔎
  TYPESENSE = 'TYPESENSE',                        // Typesense ⚙️
  
  // 传统数据库扩展
  PGVECTOR = 'PGVECTOR',                          // PGvector (PostgreSQL) 🐘
  MONGODB_ATLAS = 'MONGODB_ATLAS',                // MongoDB Atlas 🍃
  REDIS = 'REDIS',                                // Redis 🔴
  MARIADB = 'MARIADB',                            // MariaDB 🗄️
  ORACLE = 'ORACLE',                              // Oracle 🏛️
  
  // 图数据库
  NEO4J = 'NEO4J',                                // Neo4j 🔗
  
  // 大数据/分布式
  APACHE_CASSANDRA = 'APACHE_CASSANDRA',          // Apache Cassandra 📊
  COUCHBASE = 'COUCHBASE',                        // Couchbase 🛋️
  GEMFIRE = 'GEMFIRE',                            // GemFire 💎
  
  // 企业级
  SAP_HANA = 'SAP_HANA',                          // SAP Hana 💼
}
```

### 各类型特点对比

| 类型 | 特点 | 适用场景 | 难度 |
|------|------|----------|------|
| **Pinecone** | 全托管、高性能、易用 | 生产环境、大规模应用 | 简单 |
| **Qdrant** | 开源、高性能、支持本地部署 | 高性能检索 | 中等 |
| **Chroma** | 轻量级、易部署 | 开发测试、小规模应用 | 简单 |
| **PGvector** | PostgreSQL扩展、无需额外服务 | 已有PG数据库的项目 | 简单 |
| **Elasticsearch** | 成熟、功能丰富 | 综合搜索需求 | 中等 |
| **MongoDB Atlas** | 文档数据库+向量搜索 | 已有MongoDB的项目 | 简单 |
| **Milvus** | 开源、超大规模 | 亿级向量检索 | 复杂 |
| **Weaviate** | 语义搜索、知识图谱 | 复杂语义应用 | 中等 |
| **Redis** | 缓存+向量搜索 | 低延迟场景 | 简单 |

---

## 配置参数说明

### Pinecone

```typescript
{
  type: 'PINECONE',
  endpoint: 'https://index-name.svc.pinecone.io',
  config: {
    apiKey: 'xxxxx',                 // API密钥（必填）
    environment: 'us-east-1',        // 环境（必填）
    index: 'my-index'                // 索引名称（必填）
  }
}
```

### Chroma

```typescript
{
  type: 'CHROMA',
  endpoint: 'http://localhost:8000',
  config: {
    collection: 'my_collection',     // 集合名称（必填）
    authToken: 'xxxxx'               // 认证令牌（可选）
  }
}
```

### PGvector

```typescript
{
  type: 'PGVECTOR',
  endpoint: 'postgresql://host:5432/dbname',
  config: {
    username: 'postgres',            // 用户名（必填）
    password: 'xxxxx',               // 密码（必填）
    database: 'vectordb',            // 数据库名（必填）
    table: 'vectors',                // 表名（必填）
    schema: 'public'                 // Schema（可选，默认public）
  }
}
```

### Qdrant

```typescript
{
  type: 'QDRANT',
  endpoint: 'https://xxxxx.qdrant.io:6333',
  config: {
    apiKey: 'xxxxx',                 // API密钥（必填）
    collection: 'my_collection'      // 集合名称（必填）
  }
}
```

### MongoDB Atlas

```typescript
{
  type: 'MONGODB_ATLAS',
  endpoint: 'mongodb+srv://cluster.mongodb.net',
  config: {
    username: 'admin',               // 用户名（必填）
    password: 'xxxxx',               // 密码（必填）
    database: 'vectors',             // 数据库名（必填）
    collection: 'embeddings',        // 集合名（必填）
    clusterUrl: 'cluster0.xxxxx.mongodb.net'  // 集群URL（可选）
  }
}
```

---

## 使用场景示例

### 1. 创建Pinecone存储源

```http
POST /api/v1/vector-stores
Content-Type: application/json

{
  "name": "Production Pinecone",
  "type": "PINECONE",
  "description": "生产环境向量存储",
  "endpoint": "https://prod-index.pinecone.io",
  "dimension": 1536,
  "config": {
    "apiKey": "xxxxx-xxxxx-xxxxx",
    "environment": "us-east-1",
    "index": "production"
  },
  "enabled": true
}
```

### 2. 测试连接

```http
POST /api/v1/vector-stores/1/test

{
  "timeout": 30
}
```

### 3. 更新配置

```http
PATCH /api/v1/vector-stores/1
Content-Type: application/json

{
  "description": "生产环境主存储",
  "config": {
    "index": "production-v2"
  }
}
```

### 4. 同步数据

```http
POST /api/v1/vector-stores/1/sync

{
  "fullSync": false
}
```

### 5. 查询统计

```http
GET /api/v1/vector-stores/statistics
```

---

## 业务规则说明

### 连接管理

1. **懒连接**：创建时不立即连接，需手动测试
2. **心跳检测**：已连接的存储源定期心跳检测
3. **自动重连**：连接失败自动重试3次
4. **故障转移**：支持配置备用存储源

### 性能优化

1. **连接池**：维护连接池，避免频繁创建连接
2. **缓存**：热点数据缓存15分钟
3. **批量操作**：支持批量写入和查询
4. **异步处理**：大批量操作异步处理

### 安全性

1. **加密存储**：密码、密钥AES-256加密
2. **SSL/TLS**：生产环境强制使用加密连接
3. **权限控制**：只有owner和admin可以查看完整配置
4. **审计日志**：所有配置变更记录日志

### 容灾备份

1. **配置备份**：定期备份配置信息
2. **数据同步**：支持多存储源数据同步
3. **故障隔离**：单个存储源故障不影响其他
4. **降级策略**：支持降级到备用存储源

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 42001 | 存储源不存在 |
| 42002 | 存储源已存在（名称重复） |
| 42003 | 连接测试失败 |
| 42004 | 连接超时 |
| 42005 | 认证失败（用户名或密码错误） |
| 42006 | 索引/集合不存在 |
| 42007 | 维度不匹配 |
| 42008 | 配置参数无效 |
| 42009 | 存储源被引用，无法删除 |
| 42010 | 不支持的数据库类型 |
| 42011 | API密钥无效 |
| 42012 | 同步任务失败 |

---

## 前端集成说明

### 1. 动态表单

根据选择的数据库类型，动态渲染不同的配置表单：

```typescript
const getConfigFields = (type: VectorStoreType) => {
  switch (type) {
    case 'PINECONE':
      return ['apiKey', 'environment', 'index'];
    case 'CHROMA':
      return ['collection', 'authToken?'];
    case 'PGVECTOR':
      return ['username', 'password', 'database', 'table', 'schema?'];
    // ...
  }
};
```

### 2. 连接状态显示

使用颜色和图标直观展示连接状态：

```typescript
const statusConfig = {
  connected: { color: 'green', icon: CheckCircle2 },
  disconnected: { color: 'red', icon: XCircle },
  testing: { color: 'yellow', icon: Activity },
};
```

### 3. 实时监控

可选：使用WebSocket实时监控存储源状态：

```typescript
ws.subscribe('vector-store-status', (data) => {
  updateStoreStatus(data.id, data.status);
});
```

---

**最佳实践**：

1. 生产和开发使用不同的存储源
2. 定期备份配置和重要数据
3. 监控性能指标，及时发现瓶颈
4. 测试环境先验证新配置
5. 使用高可用架构（主备）
6. 定期清理过期索引，释放空间
7. 根据业务量选择合适的数据库类型
