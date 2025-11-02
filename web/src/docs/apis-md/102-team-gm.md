# 团队管理模块 API

**Figma来源**：团队成员页面、邀请成员对话框、成员详情、角色权限设置  
**模块说明**：团队成员管理、邀请、角色权限、操作日志等功能

## 目录

- [获取团队成员列表](#获取团队成员列表)
- [获取成员详情](#获取成员详情)
- [邀请成员](#邀请成员)
- [更新成员角色](#更新成员角色)
- [移除成员](#移除成员)
- [邀请管理](#邀请管理)
- [操作日志](#操作日志)
- [团队设置](#团队设置)

---

## 获取团队成员列表

**接口路径**：`GET /api/v1/team/members`  
**接口说明**：获取团队成员列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  keyword?: string;           // 搜索姓名、邮箱
  role?: 'owner' | 'admin' | 'member' | 'viewer';
  status?: 'active' | 'inactive' | 'pending';
  orderBy?: 'joinedDate' | 'lastActive' | 'name';
  orderSort?: 'asc' | 'desc';
}
```

**Figma对应**：

- `keyword` → 搜索框
- `role` → 角色筛选下拉框
- `status` → 状态筛选
- 成员列表表格

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    items: [
      {
        id: number;
        userId: number;
        name: string;
        email: string;
        avatar?: string;
        avatarFallback: string;  // "ZW"（姓名首字母）

        // 角色和状态
        role: 'owner' | 'admin' | 'member' | 'viewer';
        roleLabel: string;       // "所有者"
        roleColor: string;       // 角色标签颜色
        status: 'active' | 'inactive' | 'pending';
        statusColor: string;

        // 统计
        resourcesShared: number;    // 共享的资源数
        resourcesAccessed: number;  // 访问的资源数

        // 时间
        joinedDate: string;      // "2024-01-15"
        joinedAt: number;
        lastActive: string;      // "2分钟前"
        lastActiveAt: number;
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

- 团队成员列表表格
- 每行显示：头像、姓名、邮箱、角色、状态、加入时间、最后活跃

---

## 获取成员详情

**接口路径**：`GET /api/v1/team/members/:id`  
**接口说明**：获取指定成员的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 成员ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
  data: {
    id: number;
    userId: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    status: string;

    // 权限详情
    permissions: Array<{
      resource: string;      // 'applications' | 'workflows' | 'datasets' 等
      actions: Array<'read' | 'write' | 'delete'>;
    }>;

    // 活动统计
    activity: {
      totalLogins: number;
      lastLoginAt: number;
      totalActions: number;
      resourcesShared: number;
      resourcesAccessed: number;
    };

    // 共享资源列表
    sharedResources: Array<{
      type: ResourceType;
      id: number;
      name: string;
      sharedAt: number;
    }>;

    // 最近活动
    recentActivities: Array<{
      id: number;
      action: string;
      resource: string;
      datetime: number;
      details?: string;
    }>;

    joinedAt: number;
    lastActiveAt: number;
    invitedBy?: number;
    invitedByName?: string;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 成员详情弹窗
- 活动统计卡片
- 共享资源列表
- 最近活动时间线

---

## 邀请成员

**接口路径**：`POST /api/v1/team/invitations`  
**接口说明**：邀请新成员加入团队

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  email: string;             // 必填|邮箱|email格式
  role: 'admin' | 'member' | 'viewer';  // 必填|角色
  message?: string;          // 可选|邀请消息|maxLength:500

  // 可选：自定义权限（覆盖角色默认权限）
  customPermissions?: Array<{
    resource: string;
    actions: string[];
  }>;

  // 可选：指定可访问的资源
  accessibleResources?: Array<{
    type: ResourceType;
    ids: number[];
  }>;

  expiresIn?: number;        // 可选|邀请有效期（天数），默认7天
}
```

**Figma对应**：

- 邀请成员对话框
- 邮箱输入
- 角色选择
- 自定义消息输入

### 响应数据

```typescript
{
  code: 201,
  msg: "邀请已发送",
  data: {
    invitationId: number;
    email: string;
    role: string;
    invitedAt: number;
    expiresAt: number;
    inviteUrl: string;       // 邀请链接
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 邀请成功提示
- 复制邀请链接按钮

### 业务规则

1. 每个邮箱只能有一个待处理的邀请
2. 邀请邮件自动发送
3. 默认7天有效期
4. owner可以邀请任何角色
5. admin只能邀请member和viewer

---

## 更新成员角色

**接口路径**：`PATCH /api/v1/team/members/:id/role`  
**接口说明**：更新成员角色

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 成员ID
}
```

### 请求参数

```typescript
{
  role: 'admin' | 'member' | 'viewer'; // 新角色
}
```

**Figma对应**：

- 成员列表的角色下拉选择器
- 确认对话框

### 响应数据

```typescript
{
  code: 200,
  msg: "角色已更新",
  data: {
    id: number;
    role: string;
    modifiedDate: Date;
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 不能更改owner角色
2. owner可以更改任何人的角色
3. admin只能更改member和viewer的角色
4. 不能更改自己的角色

---

## 更新成员权限

**接口路径**：`PUT /api/v1/team/members/:id/permissions`  
**接口说明**：更新成员的自定义权限

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 成员ID
}
```

### 请求参数

```typescript
{
  permissions: Array<{
    resource: string;        // 资源类型
    actions: Array<'read' | 'write' | 'delete'>;
  }>;

  accessibleResources?: Array<{
    type: ResourceType;
    ids: number[];
  }>;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "权限已更新",
  data: {
    id: number;
    permissions: any[];
    modifiedDate: Date;
  },
  datetime: 1706889600000
}
```

---

## 移除成员

**接口路径**：`DELETE /api/v1/team/members/:id`  
**接口说明**：从团队中移除成员

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 成员ID
}
```

### 查询参数

```typescript
{
  transferResources?: boolean;  // 是否转移资源所有权
  transferTo?: number;          // 转移给谁（成员ID）
}
```

**Figma对应**：

- 移除成员按钮
- 确认对话框
- 资源转移选项

### 响应数据

```typescript
{
  code: 204,
  msg: "成员已移除",
  datetime: 1706889600000
}
```

### 业务规则

1. 不能移除owner
2. owner可以移除任何人
3. admin可以移除member和viewer
4. 移除前需处理成员拥有的资源
5. 可选择转移资源或删除资源

---

## 获取待处理邀请列表

**接口路径**：`GET /api/v1/team/invitations`  
**接口说明**：获取待处理的邀请列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  status?: 'pending' | 'accepted' | 'declined' | 'expired';
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
        email: string;
        role: string;
        status: 'pending' | 'accepted' | 'declined' | 'expired';
        statusColor: string;

        invitedBy: number;
        invitedByName: string;
        invitedDate: string;
        invitedAt: number;

        expiresDate: string;
        expiresAt: number;

        // 操作
        canResend: boolean;
        canRevoke: boolean;
      }
    ],
    pagination: Pagination;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 待处理邀请Tab
- 邀请列表表格
- 每行显示：邮箱、角色、邀请人、邀请时间、过期时间、状态

---

## 重发邀请

**接口路径**：`POST /api/v1/team/invitations/:id/resend`  
**接口说明**：重新发送邀请邮件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 邀请ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "邀请已重新发送",
  data: {
    id: number;
    resentAt: number;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 重发邀请按钮

---

## 撤销邀请

**接口路径**：`DELETE /api/v1/team/invitations/:id`  
**接口说明**：撤销待处理的邀请

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number; // 邀请ID
}
```

### 响应数据

```typescript
{
  code: 204,
  msg: "邀请已撤销",
  datetime: 1706889600000
}
```

**Figma对应**：

- 撤销邀请按钮

---

## 接受邀请

**接口路径**：`POST /api/v1/team/invitations/:token/accept`  
**接口说明**：接受团队邀请

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  token: string; // 邀请令牌（邮件链接中）
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "已加入团队",
  data: {
    teamId: number;
    teamName: string;
    role: string;
    joinedAt: number;
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 必须登录才能接受
2. 邮箱必须匹配
3. 邀请未过期
4. 接受后自动加入团队

---

## 拒绝邀请

**接口路径**：`POST /api/v1/team/invitations/:token/decline`  
**接口说明**：拒绝团队邀请

### 路径参数

```typescript
{
  token: string; // 邀请令牌
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "已拒绝邀请",
  datetime: 1706889600000
}
```

---

## 获取操作日志

**接口路径**：`GET /api/v1/team/audit-logs`  
**接口说明**：获取团队操作日志

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  pageNo?: number;
  pageSize?: number;
  memberId?: number;         // 筛选特定成员
  action?: string;           // 筛选操作类型
  resource?: string;         // 筛选资源类型
  startTime?: number;
  endTime?: number;
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
        memberId: number;
        memberName: string;
        memberEmail: string;

        action: string;        // 操作类型
        actionLabel: string;   // "创建应用"
        resource: string;      // 资源类型
        resourceId?: number;
        resourceName?: string;

        details?: string;      // 详细描述
        ipAddress: string;
        userAgent?: string;

        datetime: number;
        createdDate: Data;
      }
    ],
    pagination: Pagination;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 操作日志Tab
- 日志列表
- 筛选器

### 操作类型

- **成员管理**：invite_member, remove_member, update_role
- **资源操作**：create_app, update_app, delete_app
- **权限变更**：grant_permission, revoke_permission
- **设置修改**：update_settings

---

## 获取团队设置

**接口路径**：`GET /api/v1/team/settings`  
**接口说明**：获取团队设置

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
    teamId: number;
    teamName: string;

    // 成员设置
    memberSettings: {
      maxMembers: number;    // 最大成员数
      currentMembers: number;
      allowInvite: boolean;  // 是否允许成员邀请
      requireApproval: boolean;  // 邀请是否需要批准
    };

    // 资源设置
    resourceSettings: {
      defaultVisibility: Visibility;
      allowSharing: boolean;
      requireApprovalForShare: boolean;
    };

    // 安全设置
    securitySettings: {
      enableIPWhitelist: boolean;
      ipWhitelist?: string[];
      enableTwoFactor: boolean;
      sessionTimeout: number;  // 分钟
    };

    // 通知设置
    notificationSettings: {
      emailNotifications: boolean;
      activityAlerts: boolean;
    };
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 团队设置页面

---

## 更新团队设置

**接口路径**：`PATCH /api/v1/team/settings`  
**接口说明**：更新团队设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  teamName?: string;
  memberSettings?: {
    allowInvite?: boolean;
    requireApproval?: boolean;
  };
  resourceSettings?: {
    defaultVisibility?: Visibility;
    allowSharing?: boolean;
  };
  securitySettings?: {
    enableIPWhitelist?: boolean;
    ipWhitelist?: string[];
    sessionTimeout?: number;
  };
  notificationSettings?: any;
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "设置已更新",
  data: {
    // 返回更新后的设置
  },
  datetime: 1706889600000
}
```

---

## 获取团队统计

**接口路径**：`GET /api/v1/team/statistics`  
**接口说明**：获取团队统计数据

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
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;

    // 角色分布
    roleDistribution: {
      owner: number;
      admin: number;
      member: number;
      viewer: number;
    };

    // 活跃度
    activityStats: {
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      monthlyActiveUsers: number;
    };

    // 资源统计
    resourceStats: {
      sharedResources: number;
      totalAccesses: number;
    };
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 角色权限

| 角色       | 权限                   |
| ---------- | ---------------------- |
| **Owner**  | 所有权限，包括删除团队 |
| **Admin**  | 管理成员、资源、设置   |
| **Member** | 创建和管理自己的资源   |
| **Viewer** | 只读访问               |

### 角色层级

```
Owner > Admin > Member > Viewer
```

### 邀请流程

```
发送邀请 → 邮件通知 → 用户点击链接 → 接受/拒绝 → 加入团队/邀请关闭
                                              ↓
                                           7天后过期
```

### 资源所有权

- 成员创建的资源默认归属该成员
- 移除成员时需处理其资源
- 可转移给其他成员或删除

---

## 错误码

| 错误码 | 说明               |
| ------ | ------------------ |
| 41201  | 成员不存在         |
| 41202  | 邀请不存在或已过期 |
| 41203  | 权限不足           |
| 41204  | 不能移除owner      |
| 41205  | 不能更改自己的角色 |
| 41206  | 邮箱已被邀请       |
| 41207  | 成员数量已达上限   |
| 41208  | 邀请令牌无效       |

---

**最佳实践**：

1. 定期审查成员权限
2. 及时移除离职成员
3. 使用最小权限原则
4. 记录重要操作日志
5. 定期备份团队数据
6. 启用双因素认证
