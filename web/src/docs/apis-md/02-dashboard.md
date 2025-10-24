# 工作台模块 API

**Figma来源**：工作台页面（Dashboard）  
**模块说明**：提供工作台统计数据、快速访问、推荐工具等功能

## 目录

- [获取工作台概览](#获取工作台概览)
- [获取统计卡片数据](#获取统计卡片数据)
- [获取推荐工具](#获取推荐工具)
- [获取使用分析](#获取使用分析)

---

## 获取工作台概览

**接口路径**：`GET /api/v1/dashboard/overview`  
**接口说明**：获取工作台页面的所有概览数据

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
    // 欢迎信息
    welcome: {
      username: string;
      greeting: string;      // 根据时间段返回："早上好"、"下午好"、"晚上好"
      lastLoginTime: number;
    },

    // 统计卡片
    stats: {
      totalApplications: {
        value: number;       // 应用总数
        change: string;      // 变化趋势，如 "+12.5%"
        trend: 'up' | 'down';
      },
      apiCalls: {
        value: number;       // API调用次数
        change: string;
        trend: 'up' | 'down';
      },
      tokensUsed: {
        value: number;       // Token使用量
        change: string;
        trend: 'up' | 'down';
      },
      activeUsers: {
        value: number;       // 活跃用户数
        change: string;
        trend: 'up' | 'down';
      }
    },

    // 最近应用（前4个）
    recentApplications: Application[],

    // 推荐工具（前3个）
    recommendedTools: RecommendedTool[]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- `welcome` → 欢迎横幅内容
- `stats.totalApplications` → "应用总数"统计卡片
- `stats.apiCalls` → "API调用"统计卡片
- `stats.tokensUsed` → "Tokens使用"统计卡片
- `stats.activeUsers` → "活跃用户"统计卡片
- `recentApplications` → "最近使用"应用列表
- `recommendedTools` → "推荐工具"卡片

---

## 获取统计卡片数据

**接口路径**：`GET /api/v1/dashboard/stats`  
**接口说明**：获取工作台统计卡片数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  period?: 'today' | 'week' | 'month' | 'year';  // 时间周期，默认'today'
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    totalApplications: {
      value: number;
      change: string;       // "+12.5%" 或 "-5.2%"
      trend: 'up' | 'down';
      chartData: {          // 趋势图数据
        labels: string[];   // 日期标签
        values: number[];   // 对应数值
      }
    },
    apiCalls: {
      value: number;
      change: string;
      trend: 'up' | 'down';
      chartData: {
        labels: string[];
        values: number[];
      }
    },
    tokensUsed: {
      value: number;
      change: string;
      trend: 'up' | 'down';
      chartData: {
        labels: string[];
        values: number[];
      }
    },
    activeUsers: {
      value: number;
      change: string;
      trend: 'up' | 'down';
      chartData: {
        labels: string[];
        values: number[];
      }
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 四个统计卡片的数值、趋势、图表数据
- 卡片上的小型趋势图

---

## 获取最近应用

**接口路径**：`GET /api/v1/dashboard/recent-applications`  
**接口说明**：获取用户最近访问的应用列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  limit?: number;        // 返回数量，默认4，最大20
}
```

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
        icon: string;      // emoji或图标URL
        description: string;
        category: ApplicationCategory;
        status: ApplicationStatus;
        lastAccessTime: number;  // 最后访问时间
        apiCalls: number;        // API调用次数
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- "最近使用"部分的应用卡片
- 卡片显示应用图标、名称、描述、状态

---

## 获取推荐工具

**接口路径**：`GET /api/v1/dashboard/recommended-tools`  
**接口说明**：获取系统推荐的工具和应用模板

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  limit?: number;        // 返回数量，默认3
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        title: string;
        description: string;
        icon: string;
        category: string;
        tags: string[];
        usageCount: number;      // 使用次数
        rating: number;          // 评分 0-5
        isTemplate: boolean;     // 是否为模板
        templateId?: number;     // 模板ID
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- "推荐工具"部分的卡片
- 显示工具图标、标题、描述、使用次数

---

## 获取使用分析

**接口路径**：`GET /api/v1/dashboard/analytics`  
**接口说明**：获取详细的使用分析数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  startDate?: number;    // 开始时间戳
  endDate?: number;      // 结束时间戳
  period?: 'hour' | 'day' | 'week' | 'month';  // 聚合周期
  metrics?: string[];    // 指定指标，如['apiCalls', 'tokens']
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
      granularity: string;
    },
    metrics: {
      apiCalls: {
        total: number;
        average: number;
        peak: number;
        data: Array<{
          datetime: number;
          value: number;
        }>;
      },
      tokens: {
        total: number;
        average: number;
        peak: number;
        data: Array<{
          datetime: number;
          value: number;
        }>;
      },
      activeUsers: {
        total: number;
        average: number;
        peak: number;
        data: Array<{
          datetime: number;
          value: number;
        }>;
      },
      successRate: {
        value: number;       // 成功率百分比
        data: Array<{
          datetime: number;
          value: number;
        }>;
      }
    },
    topApplications: [     // 使用最多的应用
      {
        applicationId: number;
        name: string;
        apiCalls: number;
        percentage: number;
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 使用分析页面的各种图表数据
- 趋势图、柱状图、饼图的数据源

---

## 获取快速操作

**接口路径**：`GET /api/v1/dashboard/quick-actions`  
**接口说明**：获取用户的快速操作列表（基于使用习惯）

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
        type: 'create_app' | 'create_workflow' | 'create_dataset' | 'view_analytics';
        label: string;
        icon: string;
        url: string;         // 跳转链接
        frequency: number;   // 使用频率
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 如果Figma中有快速操作按钮区域

## 业务规则

### 统计数据计算规则

1. **API调用次数**：统计时间段内所有应用的API调用总和
2. **Token使用量**：统计时间段内消耗的总Token数
3. **活跃用户数**：统计时间段内至少有一次操作的用户数
4. **变化趋势**：对比上一个周期的数据，计算增长率

### 最近应用规则

1. 按最后访问时间降序排列
2. 最多显示20个
3. 删除的应用不显示
4. 每次访问应用时更新lastAccessTime

### 推荐工具规则

1. 基于用户使用习惯推荐
2. 优先推荐热门工具
3. 考虑用户角色和权限
4. 已使用的工具降低推荐优先级

### 通知规则

1. 系统通知保留30天
2. 未读通知数最多显示99+
3. 删除的通知不可恢复

---

**性能优化建议**：

1. 统计数据建议缓存5分钟
2. 最近应用可以前端缓存
3. 推荐工具每小时更新一次
4. 使用Redis缓存热点数据
