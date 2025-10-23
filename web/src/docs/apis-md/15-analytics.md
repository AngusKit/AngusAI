# 使用分析模块 API

**Figma来源**：使用分析页面、UsageAnalytics组件  
**模块说明**：详细的API使用统计、性能分析、趋势图表等功能

## 目录
- [获取分析概览](#获取分析概览)
- [获取API调用趋势](#获取api调用趋势)
- [获取Token使用趋势](#获取token使用趋势)
- [获取响应时间分析](#获取响应时间分析)
- [获取应用使用分布](#获取应用使用分布)
- [获取模型使用分布](#获取模型使用分布)
- [获取Top接口统计](#获取top接口统计)
- [获取错误分析](#获取错误分析)
- [导出分析报告](#导出分析报告)

---

## 获取分析概览

**接口路径**：`GET /api/v1/analytics/overview`  
**接口说明**：获取使用分析的概览统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: '24hours' | '7days' | '30days' | '90days';  // 默认7days
  appId?: number;            // 可选|筛选特定应用
}
```

**Figma对应**：
- `timeRange` → 时间范围选择器
- `appId` → 应用筛选下拉框

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    timeRange: string;
    period: {
      start: number;
      end: number;
    };
    
    // 核心指标
    stats: {
      totalApiCalls: {
        value: number;
        valueDisplay: string;     // "25,590"
        change: string;           // "+12.5%"
        trend: 'up' | 'down';
        comparedTo: string;       // "与上周期相比"
      };
      
      activeUsers: {
        value: number;
        valueDisplay: string;
        change: string;
        trend: 'up' | 'down';
      };
      
      tokenConsumption: {
        value: number;
        valueDisplay: string;     // "1.2M"
        change: string;
        trend: 'up' | 'down';
      };
      
      avgResponseTime: {
        value: number;            // 秒
        valueDisplay: string;     // "1.2s"
        change: string;
        trend: 'up' | 'down';
      };
    };
    
    // 成功率
    successRate: {
      value: number;              // 98.5
      total: number;
      successful: number;
      failed: number;
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 统计卡片（4个关键指标）
- 趋势箭头和百分比变化

---

## 获取API调用趋势

**接口路径**：`GET /api/v1/analytics/api-calls`  
**接口说明**：获取API调用量的时间序列数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: '24hours' | '7days' | '30days' | '90days';
  appId?: number;
  granularity?: 'hour' | 'day' | 'week';  // 数据粒度
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
        timestamp: number;
        date: string;           // "10/16" 或 "14:00"
        totalCalls: number;
        successfulCalls: number;
        failedCalls: number;
        successRate: number;    // 百分比
      }
    ],
    
    summary: {
      totalCalls: number;
      avgCallsPerPeriod: number;
      peakCalls: number;
      peakTime: string;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- API调用趋势折线图
- 成功/失败堆叠柱状图
- 图表数据源

---

## 获取Token使用趋势

**接口路径**：`GET /api/v1/analytics/token-usage`  
**接口说明**：获取Token使用量的时间序列数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  appId?: number;
  granularity?: string;
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
        timestamp: number;
        date: string;
        inputTokens: number;    // 输入Token
        outputTokens: number;   // 输出Token
        totalTokens: number;
        cost: number;           // 费用
      }
    ],
    
    summary: {
      totalInput: number;
      totalOutput: number;
      totalTokens: number;
      totalCost: number;
      avgTokensPerCall: number;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- Token使用趋势面积图
- 输入/输出Token堆叠图

---

## 获取响应时间分析

**接口路径**：`GET /api/v1/analytics/response-time`  
**接口说明**：获取API响应时间的统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  appId?: number;
  granularity?: string;
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
        timestamp: number;
        date: string;
        avgTime: number;        // 平均响应时间（秒）
        p50: number;            // 中位数
        p95: number;            // 95分位
        p99: number;            // 99分位
        minTime: number;
        maxTime: number;
      }
    ],
    
    summary: {
      overallAvg: number;
      overallP95: number;
      overallP99: number;
      slowestEndpoint: {
        endpoint: string;
        avgTime: number;
      };
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 响应时间折线图
- P95/P99性能指标

---

## 获取应用使用分布

**接口路径**：`GET /api/v1/analytics/app-distribution`  
**接口说明**：获取不同应用的使用分布情况

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  limit?: number;             // Top N，默认10
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
        appId: number;
        appName: string;
        calls: number;
        percentage: number;     // 占比百分比
        tokens: number;
        cost: number;
        avgResponseTime: number;
      }
    ],
    
    total: {
      apps: number;
      calls: number;
      tokens: number;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 应用使用分布饼图
- 应用使用排名列表

---

## 获取模型使用分布

**接口路径**：`GET /api/v1/analytics/model-distribution`  
**接口说明**：获取不同模型的使用分布情况

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
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
        modelId: number;
        modelName: string;      // "GPT-4", "GPT-4 Turbo"
        calls: number;
        percentage: number;
        tokens: number;
        cost: number;
        avgResponseTime: number;
        color: string;          // 图表颜色
      }
    ],
    
    total: {
      models: number;
      calls: number;
      tokens: number;
      cost: number;
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 模型使用分布饼图
- 不同颜色区分不同模型

---

## 获取Top接口统计

**接口路径**：`GET /api/v1/analytics/top-endpoints`  
**接口说明**：获取调用最多的接口统计

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  limit?: number;             // 默认10
  sortBy?: 'calls' | 'avgTime' | 'successRate';
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
        endpoint: string;       // "/v1/chat/completions"
        method: string;         // "POST"
        calls: number;
        avgTime: string;        // "1.2s"
        avgTimeMs: number;
        successRate: string;    // "98.5%"
        successRateValue: number;
        totalTokens: number;
        errors: number;
      }
    ]
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- Top接口列表表格
- 调用次数、响应时间、成功率列

---

## 获取错误分析

**接口路径**：`GET /api/v1/analytics/errors`  
**接口说明**：获取错误统计和分析

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  appId?: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 按错误码统计
    byStatusCode: [
      {
        statusCode: number;     // 429, 500, 401
        name: string;           // "Rate Limit", "Internal Error"
        count: number;
        percentage: string;     // "45%"
        percentageValue: number;
        trend: 'up' | 'down';
        change: string;         // "+12%"
      }
    ],
    
    // 按接口统计错误
    byEndpoint: [
      {
        endpoint: string;
        errors: number;
        errorRate: number;      // 错误率
        topErrorCode: number;
      }
    ],
    
    // 错误趋势
    errorTrend: Array<{
      timestamp: number;
      date: string;
      total: number;
      code4xx: number;
      code5xx: number;
    }>;
    
    summary: {
      totalErrors: number;
      errorRate: number;        // 总体错误率
      mostCommonError: {
        code: number;
        name: string;
        count: number;
      };
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 错误分析柱状图
- 错误分布饼图
- 错误趋势折线图

---

## 获取用户活跃度

**接口路径**：`GET /api/v1/analytics/user-activity`  
**接口说明**：获取用户活跃度统计

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 活跃用户趋势
    activeUsersTrend: Array<{
      date: string;
      dau: number;            // 日活跃用户
      wau: number;            // 周活跃用户
      mau: number;            // 月活跃用户
    }>;
    
    // 用户行为分布
    userBehavior: {
      newUsers: number;
      returningUsers: number;
      avgSessionDuration: number;  // 秒
      avgCallsPerUser: number;
    };
    
    // Top用户
    topUsers: Array<{
      userId: number;
      userName: string;
      calls: number;
      tokens: number;
      lastActive: number;
    }>;
  },
  timestamp: 1706889600000
}
```

---

## 获取成本分析

**接口路径**：`GET /api/v1/analytics/cost`  
**接口说明**：获取成本统计和分析

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  appId?: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 成本趋势
    costTrend: Array<{
      date: string;
      cost: number;
      calls: number;
      tokens: number;
    }>;
    
    // 按应用分组
    byApp: Array<{
      appId: number;
      appName: string;
      cost: number;
      percentage: number;
    }>;
    
    // 按模型分组
    byModel: Array<{
      modelId: number;
      modelName: string;
      cost: number;
      percentage: number;
    }>;
    
    summary: {
      totalCost: number;
      avgCostPerCall: number;
      avgCostPerDay: number;
      projectedMonthlyCost: number;  // 预计月成本
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 成本趋势图
- 成本分布
- 预算预警

---

## 导出分析报告

**接口路径**：`GET /api/v1/analytics/export`  
**接口说明**：导出分析报告

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  timeRange?: string;
  format?: 'pdf' | 'excel' | 'csv';
  reportType?: 'full' | 'summary';
  appId?: number;
}
```

### 响应数据

返回文件下载

---

## 获取实时监控

**接口路径**：`GET /api/v1/analytics/realtime`  
**接口说明**：获取实时监控数据（最近1小时）

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
    // 实时指标
    current: {
      activeConnections: number;
      requestsPerMinute: number;
      avgResponseTime: number;
      errorRate: number;
    };
    
    // 最近调用（最新10条）
    recentCalls: Array<{
      timestamp: number;
      endpoint: string;
      method: string;
      statusCode: number;
      responseTime: number;
      userId?: number;
      appId?: number;
    }>;
    
    // 分钟级趋势（最近60分钟）
    minuteTrend: Array<{
      minute: string;         // "14:30"
      calls: number;
      errors: number;
      avgTime: number;
    }>;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 实时监控仪表板
- 实时调用流

---

## 获取性能基准

**接口路径**：`GET /api/v1/analytics/benchmarks`  
**接口说明**：获取性能基准数据（与行业平均对比）

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
    // 响应时间对比
    responseTime: {
      yours: number;
      average: number;
      percentile: number;     // 你的排名（百分位）
    };
    
    // 成功率对比
    successRate: {
      yours: number;
      average: number;
      percentile: number;
    };
    
    // 成本效率对比
    costEfficiency: {
      costPerThousandCalls: number;
      average: number;
      percentile: number;
    };
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 时间范围

- **24hours**：最近24小时，按小时聚合
- **7days**：最近7天，按天聚合
- **30days**：最近30天，按天聚合
- **90days**：最近90天，按周聚合

### 数据更新频率

- 实时监控：30秒刷新
- 趋势数据：5分钟更新
- 统计报告：15分钟更新

### 数据保留

- 原始调用数据：90天
- 聚合统计数据：永久
- 详细日志：30天

### 性能指标定义

- **P50（中位数）**：50%的请求响应时间
- **P95**：95%的请求响应时间
- **P99**：99%的请求响应时间

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 41501 | 时间范围无效 |
| 41502 | 应用不存在 |
| 41503 | 数据导出失败 |
| 41504 | 没有分析数据 |

---

**性能优化建议**：

1. 使用缓存减少查询
2. 大数据量使用聚合表
3. 异步生成报告
4. 数据分片存储
5. 实时数据使用Redis
6. 历史数据归档
