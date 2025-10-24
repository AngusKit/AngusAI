# 模型管理模块 API

**Figma来源**：模型管理页面、添加模型对话框、模型详情、性能监控  
**模块说明**：模型的添加、配置、启动、停止、监控等功能

## 目录

- [获取模型列表](#获取模型列表)
- [获取模型详情](#获取模型详情)
- [添加模型](#添加模型)
- [更新模型](#更新模型)
- [删除模型](#删除模型)
- [启动模型](#启动模型)
- [停止模型](#停止模型)
- [模型配置](#模型配置)
- [性能监控](#性能监控)
- [调用统计](#调用统计)

---

## 获取模型列表

**接口路径**：`GET /api/v1/models`  
**接口说明**：获取模型列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  keyword?: string;           // 搜索关键词
  type?: ModelType;           // 模型类型筛选
  provider?: ModelProvider;   // 提供商筛选
  status?: ModelStatus;       // 状态筛选
  orderBy?: 'createdDate' | 'calls' | 'cost' | 'name';
  orderSort?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 搜索框
- `type` → 类型筛选下拉框
- `status` → 状态筛选（运行中/已停止/部署中）
- 网格/列表视图切换

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
        description: string;
        type: ModelType;       // language | image | video | code | audio | embedding | multimodal
        icon: string;          // 图标组件名
        iconBg: string;
        iconColor: string;
        provider: ModelProvider; // OpenAI | Anthropic | Google 等
        version: string;
        status: ModelStatus;   // running | stopped | deploying
        statusColor: string;

        // 性能指标
        performance: {
          latency: string;       // "128ms"
          throughput: string;    // "1.2K req/min"
          accuracy: string;      // "98.5%"
        };

        // 资源使用
        resources: {
          cpu: string;           // "45%"
          memory: string;        // "2.1GB"
          gpu: string;           // "60%"
        };

        // 统计
        calls: string;           // "45.2K"
        callsCount: number;
        cost: string;            // "¥1,234"
        deployed: string;        // "2023-10-15"
        deployedAt: number;

        createdDate: Date
        lastModifiedDate: Date;
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

- 模型列表网格卡片或列表
- 每个卡片显示：图标、名称、类型、状态、性能、资源、调用统计

---

## 获取模型详情

**接口路径**：`GET /api/v1/models/:id`  
**接口说明**：获取指定模型的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
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
    description: string;
    type: ModelType;
    icon: string;
    iconBg: string;
    iconColor: string;
    provider: ModelProvider;
    version: string;
    status: ModelStatus;
    statusColor: string;

    // 配置信息
    config: {
      // API配置
      apiEndpoint?: string;
      apiKey?: string;         // 部分隐藏
      apiKeyMasked?: string;   // "sk-***abc"

      // 模型参数
      parameters: {
        maxTokens?: number;
        temperature?: number;
        topP?: number;
        topK?: number;
        frequencyPenalty?: number;
        presencePenalty?: number;
        stopSequences?: string[];
      };

      // 部署配置
      deployment?: {
        region?: string;
        instanceType?: string;
        replicas?: number;
        autoScaling?: boolean;
        minReplicas?: number;
        maxReplicas?: number;
      };

      // 限制配置
      limits?: {
        rateLimit?: number;      // 每分钟请求数
        dailyLimit?: number;     // 每天请求数
        maxConcurrent?: number;  // 最大并发数
      };
    };

    // 性能指标
    performance: {
      latency: string;
      latencyMs: number;
      throughput: string;
      throughputRaw: number;
      accuracy: string;
      accuracyPercent: number;
    };

    // 资源使用
    resources: {
      cpu: string;
      cpuPercent: number;
      memory: string;
      memoryBytes: number;
      gpu: string;
      gpuPercent: number;
    };

    // 统计数据
    stats: {
      totalCalls: number;
      successfulCalls: number;
      failedCalls: number;
      totalTokens: number;
      totalCost: number;
      avgResponseTime: number;
      successRate: number;
      last24HoursCalls: number;
    };

    // 时间信息
    deployed: string;
    deployedAt: number;
    lastCallAt?: number;
    createdDate: Date
    lastModifiedDate: Date;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 模型详情对话框
- 显示完整配置、性能指标、资源使用、统计数据

---

## 添加模型

**接口路径**：`POST /api/v1/models`  
**接口说明**：添加新模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|模型名称|maxLength:50
  description: string;       // 必填|描述|maxLength:500
  type: ModelType;           // 必填|模型类型
  provider: ModelProvider;   // 必填|提供商
  version?: string;          // 可选|版本号

  // API配置
  apiEndpoint?: string;      // API端点
  apiKey?: string;           // API密钥（加密传输）

  // 模型参数
  parameters?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };

  // 部署配置
  deployment?: {
    region?: string;
    instanceType?: string;
    replicas?: number;
    autoScaling?: boolean;
    minReplicas?: number;
    maxReplicas?: number;
  };

  // 限制配置
  limits?: {
    rateLimit?: number;
    dailyLimit?: number;
    maxConcurrent?: number;
  };

  // 是否立即部署
  autoDeploy?: boolean;      // 默认false
}
```

**Figma对应**：

- 添加模型对话框
- 多步骤表单：基本信息、API配置、参数设置、部署设置

### 响应数据

```typescript
{
  code: 201,
  msg: "模型添加成功",
  data: {
    id: number;
    name: string;
    type: ModelType;
    provider: ModelProvider;
    status: 'stopped';       // 新添加默认停止
    createdDate: Date
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 模型名称在用户空间内需唯一
2. API密钥加密存储
3. 新添加的模型默认停止状态
4. 需要手动启动或autoDeploy=true

---

## 更新模型

**接口路径**：`PATCH /api/v1/models/:id`  
**接口说明**：更新模型配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 请求参数

```typescript
{
  name?: string;
  description?: string;
  version?: string;
  apiEndpoint?: string;
  apiKey?: string;
  parameters?: any;
  deployment?: any;
  limits?: any;
}
```

**Figma对应**：

- 编辑模型对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的模型信息
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 运行中的模型需要先停止才能修改部分配置
2. 参数配置可以热更新
3. API密钥更新需要重新验证

---

## 删除模型

**接口路径**：`DELETE /api/v1/models/:id`  
**接口说明**：删除模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
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

1. 运行中的模型需要先停止
2. 删除前检查是否有应用在使用
3. 删除后保留历史调用记录

---

## 启动模型

**接口路径**：`POST /api/v1/models/:id/start`  
**接口说明**：启动模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "启动成功",
  data: {
    id: number;
    status: 'deploying';     // 部署中
    estimatedTime: number;   // 预计启动时间（秒）
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 模型卡片上的启动按钮
- 详情页的启动按钮

### 业务规则

1. 启动前验证配置完整性
2. 检查API密钥有效性
3. 启动为异步过程
4. 状态变化：stopped → deploying → running

---

## 停止模型

**接口路径**：`POST /api/v1/models/:id/stop`  
**接口说明**：停止模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 请求参数

```typescript
{
  graceful?: boolean;        // 优雅停止，等待当前请求完成
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "停止成功",
  data: {
    id: number;
    status: 'stopped';
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 模型卡片上的停止按钮

---

## 测试模型连接

**接口路径**：`POST /api/v1/models/:id/test`  
**接口说明**：测试模型连接和配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 请求参数

```typescript
{
  testPrompt?: string;       // 测试提示词
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "测试成功",
  data: {
    status: 'success' | 'failed';
    responseTime: number;    // 响应时间（毫秒）
    result?: string;         // 测试结果
    error?: string;          // 错误信息
  },
  datetime: 1706889600000
}
```

---

## 获取模型性能监控

**接口路径**：`GET /api/v1/models/:id/metrics`  
**接口说明**：获取模型性能监控数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 查询参数

```typescript
{
  period?: 'hour' | 'day' | 'week' | 'month';
  startTime?: number;
  endTime?: number;
  metrics?: string[];        // 指定指标
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    period: {
      start: number;
      end: number;
      granularity: string;   // 数据粒度
    },

    // 性能指标时序数据
    latency: Array<{
      datetime: number;
      value: number;         // 毫秒
      p50?: number;
      p95?: number;
      p99?: number;
    }>;

    throughput: Array<{
      datetime: number;
      value: number;         // 请求数/分钟
    }>;

    successRate: Array<{
      datetime: number;
      value: number;         // 百分比
    }>;

    // 资源使用时序数据
    cpu: Array<{
      datetime: number;
      value: number;         // 百分比
    }>;

    memory: Array<{
      datetime: number;
      value: number;         // MB
    }>;

    gpu: Array<{
      datetime: number;
      value: number;         // 百分比
    }>;

    // 成本数据
    cost: Array<{
      datetime: number;
      value: number;
      tokens: number;
    }>;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 模型详情页的监控Tab
- 性能趋势图表

---

## 获取模型调用统计

**接口路径**：`GET /api/v1/models/:id/statistics`  
**接口说明**：获取模型调用统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 查询参数

```typescript
{
  period?: 'today' | 'week' | 'month' | 'year';
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    overview: {
      totalCalls: number;
      successfulCalls: number;
      failedCalls: number;
      totalTokens: number;
      totalCost: number;
      avgResponseTime: number;
      successRate: number;
    },

    // 调用趋势
    callsTrend: Array<{
      datetime: number;
      total: number;
      successful: number;
      failed: number;
    }>;

    // Token使用
    tokenUsage: Array<{
      datetime: number;
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    }>;

    // 成本趋势
    costTrend: Array<{
      datetime: number;
      cost: number;
    }>;

    // Top调用应用
    topApplications: Array<{
      applicationId: number;
      name: string;
      calls: number;
      percentage: number;
    }>;

    // 错误分析
    errorAnalysis?: {
      total: number;
      byType: Record<string, number>;
      topErrors: Array<{
        type: string;
        count: number;
        msg: string;
      }>;
    };
  },
  datetime: 1706889600000
}
```

---

## 获取模型列表统计

**接口路径**：`GET /api/v1/models/statistics`  
**接口说明**：获取模型管理模块的统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    totalModels: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    runningModels: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    todayCalls: {
      value: string;         // "45.2K"
      rawValue: number;
      change: string;
      trend: 'up' | 'down';
    },
    avgLatency: {
      value: string;         // "128ms"
      valueMs: number;
      change: string;
      trend: 'up' | 'down';  // 延迟降低是up
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 模型管理页面顶部的4个统计卡片

---

## 获取可用模型提供商

**接口路径**：`GET /api/v1/models/providers`  
**接口说明**：获取支持的模型提供商列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: string;
        name: string;          // "OpenAI"
        description: string;
        logo: string;
        supportedTypes: ModelType[];

        // 可用模型
        models: Array<{
          id: string;
          name: string;        // "GPT-4"
          type: ModelType;
          version: string;
          pricing?: {
            inputPerToken: number;
            outputPerToken: number;
          };
        }>;

        // 配置要求
        configRequirements: {
          apiKey: boolean;
          apiEndpoint?: string;
        };
      }
    ]
  },
  datetime: 1706889600000
}
```

---

## 重启模型

**接口路径**：`POST /api/v1/models/:id/restart`  
**接口说明**：重启模型（先停止再启动）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "重启中",
  data: {
    id: number;
    status: 'deploying';
  },
  datetime: 1706889600000
}
```

---

## 批量操作模型

**接口路径**：`POST /api/v1/models/batch`  
**接口说明**：批量启动/停止模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  modelIds: number[];        // 模型ID列表
  action: 'start' | 'stop' | 'restart';
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "批量操作成功",
  data: {
    successCount: number;
    failedCount: number;
    results: Array<{
      modelId: number;
      success: boolean;
      error?: string;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 导出模型配置

**接口路径**：`GET /api/v1/models/:id/export`  
**接口说明**：导出模型配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 模型ID
}
```

### 响应数据

返回JSON文件下载，包含模型配置（API密钥已脱敏）

---

## 导入模型配置

**接口路径**：`POST /api/v1/models/import`  
**接口说明**：导入模型配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  file: File;                // 配置文件（JSON）
  replaceExisting?: boolean; // 是否替换同名模型
}
```

### 响应数据

```typescript
{
  code: 201,
  msg: "导入成功",
  data: {
    importedCount: number;
    skippedCount: number;
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 模型状态流转

```
添加 → stopped（已停止） → deploying（部署中） → running（运行中）
                                                    ↓
                                                  stopped

running → error（错误） → 可重启恢复
```

### 计费规则

- 按Token计费：输入Token + 输出Token
- 按调用次数计费
- 按资源使用时长计费
- 不同模型提供商有不同定价

### 性能监控

- 实时监控CPU、内存、GPU使用率
- 记录每次调用的延迟
- 计算成功率和错误率
- 统计Token使用量

### 限制策略

- 速率限制：防止单个应用过度调用
- 并发限制：保护模型稳定性
- 每日限额：成本控制

---

## 错误码

| 错误码 | 说明                   |
| ------ | ---------------------- |
| 41001  | 模型不存在             |
| 41002  | 模型正在运行，无法删除 |
| 41003  | API密钥无效            |
| 41004  | 模型配置不完整         |
| 41005  | 模型部署失败           |
| 41006  | 超过并发限制           |
| 41007  | 超过每日限额           |
| 41008  | 不支持的模型类型       |

---

**性能优化建议**：

1. 监控数据使用时序数据库
2. 统计数据定时聚合计算
3. 实时指标使用WebSocket推送
4. 历史数据分层存储
5. 大量调用使用队列处理
6. 缓存提供商列表
