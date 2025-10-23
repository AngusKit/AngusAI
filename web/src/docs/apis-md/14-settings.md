# 系统设置模块 API

**Figma来源**：应用设置页面、用户偏好设置、通知设置、安全设置  
**模块说明**：用户偏好、通知配置、安全设置、集成设置等功能

## 目录
- [获取用户设置](#获取用户设置)
- [更新用户设置](#更新用户设置)
- [获取通知设置](#获取通知设置)
- [更新通知设置](#更新通知设置)
- [获取安全设置](#获取安全设置)
- [更新安全设置](#更新安全设置)
- [集成设置](#集成设置)
- [偏好设置](#偏好设置)

---

## 获取用户设置

**接口路径**：`GET /api/v1/settings/profile`  
**接口说明**：获取用户个人设置

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
    userId: number;
    
    // 基本信息
    profile: {
      name: string;
      email: string;
      avatar?: string;
      phone?: string;
      company?: string;
      position?: string;
      timezone: string;        // "Asia/Shanghai"
      language: 'zh-CN' | 'en-US';
    };
    
    // 偏好设置
    preferences: {
      theme: 'light' | 'dark' | 'auto';
      locale: string;
      dateFormat: string;      // "YYYY-MM-DD"
      timeFormat: '12h' | '24h';
      defaultView: 'grid' | 'list';
    };
    
    // 隐私设置
    privacy: {
      profileVisibility: 'public' | 'team' | 'private';
      showEmail: boolean;
      showActivity: boolean;
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 个人设置页面
- 基本信息表单
- 偏好设置选项

---

## 更新用户设置

**接口路径**：`PATCH /api/v1/settings/profile`  
**接口说明**：更新用户个人设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  profile?: {
    name?: string;
    phone?: string;
    company?: string;
    position?: string;
    timezone?: string;
    language?: string;
  };
  
  preferences?: {
    theme?: string;
    locale?: string;
    dateFormat?: string;
    timeFormat?: string;
    defaultView?: string;
  };
  
  privacy?: {
    profileVisibility?: string;
    showEmail?: boolean;
    showActivity?: boolean;
  };
}
```

**Figma对应**：
- 个人设置编辑表单
- 保存按钮

### 响应数据

```typescript
{
  code: 200,
  message: "设置已更新",
  data: {
    // 返回更新后的设置
  },
  timestamp: 1706889600000
}
```

---

## 上传头像

**接口路径**：`POST /api/v1/settings/avatar`  
**接口说明**：上传用户头像

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  avatar: File;              // 图片文件
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "头像上传成功",
  data: {
    avatarUrl: string;
    uploadedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 支持jpg、png、gif格式
2. 最大2MB
3. 自动裁剪为正方形
4. 生成多个尺寸缩略图

---

## 删除头像

**接口路径**：`DELETE /api/v1/settings/avatar`  
**接口说明**：删除用户头像

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 204,
  message: "头像已删除",
  timestamp: 1706889600000
}
```

---

## 获取通知设置

**接口路径**：`GET /api/v1/settings/notifications`  
**接口说明**：获取通知设置

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
    // 邮件通知
    email: {
      enabled: boolean;
      frequency: 'immediately' | 'daily' | 'weekly';
      
      // 具体通知类型
      notifications: {
        systemUpdates: boolean;       // 系统更新
        securityAlerts: boolean;      // 安全警告
        usageAlerts: boolean;         // 使用量警告
        billingNotices: boolean;      // 账单通知
        teamInvitations: boolean;     // 团队邀请
        resourceSharing: boolean;     // 资源分享
        workflowStatus: boolean;      // 工作流状态
        apiErrors: boolean;           // API错误
      };
    };
    
    // 浏览器通知
    browser: {
      enabled: boolean;
      notifications: {
        chatMessages: boolean;        // 对话消息
        workflowComplete: boolean;    // 工作流完成
        errorAlerts: boolean;         // 错误警告
      };
    };
    
    // 应用内通知
    inApp: {
      enabled: boolean;
      showBadge: boolean;
      playSound: boolean;
      notifications: {
        all: boolean;
      };
    };
    
    // 移动推送
    mobile: {
      enabled: boolean;
      quietHours: {
        enabled: boolean;
        start: string;           // "22:00"
        end: string;             // "08:00"
      };
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 通知设置页面
- 各类通知开关
- 频率选择器

---

## 更新通知设置

**接口路径**：`PATCH /api/v1/settings/notifications`  
**接口说明**：更新通知设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  email?: {
    enabled?: boolean;
    frequency?: string;
    notifications?: Record<string, boolean>;
  };
  
  browser?: {
    enabled?: boolean;
    notifications?: Record<string, boolean>;
  };
  
  inApp?: {
    enabled?: boolean;
    showBadge?: boolean;
    playSound?: boolean;
  };
  
  mobile?: {
    enabled?: boolean;
    quietHours?: {
      enabled?: boolean;
      start?: string;
      end?: string;
    };
  };
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "通知设置已更新",
  data: {
    // 返回更新后的设置
  },
  timestamp: 1706889600000
}
```

---

## 获取安全设置

**接口路径**：`GET /api/v1/settings/security`  
**接口说明**：获取安全设置

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
    // 双因素认证
    twoFactor: {
      enabled: boolean;
      method: 'totp' | 'sms' | 'email';
      setupAt?: number;
    };
    
    // 会话管理
    sessions: {
      maxActiveSessions: number;
      currentSessions: number;
      sessionTimeout: number;  // 分钟
      
      // 活跃会话列表
      activeSessions: Array<{
        id: string;
        device: string;
        browser: string;
        ip: string;
        location?: string;
        current: boolean;
        lastActiveAt: number;
        createdAt: number;
      }>;
    };
    
    // 登录历史
    loginHistory: Array<{
      id: number;
      timestamp: number;
      ip: string;
      location?: string;
      device: string;
      browser: string;
      status: 'success' | 'failed';
    }>;
    
    // 密码策略
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      lastChangedAt?: number;
      expiresIn?: number;      // 天数
    };
    
    // IP白名单
    ipWhitelist: {
      enabled: boolean;
      addresses: string[];
    };
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 安全设置页面
- 双因素认证设置
- 活跃会话列表
- 登录历史

---

## 启用双因素认证

**接口路径**：`POST /api/v1/settings/security/2fa/enable`  
**接口说明**：启用双因素认证

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  method: 'totp' | 'sms' | 'email';
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "请完成双因素认证设置",
  data: {
    // TOTP方式
    totp?: {
      secret: string;
      qrCode: string;        // 二维码URL
      backupCodes: string[]; // 备用码
    };
    
    // SMS/Email方式
    verificationCodeSent?: boolean;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 双因素认证设置向导
- 二维码扫描
- 验证码输入

---

## 验证并完成双因素认证

**接口路径**：`POST /api/v1/settings/security/2fa/verify`  
**接口说明**：验证并完成双因素认证设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  code: string;              // 验证码
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "双因素认证已启用",
  data: {
    enabled: true;
    method: string;
    setupAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 禁用双因素认证

**接口路径**：`POST /api/v1/settings/security/2fa/disable`  
**接口说明**：禁用双因素认证

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  password: string;          // 当前密码
  code?: string;             // 验证码（如果已启用）
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "双因素认证已禁用",
  timestamp: 1706889600000
}
```

---

## 修改密码

**接口路径**：`POST /api/v1/settings/security/change-password`  
**接口说明**：修改密码

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  currentPassword: string;   // 必填|当前密码
  newPassword: string;       // 必填|新密码|minLength:8
  confirmPassword: string;   // 必填|确认密码
}
```

**Figma对应**：
- 修改密码表单

### 响应数据

```typescript
{
  code: 200,
  message: "密码修改成功",
  data: {
    changedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 验证当前密码
2. 新密码不能与旧密码相同
3. 符合密码策略要求
4. 修改成功后发送通知邮件
5. 其他会话失效

---

## 终止会话

**接口路径**：`DELETE /api/v1/settings/security/sessions/:sessionId`  
**接口说明**：终止指定会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: string;         // 会话ID
}
```

### 响应数据

```typescript
{
  code: 204,
  message: "会话已终止",
  timestamp: 1706889600000
}
```

**Figma对应**：
- 活跃会话列表
- 终止会话按钮

---

## 终止所有其他会话

**接口路径**：`POST /api/v1/settings/security/sessions/revoke-all`  
**接口说明**：终止除当前外的所有会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  message: "其他会话已全部终止",
  data: {
    revokedCount: number;
  },
  timestamp: 1706889600000
}
```

---

## 获取集成设置

**接口路径**：`GET /api/v1/settings/integrations`  
**接口说明**：获取第三方集成设置

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
    items: [
      {
        id: string;
        name: string;          // "GitHub", "Slack"
        icon: string;
        description: string;
        category: string;      // "开发工具", "通讯"
        status: 'connected' | 'disconnected';
        
        // 连接信息
        connection?: {
          account: string;
          connectedAt: number;
          expiresAt?: number;
          scopes: string[];
        };
        
        // 配置
        config?: Record<string, any>;
        
        // 统计
        stats?: {
          lastSync?: number;
          totalSyncs: number;
        };
      }
    ]
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 集成设置页面
- 集成卡片列表

---

## 连接集成

**接口路径**：`POST /api/v1/settings/integrations/:integrationId/connect`  
**接口说明**：连接第三方集成

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  integrationId: string;     // 集成ID
}
```

### 请求参数

```typescript
{
  // OAuth方式
  authCode?: string;
  
  // API密钥方式
  apiKey?: string;
  
  // Webhook方式
  webhookUrl?: string;
  
  // 其他配置
  config?: Record<string, any>;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "集成连接成功",
  data: {
    integrationId: string;
    status: 'connected';
    connectedAt: number;
    
    // OAuth需要重定向
    authUrl?: string;
  },
  timestamp: 1706889600000
}
```

---

## 断开集成

**接口路径**：`POST /api/v1/settings/integrations/:integrationId/disconnect`  
**接口说明**：断开第三方集成

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  integrationId: string;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "集成已断开",
  timestamp: 1706889600000
}
```

---

## 获取数据导出

**接口路径**：`GET /api/v1/settings/data-export`  
**接口说明**：获取数据导出记录

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
    items: [
      {
        id: number;
        type: 'full' | 'partial';
        format: 'json' | 'csv' | 'zip';
        status: 'processing' | 'completed' | 'failed';
        
        // 导出范围
        scope: {
          applications: boolean;
          workflows: boolean;
          datasets: boolean;
          knowledge: boolean;
          conversations: boolean;
        };
        
        fileSize?: number;
        downloadUrl?: string;
        expiresAt?: number;
        
        requestedAt: number;
        completedAt?: number;
      }
    ]
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 数据导出页面
- 导出记录列表

---

## 请求数据导出

**接口路径**：`POST /api/v1/settings/data-export`  
**接口说明**：请求导出用户数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  type: 'full' | 'partial';
  format: 'json' | 'csv' | 'zip';
  
  // 部分导出时指定范围
  scope?: {
    applications?: boolean;
    workflows?: boolean;
    datasets?: boolean;
    knowledge?: boolean;
    conversations?: boolean;
  };
}
```

### 响应数据

```typescript
{
  code: 202,
  message: "导出请求已提交",
  data: {
    exportId: number;
    status: 'processing';
    estimatedTime: number;   // 预计时间（秒）
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 异步处理
2. 完成后发送邮件通知
3. 下载链接有效期7天
4. 每天最多3次导出请求

---

## 删除账户

**接口路径**：`POST /api/v1/settings/delete-account`  
**接口说明**：删除用户账户

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  password: string;          // 必填|确认密码
  reason?: string;           // 可选|删除原因
  feedback?: string;         // 可选|反馈
}
```

**Figma对应**：
- 账户删除确认对话框
- 密码验证

### 响应数据

```typescript
{
  code: 200,
  message: "账户删除请求已提交",
  data: {
    scheduledAt: number;     // 实际删除时间（30天后）
    cancellable: boolean;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 需要验证密码
2. 30天宽限期
3. 期间内可以取消
4. 删除所有数据
5. 发送确认邮件

---

## 取消删除账户

**接口路径**：`POST /api/v1/settings/cancel-delete-account`  
**接口说明**：取消账户删除

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  message: "账户删除已取消",
  timestamp: 1706889600000
}
```

---

## 获取应用偏好

**接口路径**：`GET /api/v1/settings/preferences/:key`  
**接口说明**：获取特定的偏好设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  key: string;               // 偏好设置键名
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    key: string;
    value: any;
    updatedAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 保存应用偏好

**接口路径**：`PUT /api/v1/settings/preferences/:key`  
**接口说明**：保存特定的偏好设置

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  key: string;
}
```

### 请求参数

```typescript
{
  value: any;                // 偏好设置值
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "偏好设置已保存",
  data: {
    key: string;
    value: any;
    updatedAt: number;
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 设置分类

1. **个人设置**：基本信息、偏好
2. **通知设置**：邮件、浏览器、应用内、移动推送
3. **安全设置**：密码、双因素认证、会话管理
4. **集成设置**：第三方服务连接
5. **隐私设置**：数据导出、账户删除

### 通知频率

- **immediately**：立即发送
- **daily**：每日汇总（早上8点）
- **weekly**：每周汇总（周一早上）

### 时区处理

- 所有时间使用UTC存储
- 根据用户时区显示
- 支持自动检测

### 安全建议

1. 启用双因素认证
2. 定期更换密码
3. 审查活跃会话
4. 启用登录通知
5. 使用强密码
6. IP白名单

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 41401 | 设置项不存在 |
| 41402 | 当前密码错误 |
| 41403 | 新密码不符合要求 |
| 41404 | 验证码错误或已过期 |
| 41405 | 会话不存在 |
| 41406 | 集成连接失败 |
| 41407 | 导出请求过于频繁 |

---

**隐私保护**：

1. 数据加密存储
2. 支持数据导出
3. 账户删除宽限期
4. 隐私设置控制
5. 符合GDPR要求
6. 审计日志记录
