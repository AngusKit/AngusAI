# API密钥管理模块 API

**Figma来源**：API密钥管理页面、创建密钥对话框、权限配置、使用统计  
**模块说明**：API密钥的创建、管理、权限控制、使用统计等功能

## 目录

- [获取API密钥列表](#获取api密钥列表)
- [获取API密钥详情](#获取api密钥详情)
- [创建API密钥](#创建api密钥)
- [更新API密钥](#更新api密钥)
- [删除API密钥](#删除api密钥)
- [启用/禁用密钥](#启用禁用密钥)
- [刷新密钥](#刷新密钥)
- [使用统计](#使用统计)
- [权限配置](#权限配置)

---

## 获取API密钥列表

**接口路径**：`GET /api/v1/api-keys`  
**接口说明**：获取API密钥列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  keyword?: string;           // 搜索密钥名称
  status?: 'active' | 'inactive' | 'expired';
  orderBy?: 'createdDate' | 'lastUsed' | 'usageCount';
  orderSort?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 搜索框
- `status` → 状态筛选
- 密钥列表表格

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
        key: string;             // 完整密钥（仅创建时返回）
        keyVisible: string;      // 部分可见："sk-abc123***********"
        status: 'active' | 'inactive' | 'expired';
        statusColor: string;

        // 权限
        permissions: Array<'read' | 'write' | 'delete'>;

        // 授权资源
        authorizedResources: Array<{
          type: ResourceType;    // application | workflow | dataset | knowledge | plugin | model
          ids: number[];         // 空数组表示全部
          names?: string[];      // 资源名称列表
        }>;

        // 限制配置
        rateLimit: string;       // "1000次/分钟"
        rateLimitRaw: number;
        dailyLimit?: number;     // 每日限额

        // 统计
        usageCount: number;      // 总使用次数
        lastUsed: string;        // "2分钟前"
        lastUsedAt?: number;

        // 时间
        createdDate: Date
        created: string;         // "2024-01-15"
        expiresAt?: number;      // 过期时间
        expires?: string;        // "2025-01-15"
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

- API密钥列表表格
- 每行显示：名称、密钥（部分可见）、权限、状态、创建时间、最后使用

---

## 获取API密钥详情

**接口路径**：`GET /api/v1/api-keys/:id`  
**接口说明**：获取指定API密钥的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
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
    keyVisible: string;      // 不返回完整密钥
    status: string;

    // 权限详情
    permissions: string[];

    // 授权资源详情
    authorizedResources: Array<{
      type: ResourceType;
      ids: number[];
      resources?: Array<{    // 资源详细信息
        id: number;
        name: string;
        type: string;
      }>;
    }>;

    // 限制配置
    rateLimit: string;
    rateLimitRaw: number;
    dailyLimit?: number;

    // IP白名单
    ipWhitelist?: string[];

    // 使用统计
    usage: {
      total: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    };

    // 最近调用记录
    recentCalls?: Array<{
      datetime: number;
      endpoint: string;
      method: string;
      statusCode: number;
      responseTime: number;
      ip: string;
    }>;

    createdDate: Date
    lastUsedAt?: number;
    expiresAt?: number;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 密钥详情弹窗
- 使用统计图表
- 最近调用记录

---

## 创建API密钥

**接口路径**：`POST /api/v1/api-keys`  
**接口说明**：创建新的API密钥

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|密钥名称|maxLength:50
  description?: string;      // 可选|描述|maxLength:200

  // 权限设置
  permissions: Array<'read' | 'write' | 'delete'>;  // 必填

  // 授权资源
  authorizedResources?: Array<{
    type: ResourceType;
    ids: number[];           // 空数组表示该类型的全部资源
  }>;

  // 限制配置
  rateLimit?: number;        // 可选|速率限制（次/分钟），默认1000
  dailyLimit?: number;       // 可选|每日限额

  // IP白名单
  ipWhitelist?: string[];    // 可选|IP地址列表

  // 过期设置
  expiresIn?: number;        // 可选|有效期（天数），默认365天
  neverExpires?: boolean;    // 可选|永不过期
}
```

**Figma对应**：

- 创建API密钥对话框
- 权限勾选框
- 资源选择器
- 限制配置表单

### 响应数据

```typescript
{
  code: 201,
  msg: "API密钥创建成功",
  data: {
    id: number;
    name: string;
    key: string;             // ⚠️完整密钥仅在此处返回一次
    permissions: string[];
    createdDate: Date
    expiresAt?: number;

    // 警告信息
    warning: "请立即保存此密钥，它只会显示一次！"
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 创建成功后的密钥展示弹窗
- 复制按钮
- 警告提示

### 业务规则

1. 密钥格式：`sk-` + 40位随机字符
2. 密钥创建后只显示一次完整内容
3. 每个用户最多创建50个密钥
4. 默认有效期365天
5. 授权资源为空表示无权限

---

## 更新API密钥

**接口路径**：`PATCH /api/v1/api-keys/:id`  
**接口说明**：更新API密钥配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
}
```

### 请求参数

```typescript
{
  name?: string;
  description?: string;
  permissions?: string[];
  authorizedResources?: Array<{
    type: ResourceType;
    ids: number[];
  }>;
  rateLimit?: number;
  dailyLimit?: number;
  ipWhitelist?: string[];
  expiresAt?: number;        // 更新过期时间
}
```

**Figma对应**：

- 编辑密钥对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的密钥信息
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 无法更新密钥本身，只能更新配置
2. 更新权限会立即生效
3. 缩小权限范围不影响已发起的请求

---

## 删除API密钥

**接口路径**：`DELETE /api/v1/api-keys/:id`  
**接口说明**：删除API密钥

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
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

1. 删除后密钥立即失效
2. 无法恢复
3. 使用历史记录保留

---

## 启用/禁用密钥

**接口路径**：`PATCH /api/v1/api-keys/:id/toggle`  
**接口说明**：切换密钥的启用状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
}
```

### 请求参数

```typescript
{
  status: 'active' | 'inactive';
}
```

**Figma对应**：

- 启用/禁用开关

### 响应数据

```typescript
{
  code: 200,
  msg: "状态已更新",
  data: {
    id: number;
    status: string;
  },
  datetime: 1706889600000
}
```

---

## 刷新密钥

**接口路径**：`POST /api/v1/api-keys/:id/refresh`  
**接口说明**：刷新密钥（生成新密钥，旧密钥失效）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "密钥已刷新",
  data: {
    id: number;
    key: string;             // ⚠️新密钥仅在此处返回一次
    oldKeyVisible: string;   // 旧密钥（部分可见）
    refreshedAt: number;
    warning: "旧密钥已失效，请更新你的应用配置！"
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 刷新密钥按钮
- 确认对话框

### 业务规则

1. 刷新后旧密钥立即失效
2. 保留所有配置和权限
3. 新密钥只显示一次

---

## 获取密钥使用统计

**接口路径**：`GET /api/v1/api-keys/:id/statistics`  
**接口说明**：获取密钥的使用统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
}
```

### 查询参数

```typescript
{
  period?: 'today' | 'week' | 'month' | 'year';
  groupBy?: 'hour' | 'day' | 'week';
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

    // 按接口统计
    byEndpoint: Array<{
      endpoint: string;
      method: string;
      calls: number;
      percentage: number;
    }>;

    // 按状态码统计
    byStatusCode: Record<number, number>;

    // 按IP统计
    byIp: Array<{
      ip: string;
      calls: number;
      location?: string;
    }>;

    // 错误分析
    topErrors: Array<{
      error: string;
      count: number;
      lastOccurred: number;
    }>;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 使用统计Tab
- 趋势图表
- 接口调用分布
- 错误分析

---

## 获取调用日志

**接口路径**：`GET /api/v1/api-keys/:id/logs`  
**接口说明**：获取密钥的调用日志

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 密钥ID
}
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  startTime?: number;        // 开始时间
  endTime?: number;          // 结束时间
  endpoint?: string;         // 筛选接口
  statusCode?: number;       // 筛选状态码
  method?: string;           // 筛选HTTP方法
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
        datetime: number;
        method: string;        // GET, POST, etc.
        endpoint: string;      // /api/v1/applications
        statusCode: number;
        responseTime: number;  // 毫秒

        // 请求信息
        request: {
          ip: string;
          userAgent?: string;
          params?: any;
        };

        // 响应信息
        response: {
          size: number;        // 字节
          error?: string;
        };
      }
    ],
    pagination: Pagination;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 调用日志Tab
- 日志列表表格

---

## 验证API密钥

**接口路径**：`POST /api/v1/api-keys/validate`  
**接口说明**：验证API密钥是否有效

### 请求头

```http
X-API-Key: <API_KEY>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "密钥有效",
  data: {
    valid: boolean;
    keyId: number;
    name: string;
    permissions: string[];
    expiresAt?: number;
    rateLimit: {
      limit: number;
      remaining: number;
      resetAt: number;
    }
  },
  datetime: 1706889600000
}
```

---

## 获取API密钥模板

**接口路径**：`GET /api/v1/api-keys/templates`  
**接口说明**：获取预设的权限配置模板

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
        name: string;          // "只读权限"
        description: string;
        permissions: string[];
        authorizedResources: Array<{
          type: ResourceType;
          ids: number[];
        }>;
        rateLimit: number;
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 创建密钥时的模板选择

### 预设模板

1. **只读权限**：仅read权限，所有资源
2. **全权限**：read/write/delete，所有资源
3. **应用管理**：read/write应用，只读其他
4. **数据访问**：read数据集和知识库
5. **模型调用**：仅模型调用权限

---

## 批量删除密钥

**接口路径**：`POST /api/v1/api-keys/batch-delete`  
**接口说明**：批量删除API密钥

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  keyIds: number[];          // 密钥ID列表
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "批量删除成功",
  data: {
    deletedCount: number;
  },
  datetime: 1706889600000
}
```

---

## 获取全局统计

**接口路径**：`GET /api/v1/api-keys/overview`  
**接口说明**：获取API密钥模块的概览统计

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
    totalKeys: number;
    activeKeys: number;
    inactiveKeys: number;
    expiredKeys: number;

    // 今日统计
    todayStats: {
      calls: number;
      successRate: number;
    };

    // 使用排名
    topKeys: Array<{
      keyId: number;
      name: string;
      calls: number;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 密钥格式

```
sk-[40位随机字符]

示例：sk-abc123def456ghi789jkl012mno345pqr678stu901
```

### 权限类型

- **read**：读取资源
- **write**：创建和更新资源
- **delete**：删除资源

### 资源授权

```typescript
{
  type: 'application',
  ids: []                    // 空数组 = 所有应用
}

{
  type: 'workflow',
  ids: [1, 2, 3]            // 指定ID = 仅这3个工作流
}
```

### 速率限制

- 按分钟计算
- 超过限制返回429错误
- 重置时间在响应头中返回

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706889660
```

### 状态流转

```
创建 → active（激活） → inactive（禁用） → deleted（删除）
                    ↓
                  expired（过期）
```

---

## 错误码

| 错误码 | 说明             |
| ------ | ---------------- |
| 40101  | API密钥不存在    |
| 40102  | API密钥已失效    |
| 40103  | API密钥已过期    |
| 40104  | 权限不足         |
| 40105  | IP不在白名单     |
| 40106  | 超过速率限制     |
| 40107  | 超过每日限额     |
| 40108  | 密钥数量超过限制 |

---

**安全建议**：

1. 密钥使用HTTPS传输
2. 密钥加密存储
3. 定期轮换密钥
4. 设置合理的过期时间
5. 使用IP白名单
6. 监控异常调用
7. 最小权限原则
