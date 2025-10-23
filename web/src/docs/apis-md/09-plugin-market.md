# 插件市场模块 API

**Figma来源**：插件市场页面、插件详情、上传插件、插件管理  
**模块说明**：插件的浏览、安装、卸载、配置、评价等功能

## 目录

- [获取插件列表](#获取插件列表)
- [获取插件详情](#获取插件详情)
- [安装插件](#安装插件)
- [卸载插件](#卸载插件)
- [启用/禁用插件](#启用禁用插件)
- [配置插件](#配置插件)
- [上传插件](#上传插件)
- [更新插件](#更新插件)
- [删除插件](#删除插件)
- [插件评价](#插件评价)

---

## 获取插件列表

**接口路径**：`GET /api/v1/plugins`  
**接口说明**：获取插件市场列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;           // 搜索关键词
  category?: PluginCategory;  // 分类筛选
  sortBy?: 'popular' | 'latest' | 'rating' | 'downloads';
  installed?: boolean;        // 仅已安装
  price?: 'free' | 'paid' | 'all';  // 价格筛选
  tags?: string[];
}
```

**Figma对应**：

- `keyword` → 搜索框
- `category` → 分类筛选下拉框
- `sortBy` → 排序方式选择器
- 网格/列表视图切换

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
        icon: string;          // 图标URL或组件名
        iconBg: string;        // 背景色
        iconColor: string;     // 图标颜色
        category: PluginCategory;
        version: string;       // "1.2.0"
        downloads: string;     // "12.5K"
        downloadsCount: number;
        rating: number;        // 0-5
        reviews: number;       // 评价数量
        price: number;         // 0表示免费
        priceDisplay: string;  // "免费" 或 "¥99"
        installed: boolean;
        enabled: boolean;
        author: string;
        authorId: number;
        tags: string[];

        // 简要信息
        uploadDate: string;    // "2023-10-15"
        uploadedAt: number;
        lastUpdate?: number;

        // 健康状态
        healthStatus?: {
          status: 'healthy' | 'warning' | 'error';
          lastCheck: string;
          message: string;
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

- 插件市场网格卡片或列表
- 每个卡片显示：图标、名称、描述、评分、下载量、价格、安装状态

---

## 获取插件详情

**接口路径**：`GET /api/v1/plugins/:id`  
**接口说明**：获取指定插件的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
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
    fullDescription: string;  // 完整描述（Markdown）
    icon: string;
    iconBg: string;
    iconColor: string;
    category: PluginCategory;
    version: string;
    downloads: string;
    downloadsCount: number;
    rating: number;
    reviews: number;
    price: number;
    installed: boolean;
    enabled: boolean;
    author: string;
    authorId: number;
    tags: string[];

    // 详细信息
    features: string[];      // 功能特性列表
    changelog: string;       // 更新日志
    requirements?: {
      minVersion?: string;   // 最小系统版本
      dependencies?: string[]; // 依赖的其他插件
    };

    // 文件信息
    pluginFiles?: {
      executable: string;    // 可执行文件路径
      yaml: string;          // 配置文件路径
      size: string;          // 文件大小
    };

    // 权限要求
    permissions?: string[];  // 需要的权限列表

    // 配置选项
    configOptions?: Array<{
      key: string;
      label: string;
      type: 'string' | 'number' | 'boolean' | 'select';
      default?: any;
      required: boolean;
      options?: any[];       // select类型的选项
      description?: string;
    }>;

    // 健康状态
    healthStatus?: {
      status: 'healthy' | 'warning' | 'error';
      lastCheck: string;
      message: string;
      details?: any;
    };

    // API统计（已安装时）
    apiStats?: {
      totalCalls: number;
      successRate: number;
      avgResponseTime: number;
      last24Hours: number;
    };

    // 时间信息
    uploadDate: string;
    uploadedAt: number;
    lastUpdate?: number;
    installedAt?: number;    // 安装时间
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 插件详情对话框
- 显示完整描述、功能、评价、更新日志等

---

## 安装插件

**接口路径**：`POST /api/v1/plugins/:id/install`  
**接口说明**：安装插件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  autoEnable?: boolean;      // 安装后自动启用，默认true
  config?: Record<string, any>; // 初始配置
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "安装成功",
  data: {
    id: number;
    name: string;
    version: string;
    installed: boolean;
    enabled: boolean;
    installedAt: number;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 插件卡片上的"安装"按钮
- 详情页的"安装"按钮

### 业务规则

1. 付费插件需要先购买
2. 检查系统版本兼容性
3. 检查依赖插件是否已安装
4. 安装后默认启用
5. 下载量+1

---

## 卸载插件

**接口路径**：`POST /api/v1/plugins/:id/uninstall`  
**接口说明**：卸载插件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  removeData?: boolean;      // 是否删除插件数据，默认false
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "卸载成功",
  data: {
    id: number;
    installed: false;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 已安装插件的"卸载"按钮

### 业务规则

1. 卸载前自动禁用
2. 检查是否有其他插件依赖
3. 可选择保留或删除插件数据

---

## 启用/禁用插件

**接口路径**：`PATCH /api/v1/plugins/:id/toggle`  
**接口说明**：切换插件的启用状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
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
  message: "状态已更新",
  data: {
    id: number;
    enabled: boolean;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 已安装插件列表的启用/禁用开关

---

## 配置插件

**接口路径**：`PUT /api/v1/plugins/:id/config`  
**接口说明**：更新插件配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  config: Record<string, any>; // 配置键值对
}
```

**Figma对应**：

- 插件配置对话框
- 根据configOptions动态生成表单

### 响应数据

```typescript
{
  code: 200,
  message: "配置已更新",
  data: {
    id: number;
    config: Record<string, any>;
  },
  timestamp: 1706889600000
}
```

---

## 获取插件配置

**接口路径**：`GET /api/v1/plugins/:id/config`  
**接口说明**：获取插件当前配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    config: Record<string, any>;
    schema: Array<{          // 配置项定义
      key: string;
      label: string;
      type: string;
      default: any;
      required: boolean;
      options?: any[];
      description?: string;
    }>;
  },
  timestamp: 1706889600000
}
```

---

## 上传插件

**接口路径**：`POST /api/v1/plugins/upload`  
**接口说明**：上传新插件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  // 基本信息
  name: string;              // 必填|插件名称
  description: string;       // 必填|简短描述
  fullDescription: string;   // 必填|完整描述
  category: PluginCategory;  // 必填|分类
  version: string;           // 必填|版本号
  tags?: string[];           // 可选|标签

  // 文件
  pluginFile: File;          // 必填|插件文件（zip）
  icon?: File;               // 可选|图标文件

  // 详细信息
  features?: string[];       // 功能列表
  changelog?: string;        // 更新日志
  requirements?: {
    minVersion?: string;
    dependencies?: string[];
  };
  permissions?: string[];    // 权限要求

  // 定价
  price?: number;            // 价格，0表示免费

  // 配置定义
  configSchema?: string;     // JSON字符串，配置项定义
}
```

**Figma对应**：

- 上传插件对话框
- 多步骤表单

### 响应数据

```typescript
{
  code: 201,
  message: "插件上传成功，待审核",
  data: {
    id: number;
    name: string;
    version: string;
    status: 'pending';       // 待审核
    uploadedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 插件文件必须是zip格式
2. 包含manifest.json或plugin.yaml
3. 自动扫描病毒和恶意代码
4. 上传后进入审核流程
5. 审核通过后才能在市场显示

---

## 更新插件

**接口路径**：`PUT /api/v1/plugins/:id`  
**接口说明**：更新插件信息（作者）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  description?: string;
  fullDescription?: string;
  features?: string[];
  changelog?: string;
  tags?: string[];
  icon?: File;

  // 如果上传新版本
  newVersion?: string;
  pluginFile?: File;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "更新成功",
  data: {
    // 返回更新后的插件信息
  },
  timestamp: 1706889600000
}
```

---

## 删除插件

**接口路径**：`DELETE /api/v1/plugins/:id`  
**接口说明**：删除插件（作者）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
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

1. 只能删除自己上传的插件
2. 如果有用户安装，需要通知
3. 已购买用户可继续使用
4. 从市场下架，不再显示

---

## 获取插件评价列表

**接口路径**：`GET /api/v1/plugins/:id/reviews`  
**接口说明**：获取插件的评价列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'helpful' | 'rating';
  rating?: number;           // 筛选评分
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
        userId: number;
        user: string;
        avatar: string;
        rating: number;        // 1-5
        date: string;
        dateTimestamp: number;
        content: string;
        helpful: number;       // 有帮助数
        hasVoted: boolean;     // 当前用户是否已投票
      }
    ],
    pagination: Pagination;
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 插件详情页的评价Tab
- 评分分布图
- 评价列表

---

## 提交插件评价

**接口路径**：`POST /api/v1/plugins/:id/reviews`  
**接口说明**：提交插件评价

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  rating: number; // 必填|评分 1-5
  content: string; // 必填|评价内容|maxLength:500
}
```

**Figma对应**：

- 插件详情页的评价表单
- 星级评分 + 文本输入

### 响应数据

```typescript
{
  code: 201,
  message: "评价提交成功",
  data: {
    id: number;
    rating: number;
    content: string;
    createdAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 只有安装过的用户可评价
2. 每个用户只能评价一次
3. 可以修改自己的评价
4. 评价会影响插件总评分

---

## 更新评价

**接口路径**：`PATCH /api/v1/plugins/:pluginId/reviews/:reviewId`  
**接口说明**：更新自己的评价

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  pluginId: number;
  reviewId: number;
}
```

### 请求参数

```typescript
{
  rating?: number;
  content?: string;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "评价已更新",
  data: {
    // 返回更新后的评价
  },
  timestamp: 1706889600000
}
```

---

## 删除评价

**接口路径**：`DELETE /api/v1/plugins/:pluginId/reviews/:reviewId`  
**接口说明**：删除评价

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  pluginId: number;
  reviewId: number;
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

## 评价投票

**接口路径**：`POST /api/v1/plugins/:pluginId/reviews/:reviewId/vote`  
**接口说明**：对评价投"有帮助"票

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  pluginId: number;
  reviewId: number;
}
```

### 请求参数

```typescript
{
  helpful: boolean; // true有帮助，false取消
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    reviewId: number;
    helpful: number;         // 更新后的有帮助数
    hasVoted: boolean;
  },
  timestamp: 1706889600000
}
```

---

## 购买插件

**接口路径**：`POST /api/v1/plugins/:id/purchase`  
**接口说明**：购买付费插件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 请求参数

```typescript
{
  paymentMethod: PaymentMethod; // 支付方式
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "购买成功",
  data: {
    orderId: string;
    pluginId: number;
    amount: number;
    paymentStatus: 'paid';
    purchasedAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 获取已安装插件

**接口路径**：`GET /api/v1/plugins/installed`  
**接口说明**：获取已安装的插件列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  enabled?: boolean;         // 筛选启用状态
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: Plugin[];         // 包含完整插件信息
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- "已安装"Tab的插件列表

---

## 获取插件统计

**接口路径**：`GET /api/v1/plugins/statistics`  
**接口说明**：获取插件市场统计数据

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
    totalPlugins: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    installedPlugins: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    totalDownloads: {
      value: string;         // "256K"
      rawValue: number;
    },
    averageRating: {
      value: number;         // 4.5
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 插件市场页面顶部统计卡片

---

## 检查插件健康状态

**接口路径**：`GET /api/v1/plugins/:id/health`  
**接口说明**：检查插件运行健康状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 插件ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    status: 'healthy' | 'warning' | 'error';
    lastCheck: string;
    message: string;
    details?: {
      responseTime?: number;
      errorRate?: number;
      lastError?: string;
    };
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 插件状态流转

```
上传 → pending（待审核） → approved（已批准） → published（已发布）
                         ↓
                      rejected（拒绝） → 可修改重新提交

published → deprecated（已弃用）
```

### 安装状态

```
未安装 → installing（安装中） → installed（已安装，禁用）
                                    ↓
                                  enabled（启用）
```

### 权限系统

插件可能需要以下权限：

- 读取文件
- 写入文件
- 网络访问
- 数据库访问
- API调用
- 系统设置修改

---

## 错误码

| 错误码 | 说明           |
| ------ | -------------- |
| 40901  | 插件不存在     |
| 40902  | 插件未安装     |
| 40903  | 版本不兼容     |
| 40904  | 缺少依赖插件   |
| 40905  | 权限不足       |
| 40906  | 配置无效       |
| 40907  | 已安装相同插件 |
| 40908  | 需要先购买     |

---

**性能优化建议**：

1. 插件列表使用分页
2. 图标使用CDN
3. 评价列表分页加载
4. 下载统计异步更新
5. 健康检查定时任务
6. 配置缓存在本地
