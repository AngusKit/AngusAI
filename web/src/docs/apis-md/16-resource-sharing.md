# 资源共享模块 API

**Figma来源**：资源共享页面、ResourceSharing组件  
**模块说明**：团队资源共享管理、权限控制、访问统计等功能

## 目录

- [获取共享资源列表](#获取共享资源列表)
- [获取共享详情](#获取共享详情)
- [创建资源共享](#创建资源共享)
- [更新共享权限](#更新共享权限)
- [取消资源共享](#取消资源共享)
- [获取可共享成员](#获取可共享成员)
- [共享访问统计](#共享访问统计)

---

## 获取共享资源列表

**接口路径**：`GET /api/v1/sharing/resources`  
**接口说明**：获取当前用户可访问的共享资源列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;           // 搜索资源名称

  // 筛选
  type?: 'application' | 'workflow' | 'dataset' | 'knowledge' | 'model';
  permission?: 'view' | 'edit' | 'manage';
  sharedWith?: 'all' | 'specific';  // 共享范围
  ownedByMe?: boolean;        // 我创建的
  sharedToMe?: boolean;       // 共享给我的

  orderBy?: 'name' | 'lastShared' | 'views' | 'edits';
  orderSort?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 搜索框
- `type` → 类型筛选下拉框
- `permission` → 权限筛选
- Tab切换：全部、我的共享、共享给我

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        resourceId: number;     // 资源ID
        resourceName: string;
        resourceType: 'application' | 'workflow' | 'dataset' | 'knowledge' | 'model';
        resourceTypeLabel: string;  // "应用", "工作流"

        // 资源图标配置
        icon: string;           // 图标名称
        iconBg: string;         // "bg-blue-100"
        iconColor: string;      // "text-blue-600"

        // 所有者信息
        owner: {
          userId: number;
          userName: string;
          email: string;
          avatar?: string;
        };

        // 共享信息
        sharedWith: 'all' | 'specific';
        sharedWithLabel: string;  // "全体成员", "部分成员"
        memberCount: number;    // 共享给几个成员

        // 权限
        permission: 'view' | 'edit' | 'manage';
        permissionLabel: string;  // "查看", "编辑", "管理"

        // 统计
        views: number;          // 访问次数
        edits: number;          // 编辑次数
        lastShared: string;     // "2小时前"
        lastSharedAt: number;

        // 时间
        createdDate: Date
        createdDate: string;    // "2024-03-15"
      }
    ],

    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    },

    // 统计摘要
    summary: {
      totalResources: number;
      byType: {
        application: number;
        workflow: number;
        dataset: number;
        knowledge: number;
        model: number;
      };
      byPermission: {
        view: number;
        edit: number;
        manage: number;
      };
    }
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 共享资源列表卡片
- 每个卡片显示：图标、名称、类型、所有者、共享范围、权限、统计

---

## 获取共享详情

**接口路径**：`GET /api/v1/sharing/resources/:id`  
**接口说明**：获取资源共享的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    resourceId: number;
    resourceName: string;
    resourceType: string;

    owner: {
      userId: number;
      userName: string;
      email: string;
      avatar?: string;
    };

    // 共享配置
    sharedWith: 'all' | 'specific';
    permission: 'view' | 'edit' | 'manage';

    // 共享成员列表（specific时）
    members?: Array<{
      userId: number;
      userName: string;
      email: string;
      avatar?: string;
      permission: 'view' | 'edit' | 'manage';
      sharedAt: number;
      lastAccessed?: number;
      accessCount: number;
    }>;

    // 访问统计
    statistics: {
      totalViews: number;
      totalEdits: number;
      uniqueVisitors: number;
      avgAccessesPerUser: number;

      // 访问趋势（最近7天）
      viewTrend: Array<{
        date: string;
        views: number;
        users: number;
      }>;
    };

    // 最近活动
    recentActivities: Array<{
      userId: number;
      userName: string;
      action: 'view' | 'edit' | 'download';
      actionLabel: string;
      datetime: number;
    }>;

    createdDate: Date
    lastModifiedDate: Date;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 共享详情对话框
- 成员列表
- 访问统计图表
- 活动记录

---

## 创建资源共享

**接口路径**：`POST /api/v1/sharing/resources`  
**接口说明**：创建新的资源共享

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  resourceId: number;        // 必填|资源ID
  resourceType: 'application' | 'workflow' | 'dataset' | 'knowledge' | 'model';

  // 共享范围
  sharedWith: 'all' | 'specific';  // 必填

  // 权限设置
  permission: 'view' | 'edit' | 'manage';  // 必填

  // 指定成员（sharedWith为specific时必填）
  memberIds?: number[];

  // 可选：通知设置
  notifyMembers?: boolean;   // 是否发送通知，默认true
  message?: string;          // 通知消息
}
```

**Figma对应**：

- 共享资源对话框
- 共享范围单选框（全体成员/指定成员）
- 权限选择
- 成员选择列表

### 响应数据

```typescript
{
  code: 201,
  msg: "资源已共享",
  data: {
    id: number;
    resourceId: number;
    resourceName: string;
    sharedWith: string;
    permission: string;
    memberCount: number;
    createdDate: Date
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 只有资源所有者可以创建共享
2. 同一资源只能有一个共享配置
3. 共享给全体成员时，新加入的成员自动获得访问权限
4. 创建共享后自动发送通知（除非关闭）

---

## 更新共享权限

**接口路径**：`PATCH /api/v1/sharing/resources/:id`  
**接口说明**：更新资源共享配置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 请求参数

```typescript
{
  sharedWith?: 'all' | 'specific';
  permission?: 'view' | 'edit' | 'manage';

  // 更新成员列表（sharedWith为specific时）
  memberIds?: number[];

  // 可选：单独设置某个成员的权限
  memberPermissions?: Array<{
    userId: number;
    permission: 'view' | 'edit' | 'manage';
  }>;

  notifyMembers?: boolean;
}
```

**Figma对应**：

- 编辑共享设置对话框
- 权限变更
- 成员添加/移除

### 响应数据

```typescript
{
  code: 200,
  msg: "共享设置已更新",
  data: {
    id: number;
    updatedFields: string[];
    lastModifiedDate: Date;
  },
  datetime: 1706889600000
}
```

---

## 取消资源共享

**接口路径**：`DELETE /api/v1/sharing/resources/:id`  
**接口说明**：取消资源共享

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 查询参数

```typescript
{
  notifyMembers?: boolean;   // 是否通知成员，默认true
}
```

**Figma对应**：

- 取消共享按钮
- 确认对话框

### 响应数据

```typescript
{
  code: 204,
  msg: "共享已取消",
  datetime: 1706889600000
}
```

### 业务规则

1. 只有资源所有者可以取消共享
2. 取消后所有成员立即失去访问权限
3. 自动通知受影响的成员

---

## 移除共享成员

**接口路径**：`DELETE /api/v1/sharing/resources/:id/members/:userId`  
**接口说明**：从共享中移除特定成员

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
  userId: number; // 成员用户ID
}
```

### 响应数据

```typescript
{
  code: 204,
  msg: "成员已移除",
  datetime: 1706889600000
}
```

---

## 批量添加成员

**接口路径**：`POST /api/v1/sharing/resources/:id/members`  
**接口说明**：批量添加共享成员

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 请求参数

```typescript
{
  memberIds: number[];       // 必填|成员ID列表
  permission?: 'view' | 'edit' | 'manage';  // 默认继承共享设置
  notifyMembers?: boolean;
  message?: string;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "成员已添加",
  data: {
    addedCount: number;
    members: Array<{
      userId: number;
      userName: string;
      permission: string;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 获取可共享成员列表

**接口路径**：`GET /api/v1/sharing/available-members`  
**接口说明**：获取可以共享给的团队成员列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  resourceId?: number;       // 可选|排除已共享的成员
  keyword?: string;          // 搜索成员
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
        userId: number;
        userName: string;
        email: string;
        avatar?: string;
        avatarFallback: string;
        role: string;          // 团队角色
        isShared: boolean;     // 是否已共享给该成员
      }
    ]
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 成员选择列表
- 成员搜索
- 已选成员标记

---

## 获取共享访问统计

**接口路径**：`GET /api/v1/sharing/resources/:id/statistics`  
**接口说明**：获取资源共享的访问统计

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 查询参数

```typescript
{
  period?: 'week' | 'month' | 'quarter';
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    overview: {
      totalViews: number;
      totalEdits: number;
      totalDownloads: number;
      uniqueVisitors: number;
    },

    // 访问趋势
    viewTrend: Array<{
      date: string;
      views: number;
      edits: number;
      uniqueUsers: number;
    }>;

    // Top访问者
    topVisitors: Array<{
      userId: number;
      userName: string;
      views: number;
      edits: number;
      lastAccessed: number;
    }>;

    // 按操作类型统计
    byAction: {
      view: number;
      edit: number;
      download: number;
      copy: number;
    };

    // 按时段统计
    byHour: Array<{
      hour: number;           // 0-23
      count: number;
    }>;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 访问统计图表
- Top访问者列表
- 操作分布

---

## 获取我的共享统计

**接口路径**：`GET /api/v1/sharing/my-statistics`  
**接口说明**：获取当前用户的共享统计概览

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
    // 我创建的共享
    sharedByMe: {
      total: number;
      byType: {
        application: number;
        workflow: number;
        dataset: number;
        knowledge: number;
        model: number;
      };
      totalViews: number;
      totalMembers: number;
    };

    // 共享给我的
    sharedToMe: {
      total: number;
      byType: Record<string, number>;
      recentlyAccessed: number;
    };

    // 最近活动
    recentActivities: Array<{
      resourceId: number;
      resourceName: string;
      resourceType: string;
      action: string;
      userId: number;
      userName: string;
      datetime: number;
    }>;
  },
  datetime: 1706889600000
}
```

---

## 检查资源访问权限

**接口路径**：`GET /api/v1/sharing/check-access`  
**接口说明**：检查当前用户对资源的访问权限

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  resourceId: number;
  resourceType: string;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    hasAccess: boolean;
    permission?: 'view' | 'edit' | 'manage';
    isOwner: boolean;
    sharedBy?: {
      userId: number;
      userName: string;
    };
    sharedAt?: number;
  },
  datetime: 1706889600000
}
```

---

## 记录访问日志

**接口路径**：`POST /api/v1/sharing/resources/:id/access`  
**接口说明**：记录资源访问（自动调用）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 共享ID
}
```

### 请求参数

```typescript
{
  action: 'view' | 'edit' | 'download' | 'copy';
  metadata?: Record<string, any>;  // 可选的元数据
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "已记录",
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 权限层级

```
manage（管理） > edit（编辑） > view（查看）
```

| 权限       | 可执行操作                    |
| ---------- | ----------------------------- |
| **view**   | 查看资源内容、导出、复制      |
| **edit**   | view权限 + 编辑资源、保存修改 |
| **manage** | edit权限 + 共享管理、删除资源 |

### 共享范围

- **all（全体成员）**：团队所有成员都可访问，新成员自动获得权限
- **specific（指定成员）**：只有指定的成员可访问

### 权限继承

```
资源所有者 → 共享默认权限 → 成员个人权限（可覆盖）
```

### 通知机制

- 新建共享：通知所有成员
- 添加成员：通知新成员
- 权限变更：通知受影响成员
- 取消共享：通知所有成员

---

## 错误码

| 错误码 | 说明                       |
| ------ | -------------------------- |
| 41601  | 共享不存在                 |
| 41602  | 资源不存在                 |
| 41603  | 权限不足（仅所有者可操作） |
| 41604  | 成员不存在                 |
| 41605  | 资源已共享                 |
| 41606  | 不能共享给自己             |
| 41607  | 成员不在团队中             |

---

**最佳实践**：

1. 最小权限原则：默认给view权限
2. 定期审查共享权限
3. 记录所有访问行为
4. 敏感资源限制共享范围
5. 离职成员自动移除
6. 共享变更及时通知
