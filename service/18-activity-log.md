# 活动记录模块 API

**Figma来源**：活动记录页面、活动详情弹窗、筛选器、统计卡片  
**模块说明**：团队成员活动记录、操作审计、行为追踪等功能

## 目录
- [获取活动记录列表](#获取活动记录列表)
- [获取活动详情](#获取活动详情)
- [获取活动统计](#获取活动统计)
- [导出活动记录](#导出活动记录)
- [数据类型定义](#数据类型定义)

---

## 获取活动记录列表

**接口路径**：`GET /api/v1/activity-logs`  
**接口说明**：获取团队活动记录列表，支持多维度筛选

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;                // 页码，默认1
  pageSize?: number;            // 每页数量，默认20
  keyword?: string;             // 搜索关键词（用户名、目标名称、描述）
  
  // 筛选条件
  userId?: number;              // 用户ID筛选
  resourceId?: number;            // 目标ID筛选
  resourceType?: FullResourceType;  // 目标类型筛选
  actionType?: ActionType;      // 操作类型筛选
  status?: ActivityStatus;      // 状态筛选
  
  // 时间范围
  startDate?: string;           // 开始日期 "2024-11-01"
  endDate?: string;             // 结束日期 "2024-11-03"
  dateRange?: 'today' | 'yesterday' | 'week' | 'month' | 'all';  // 快速时间范围
  
  // 排序
  sortBy?: 'activityDate' | 'userName' | 'resourceType';  // 排序字段
  sortOrder?: 'asc' | 'desc';   // 排序方向，默认desc
}
```

**Figma对应**：
- `keyword` → 搜索框
- `userId` → 用户筛选下拉框
- `resourceType` → 目标类型筛选
- `actionType` → 操作类型筛选
- `dateRange` → 日期范围选择器
- 活动记录列表

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: number;                    // 活动记录ID
        
        // 用户信息
        userId: number;
        userName: string;
        userAvatar?: string;           // 头像URL
        userAvatarFallback: string;    // 头像占位符 "ZW"
        
        // 目标信息
        resourceId: number;
        resourceType: FullResourceType;  // 见下方枚举定义
        resourceName: string;
        
        // 操作信息
        actionType: ActionType;        // 见下方枚举定义
        description: string;           // 操作描述
        detail?: string;               // 详细信息
        
        // 状态
        status: ActivityStatus;        // 'success' | 'failed' | 'warning'
        
        // 时间
        activityDate: string;          // "2024-11-03 10:30:25"
        relativeTime: string;          // "5分钟前"
        
        // 元数据
        ipAddress?: string;            // IP地址
        userAgent?: string;            // 用户代理
      }
    ],
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    },
    // 当前筛选的汇总统计
    summary: {
      totalActivities: number;
      successCount: number;
      failedCount: number;
      warningCount: number;
      activeUsers: number;
    }
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 活动记录时间线列表
- 每条记录显示：用户头像、用户名、操作类型、目标类型、目标名称、描述、时间、状态
- 分页控件

---

## 获取活动详情

**接口路径**：`GET /api/v1/activity-logs/:id`  
**接口说明**：获取单条活动记录的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                    // 活动记录ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    id: number;
    
    // 用户完整信息
    user: {
      userId: number;
      userName: string;
      userEmail: string;
      userAvatar?: string;
      userRole: string;            // 用户角色
    };
    
    // 目标完整信息
    resource: {
      resourceId: number;
      resourceType: FullResourceType;
      resourceName: string;
      resourceDescription?: string;
      // 目标当前状态（如果仍存在）
      currentStatus?: string;
    };
    
    // 操作详情
    action: {
      actionType: ActionType;
      description: string;
      detail?: string;
      
      // 操作前后对比（如果是UPDATE操作）
      changes?: {
        field: string;
        fieldLabel: string;
        oldValue: any;
        newValue: any;
      }[];
    };
    
    // 状态和结果
    status: ActivityStatus;
    errorMessage?: string;         // 失败时的错误信息
    
    // 时间信息
    activityDate: string;
    duration?: number;             // 操作耗时（毫秒）
    
    // 环境信息
    environment: {
      ipAddress: string;
      userAgent: string;
      browser?: string;
      os?: string;
      device?: string;
    };
    
    // 关联活动（相关的其他操作）
    relatedActivities?: {
      id: number;
      actionType: string;
      description: string;
      activityDate: string;
    }[];
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 活动详情弹窗
- 显示完整的用户信息、目标信息、操作详情、环境信息

---

## 获取活动统计

**接口路径**：`GET /api/v1/activity-logs/statistics`  
**接口说明**：获取活动记录的统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  startDate?: string;            // 统计开始日期
  endDate?: string;              // 统计结束日期
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    // 总体统计
    overview: {
      totalActivities: number;     // 总活动数
      todayActivities: number;     // 今日活动
      activeUsers: number;         // 活跃用户数
      successRate: number;         // 成功率（百分比）
    };
    
    // 操作类型分布
    actionTypeDistribution: {
      actionType: ActionType;
      actionTypeLabel: string;
      count: number;
      percentage: number;
    }[];
    
    // 目标类型分布
    resourceTypeDistribution: {
      resourceType: FullResourceType;
      resourceTypeLabel: string;
      count: number;
      percentage: number;
    }[];
    
    // 状态分布
    statusDistribution: {
      success: number;
      failed: number;
      warning: number;
    };
    
    // 用户活跃度排行
    topActiveUsers: {
      userId: number;
      userName: string;
      userAvatar?: string;
      activityCount: number;
      lastActivityDate: string;
    }[];
    
    // 时间趋势（按小时/天/周）
    timeTrend: {
      timestamp: number;
      date: string;               // "2024-11-03" 或 "2024-11-03 10:00"
      count: number;
      successCount: number;
      failedCount: number;
    }[];
    
    // 热门目标（被操作最多的资源）
    topResources: {
      resourceId: number;
      resourceType: FullResourceType;
      resourceName: string;
      operationCount: number;
      lastOperationDate: string;
    }[];
  },
  timestamp: 1730649625000
}
```

**Figma对应**：
- 统计卡片（今日活动、活跃用户、成功率、总记录数）
- 操作类型分布图表
- 目标类型分布图表
- 时间趋势图表
- 用户活跃度排行

---

## 导出活动记录

**接口路径**：`POST /api/v1/activity-logs/export`  
**接口说明**：导出活动记录为文件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  // 筛选条件（与列表接口相同）
  userId?: number;
  resourceType?: FullResourceType;
  actionType?: ActionType;
  startDate?: string;
  endDate?: string;
  
  // 导出配置
  format: 'csv' | 'excel' | 'json';  // 导出格式
  fields?: string[];             // 要导出的字段（可选）
  includeDetails?: boolean;      // 是否包含详细信息
}
```

**Figma对应**：
- 导出记录按钮
- 导出格式选择

### 响应数据

```typescript
{
  code: 200,
  message: "导出任务已创建",
  data: {
    taskId: string;              // 导出任务ID
    status: 'pending' | 'processing' | 'completed';
    downloadUrl?: string;        // 下载链接（异步生成）
    estimatedTime: number;       // 预计完成时间（秒）
    recordCount: number;         // 要导出的记录数
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 大量数据导出采用异步处理
2. 导出文件有效期24小时
3. 单次最多导出10000条记录
4. 支持CSV、Excel、JSON格式

---

## 获取导出任务状态

**接口路径**：`GET /api/v1/activity-logs/export/:taskId`  
**接口说明**：查询导出任务状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  taskId: string;                // 导出任务ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;            // 进度百分比 0-100
    downloadUrl?: string;        // 完成后的下载链接
    expiresAt?: number;          // 下载链接过期时间
    errorMessage?: string;       // 失败原因
  },
  timestamp: 1730649625000
}
```

---

## 批量删除活动记录

**接口路径**：`DELETE /api/v1/activity-logs`  
**接口说明**：批量删除活动记录（需要管理员权限）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  ids?: number[];                // 要删除的记录ID数组
  
  // 或按条件删除
  olderThan?: string;            // 删除早于指定日期的记录 "2024-01-01"
  resourceType?: FullResourceType;  // 删除指定类型的记录
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "已删除 X 条记录",
  data: {
    deletedCount: number;
  },
  timestamp: 1730649625000
}
```

### 业务规则

1. 只有owner和admin可以删除
2. 删除操作本身会被记录
3. 支持按日期批量清理历史记录
4. 建议保留至少90天的活动记录

---

## 数据类型定义

### FullResourceType（目标类型枚举）

```typescript
enum FullResourceType {
  APPLICATION = 'APPLICATION',           // 应用
  WORKFLOW = 'WORKFLOW',                // 工作流
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',    // 知识库
  DATASET = 'DATASET',                  // 数据集
  MODEL = 'MODEL',                      // 模型
  TEAM_MEMBER = 'TEAM_MEMBER',          // 团队成员
  TEAM_SETTINGS = 'TEAM_SETTINGS',      // 团队设置
  API_KEY = 'API_KEY',                  // API密钥
  PROMPT = 'PROMPT',                    // 提示词
  PLUGIN = 'PLUGIN',                    // 插件
  VECTOR_STORE = 'VECTOR_STORE',        // 向量存储
  API_COLLECTION = 'API_COLLECTION',    // 接口集
  BILLING = 'BILLING',                  // 计费
  SYSTEM = 'SYSTEM'                     // 系统
}
```

### ActionType（操作类型枚举）

```typescript
enum ActionType {
  // 基础操作
  CREATE = 'CREATE',             // 创建
  UPDATE = 'UPDATE',             // 更新
  DELETE = 'DELETE',             // 删除
  VIEW = 'VIEW',                 // 查看
  
  // 协作操作
  SHARE = 'SHARE',               // 分享
  UNSHARE = 'UNSHARE',           // 取消分享
  INVITE = 'INVITE',             // 邀请
  
  // 数据操作
  EXPORT = 'EXPORT',             // 导出
  IMPORT = 'IMPORT',             // 导入
  UPLOAD = 'UPLOAD',             // 上传
  DOWNLOAD = 'DOWNLOAD',         // 下载
  
  // 执行操作
  EXECUTE = 'EXECUTE',           // 执行
  START = 'START',               // 启动
  STOP = 'STOP',                 // 停止
  RESTART = 'RESTART',           // 重启
  
  // 权限操作
  GRANT_PERMISSION = 'GRANT_PERMISSION',     // 授予权限
  REVOKE_PERMISSION = 'REVOKE_PERMISSION',   // 撤销权限
  CHANGE_ROLE = 'CHANGE_ROLE',               // 变更角色
  
  // 配置操作
  CONFIGURE = 'CONFIGURE',       // 配置
  ENABLE = 'ENABLE',             // 启用
  DISABLE = 'DISABLE',           // 禁用
  
  // 其他
  LOGIN = 'LOGIN',               // 登录
  LOGOUT = 'LOGOUT',             // 登出
  COPY = 'COPY',                 // 复制
  MOVE = 'MOVE',                 // 移动
}
```

### ActivityStatus（活动状态枚举）

```typescript
enum ActivityStatus {
  SUCCESS = 'success',           // 成功
  FAILED = 'failed',             // 失败
  WARNING = 'warning',           // 警告
  PENDING = 'pending'            // 待处理（异步操作）
}
```

### 标签颜色映射（前端参考）

```typescript
// 目标类型颜色
const resourceTypeColors = {
  APPLICATION: 'text-blue-500',
  WORKFLOW: 'text-purple-500',
  KNOWLEDGE_BASE: 'text-green-500',
  DATASET: 'text-orange-500',
  MODEL: 'text-indigo-500',
  TEAM_MEMBER: 'text-pink-500',
  API_KEY: 'text-red-500',
  PROMPT: 'text-cyan-500',
};

// 操作类型颜色
const actionTypeColors = {
  CREATE: 'text-green-500',
  UPDATE: 'text-blue-500',
  DELETE: 'text-red-500',
  VIEW: 'text-gray-500',
  SHARE: 'text-purple-500',
  EXPORT: 'text-indigo-500',
  IMPORT: 'text-orange-500',
  EXECUTE: 'text-cyan-500',
};

// 状态颜色
const statusColors = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};
```

---

## 使用场景示例

### 1. 查看今日所有活动

```http
GET /api/v1/activity-logs?dateRange=today&page=1&pageSize=20
```

### 2. 查看某用户的所有操作

```http
GET /api/v1/activity-logs?userId=123&sortBy=activityDate&sortOrder=desc
```

### 3. 查看所有应用相关的操作

```http
GET /api/v1/activity-logs?resourceType=APPLICATION
```

### 4. 查看所有删除操作

```http
GET /api/v1/activity-logs?actionType=DELETE
```

### 5. 查看失败的操作

```http
GET /api/v1/activity-logs?status=failed
```

### 6. 搜索特定资源的操作记录

```http
GET /api/v1/activity-logs?keyword=智能客服助手
```

### 7. 导出本月的活动记录

```http
POST /api/v1/activity-logs/export
Content-Type: application/json

{
  "startDate": "2024-11-01",
  "endDate": "2024-11-30",
  "format": "excel",
  "includeDetails": true
}
```

---

## 业务规则说明

### 记录规则

1. **自动记录**：所有资源的增删改操作自动记录
2. **查看操作**：敏感资源的查看操作需要记录
3. **批量操作**：批量操作记录为单条，detail中包含详细信息
4. **系统操作**：系统自动执行的操作userId为0

### 保留策略

1. **默认保留期**：90天
2. **重要操作**：删除、权限变更等保留1年
3. **自动清理**：定期清理过期记录
4. **手动清理**：管理员可手动清理历史记录

### 权限控制

1. **查看权限**：
   - owner/admin：查看所有活动
   - member：只能查看自己的活动和公开资源的活动
   - viewer：只能查看公开资源的查看记录

2. **导出权限**：owner/admin

3. **删除权限**：仅owner

### 性能优化

1. **分页加载**：大量数据分页查询
2. **索引优化**：userId、resourceType、actionType、activityDate添加索引
3. **缓存策略**：统计数据缓存15分钟
4. **异步导出**：大量数据导出采用异步任务

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 41801 | 活动记录不存在 |
| 41802 | 无权查看该活动记录 |
| 41803 | 导出任务不存在 |
| 41804 | 导出任务已过期 |
| 41805 | 无权删除活动记录 |
| 41806 | 记录数量超过导出限制 |

---

## 前端集成说明

### 1. 实时更新

建议使用WebSocket或轮询方式实时获取最新活动：

```typescript
// WebSocket订阅
ws.subscribe('activity-logs', (newActivity) => {
  // 添加到列表顶部
  activities.unshift(newActivity);
});

// 或者轮询
setInterval(() => {
  fetchLatestActivities();
}, 30000); // 30秒
```

### 2. 时间显示

使用相对时间增强用户体验：

```typescript
// 5分钟内显示"刚刚"
// 1小时内显示"X分钟前"
// 24小时内显示"X小时前"
// 7天内显示"X天前"
// 更早显示完整日期时间
```

### 3. 筛选器状态管理

建议使用URL参数保存筛选状态：

```typescript
const searchParams = new URLSearchParams(window.location.search);
const filters = {
  userId: searchParams.get('userId'),
  resourceType: searchParams.get('resourceType'),
  actionType: searchParams.get('actionType'),
};
```

### 4. 无限滚动

可选择实现无限滚动替代分页：

```typescript
const loadMore = () => {
  if (hasMore && !loading) {
    setPage(page + 1);
    fetchActivities(page + 1);
  }
};
```

---

**最佳实践**：

1. 定期审查活动记录，发现异常操作
2. 关注失败率较高的操作类型
3. 监控敏感资源的访问记录
4. 定期导出关键活动记录备份
5. 设置活动告警，及时发现安全问题
6. 使用活动记录进行用户行为分析
