# 工作流模块 API

**Figma来源**：工作流页面、工作流编辑器、操作日志  
**模块说明**：工作流的创建、编辑、执行、监控等功能

## 目录

- [获取工作流列表](#获取工作流列表)
- [获取工作流详情](#获取工作流详情)
- [创建工作流](#创建工作流)
- [更新工作流](#更新工作流)
- [删除工作流](#删除工作流)
- [复制工作流](#复制工作流)
- [获取工作流统计](#获取工作流统计)
- [执行工作流](#执行工作流)
- [停止工作流](#停止工作流)
- [获取执行日志](#获取执行日志)
- [获取工作流版本](#获取工作流版本)
- [节点管理](#节点管理)

---

## 获取工作流列表

**接口路径**：`GET /api/v1/workflows`  
**接口说明**：获取工作流列表

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
  type?: WorkflowType;        // 工作流类型筛选
  status?: WorkflowStatus;    // 状态筛选
  sortBy?: 'createdAt' | 'updatedAt' | 'calls' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 工作流页面顶部搜索框
- `type` → 类型筛选下拉框
- `status` → 状态筛选（运行中/已停止）
- 网格视图和表格视图切换

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
        icon: string;            // 图标emoji或URL
        iconBg: string;          // 背景色类名
        iconColor: string;       // 图标颜色类名
        type: WorkflowType;      // 单轮任务流 | 多轮对话流（记忆）
        status: WorkflowStatus;  // active | draft | archived
        enabled: boolean;        // 是否启用
        nodesCount: number;      // 节点数量
        version: string;         // 版本号
        createdAt: number;
        updatedAt: number;

        // 统计信息
        stats: {
          todayCalls: number;      // 今日调用次数
          totalCalls: number;      // 总调用次数
          successRate: number;     // 成功率百分比
          avgExecutionTime: number; // 平均执行时间（毫秒）
        }
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

- 工作流列表页的网格卡片或表格行
- 每个卡片显示：图标、名称、状态、今日运行次数、成功率
- 操作按钮：运行、编辑、查看、复制、删除

---

## 获取工作流详情

**接口路径**：`GET /api/v1/workflows/:id`  
**接口说明**：获取指定工作流的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
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
    iconColor: string;
    type: WorkflowType;
    status: WorkflowStatus;
    enabled: boolean;
    version: string;
    createdAt: number;
    updatedAt: number;
    createdBy: number;

    // 工作流配置
    config: {
      // 流程定义
      nodes: WorkflowNode[];
      edges: WorkflowEdge[];

      // 运行配置
      maxExecutionTime: number;  // 最大执行时间（秒）
      retryOnError: boolean;     // 错误时重试
      maxRetries: number;        // 最大重试次数

      // 触发配置
      triggers: {
        type: 'manual' | 'schedule' | 'webhook' | 'event';
        config?: any;  // 具体触发配置
      }[];

      // 变量定义
      variables: Array<{
        name: string;
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        defaultValue?: any;
        required: boolean;
        description?: string;
      }>;
    },

    // 统计数据
    stats: {
      totalExecutions: number;
      successfulExecutions: number;
      failedExecutions: number;
      avgExecutionTime: number;
      lastExecutionTime?: number;
      lastExecutionStatus?: 'success' | 'failed' | 'running';
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 工作流编辑器的画布内容
- 节点和连线数据
- 工作流配置面板

---

## 创建工作流

**接口路径**：`POST /api/v1/workflows`  
**接口说明**：创建新工作流

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  name: string;              // 必填|工作流名称|maxLength:50
  description: string;       // 必填|描述|maxLength:500
  icon?: string;             // 可选|图标emoji
  iconBg?: string;           // 可选|背景色
  iconColor?: string;        // 可选|图标颜色
  type: WorkflowType;        // 必填|工作流类型

  // 可选：从模板创建
  templateId?: number;       // 模板ID

  // 可选：初始配置
  config?: {
    nodes?: WorkflowNode[];
    edges?: WorkflowEdge[];
    variables?: any[];
  };
}
```

**Figma对应**：

- 创建工作流对话框
- 名称、描述、类型选择器

### 响应数据

```typescript
{
  code: 201,
  message: "工作流创建成功",
  data: {
    id: number;
    name: string;
    description: string;
    type: WorkflowType;
    status: 'draft';         // 新创建默认为草稿
    version: '1.0.0';
    createdAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 新创建的工作流默认状态为draft
2. 如果从模板创建，复制模板的节点和配置
3. 自动初始化开始和结束节点
4. 工作流名称在用户空间内需唯一

---

## 更新工作流

**接口路径**：`PATCH /api/v1/workflows/:id`  
**接口说明**：更新工作流基本信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
}
```

### 请求参数

```typescript
{
  name?: string;
  description?: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  type?: WorkflowType;
}
```

**Figma对应**：

- 编辑工作流信息对话框

### 响应数据

```typescript
{
  code: 200,
  message: "更新成功",
  data: {
    // 返回更新后的工作流信息
  },
  timestamp: 1706889600000
}
```

---

## 更新工作流配置

**接口路径**：`PUT /api/v1/workflows/:id/config`  
**接口说明**：更新工作流的节点和配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
}
```

### 请求参数

```typescript
{
  nodes: WorkflowNode[];     // 节点列表
  edges: WorkflowEdge[];     // 连线列表
  variables?: Array<{
    name: string;
    type: string;
    defaultValue?: any;
    required: boolean;
  }>;
  config?: {
    maxExecutionTime?: number;
    retryOnError?: boolean;
    maxRetries?: number;
  };
}
```

**Figma对应**：

- 工作流编辑器的保存按钮
- 拖拽添加节点
- 连线操作
- 配置面板

### 响应数据

```typescript
{
  code: 200,
  message: "配置保存成功",
  data: {
    id: number;
    version: string;        // 版本号自动递增
    updatedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 每次保存自动创建新版本
2. 验证节点连接的有效性
3. 检查是否存在循环依赖
4. 必须包含开始和结束节点

---

## 删除工作流

**接口路径**：`DELETE /api/v1/workflows/:id`  
**接口说明**：删除工作流

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
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

1. 运行中的工作流不能删除
2. 删除后不会删除执行历史
3. 软删除，保留30天可恢复

---

## 复制工作流

**接口路径**：`POST /api/v1/workflows/:id/duplicate`  
**接口说明**：复制工作流

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 源工作流ID
}
```

### 请求参数

```typescript
{
  name?: string;             // 可选|新工作流名称，默认为"xxx的副本"
}
```

### 响应数据

```typescript
{
  code: 201,
  message: "复制成功",
  data: {
    // 返回新工作流的完整信息
  },
  timestamp: 1706889600000
}
```

---

## 获取工作流统计

**接口路径**：`GET /api/v1/workflows/statistics`  
**接口说明**：获取工作流模块的总体统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  period?: 'today' | 'week' | 'month' | 'year';  // 统计周期
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    totalWorkflows: {
      value: number;
      change: string;        // "+8%"
      trend: 'up' | 'down';
    },
    runningWorkflows: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    todayCalls: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    },
    successRate: {
      value: number;         // 成功率百分比
      change: string;
      trend: 'up' | 'down';
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：

- 工作流页面顶部的4个统计卡片
- 工作流总数、运行中、今日调用、成功率

---

## 执行工作流

**接口路径**：`POST /api/v1/workflows/:id/execute`  
**接口说明**：手动执行工作流

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
}
```

### 请求参数

```typescript
{
  inputs?: Record<string, any>;  // 输入变量
  mode?: 'sync' | 'async';       // 执行模式，默认async
}
```

**Figma对应**：

- 工作流卡片上的运行按钮
- 表格视图中的运行图标

### 响应数据

```typescript
// 同步模式
{
  code: 200,
  message: "执行成功",
  data: {
    executionId: string;
    status: 'success' | 'failed';
    result: any;               // 执行结果
    executionTime: number;     // 执行时间（毫秒）
    startedAt: number;
    completedAt: number;
  },
  timestamp: 1706889600000
}

// 异步模式
{
  code: 202,
  message: "执行已启动",
  data: {
    executionId: string;
    status: 'running';
    startedAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 停止工作流执行

**接口路径**：`POST /api/v1/workflows/:id/stop`  
**接口说明**：停止正在运行的工作流

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
}
```

### 请求参数

```typescript
{
  executionId?: string;      // 可选|特定执行ID，不传则停止所有
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "已停止",
  data: {
    stoppedExecutions: string[];  // 已停止的执行ID列表
  },
  timestamp: 1706889600000
}
```

---

## 获取执行日志

**接口路径**：`GET /api/v1/workflows/execution-logs`  
**接口说明**：获取工作流执行日志

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  workflowId?: number;       // 筛选特定工作流
  workflowName?: string;     // 按工作流名称筛选
  status?: 'success' | 'failed' | 'running';
  keyword?: string;          // 搜索关键词
  startDate?: number;
  endDate?: number;
}
```

**Figma对应**：

- 工作流页面下方的"最近操作"表格
- 搜索框、工作流筛选下拉框
- 分页组件

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: number;
        executionId: string;
        workflowId: number;
        workflowName: string;
        activity: string;        // 活动描述
        status: 'success' | 'failed' | 'running';
        statusColor: string;     // 状态颜色类名
        operator: string;        // 操作人
        executionTime?: number;  // 执行时间（毫秒）
        createdTime: string;     // "2023-10-15 14:30:25"
        createdAt: number;       // 时间戳

        // 详细信息
        inputs?: any;
        outputs?: any;
        error?: string;          // 错误信息
        nodeExecutions?: Array<{
          nodeId: string;
          nodeName: string;
          status: string;
          executionTime: number;
        }>;
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

- 操作日志表格的每一行
- 显示：工作流名称、活动、状态、操作人、时间

---

## 获取执行详情

**接口路径**：`GET /api/v1/workflows/executions/:executionId`  
**接口说明**：获取特定执行的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  executionId: string; // 执行ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    executionId: string;
    workflowId: number;
    workflowName: string;
    status: 'success' | 'failed' | 'running';
    startedAt: number;
    completedAt?: number;
    executionTime?: number;

    // 输入输出
    inputs: any;
    outputs?: any;

    // 节点执行详情
    nodeExecutions: Array<{
      nodeId: string;
      nodeName: string;
      nodeType: NodeType;
      status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
      startedAt?: number;
      completedAt?: number;
      executionTime?: number;
      inputs?: any;
      outputs?: any;
      error?: string;
      logs?: string[];
    }>;

    // 错误信息
    error?: {
      message: string;
      nodeId?: string;
      stack?: string;
    };
  },
  timestamp: 1706889600000
}
```

---

## 获取工作流版本列表

**接口路径**：`GET /api/v1/workflows/:id/versions`  
**接口说明**：获取工作流的所有版本

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
}
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
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
        versionId: number;
        version: string;       // "1.0.0"
        description?: string;  // 版本描述
        createdAt: number;
        createdBy: number;
        createdByName: string;
        isCurrent: boolean;    // 是否为当前版本

        // 变更摘要
        changes: {
          nodesAdded: number;
          nodesRemoved: number;
          nodesModified: number;
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

---

## 获取特定版本

**接口路径**：`GET /api/v1/workflows/:id/versions/:versionId`  
**接口说明**：获取工作流的特定版本详情

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
  versionId: number; // 版本ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    versionId: number;
    version: string;
    config: {
      nodes: WorkflowNode[];
      edges: WorkflowEdge[];
      variables: any[];
    },
    createdAt: number;
    createdBy: number;
  },
  timestamp: 1706889600000
}
```

---

## 恢复到特定版本

**接口路径**：`POST /api/v1/workflows/:id/versions/:versionId/restore`  
**接口说明**：恢复工作流到特定版本

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
  versionId: number; // 版本ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "已恢复到版本 1.2.0",
  data: {
    newVersionId: number;
    newVersion: string;      // 恢复后创建的新版本号
  },
  timestamp: 1706889600000
}
```

---

## 启用/禁用工作流

**接口路径**：`PATCH /api/v1/workflows/:id/toggle`  
**接口说明**：切换工作流的启用状态

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 工作流ID
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
    status: WorkflowStatus;
  },
  timestamp: 1706889600000
}
```

---

## 节点类型定义

### WorkflowNode（工作流节点）

```typescript
interface WorkflowNode {
  id: string; // 节点唯一ID
  type: NodeType; // 节点类型
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string; // 节点标签
    config?: any; // 节点特定配置
  };
  style?: {
    // 节点样式
    background?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
  };
}
```

### WorkflowEdge（工作流连线）

```typescript
interface WorkflowEdge {
  id: string; // 连线唯一ID
  source: string; // 源节点ID
  target: string; // 目标节点ID
  sourceHandle?: string; // 源节点句柄
  targetHandle?: string; // 目标节点句柄
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
  animated?: boolean; // 是否动画
  label?: string; // 连线标签
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
}
```

---

## 业务规则说明

### 工作流状态流转

```
创建 → draft → active → running → completed
              ↓                     ↓
            archived              failed → 可重试
```

### 执行规则

1. 必须从开始节点开始
2. 按照连线顺序执行
3. 支持条件分支
4. 支持并行执行
5. 错误时可配置重试
6. 超时自动终止

### 节点类型

- **start**: 开始节点（必须）
- **end**: 结束节点（必须）
- **llm**: LLM处理节点
- **condition**: 条件判断节点
- **tool**: 工具调用节点
- **code**: 代码执行节点
- **template**: 模板节点
- **knowledge**: 知识库检索节点

### 版本控制

1. 每次保存自动创建新版本
2. 版本号遵循语义化版本（Semantic Versioning）
3. 支持查看历史版本
4. 支持恢复到任意版本
5. 恢复操作会创建新版本

---

## 错误码

| 错误码 | 说明                     |
| ------ | ------------------------ |
| 40001  | 工作流不存在             |
| 40002  | 工作流正在运行，无法删除 |
| 40003  | 节点配置无效             |
| 40004  | 检测到循环依赖           |
| 40005  | 缺少开始或结束节点       |
| 40006  | 执行超时                 |
| 40007  | 版本不存在               |

---

**性能优化建议**：

1. 执行日志使用分页加载
2. 大型工作流建议异步执行
3. 实时执行状态使用WebSocket推送
4. 节点执行日志异步写入
5. 统计数据建议缓存
6. 版本历史考虑归档策略
