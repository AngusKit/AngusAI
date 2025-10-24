# 认证授权模块 API

**Figma来源**：登录页、注册页、用户中心  
**模块说明**：处理用户认证、授权、会话管理等功能

## 目录

- [用户登录](#用户登录)
- [用户注册](#用户注册)
- [退出登录](#退出登录)
- [刷新Token](#刷新token)
- [获取当前用户信息](#获取当前用户信息)
- [修改用户信息](#修改用户信息)
- [修改密码](#修改密码)
- [上传头像](#上传头像)

---

## 用户登录

**接口路径**：`POST /api/v1/auth/login`  
**接口说明**：用户登录认证，返回JWT Token

### 请求参数

```typescript
{
  username: string;      // 必填|用户名或邮箱|minLength:4
  password: string;      // 必填|密码|需前端加密传输
  captcha?: string;      // 可选|验证码|Figma验证码输入框
  remember?: boolean;    // 可选|记住登录|默认false
}
```

**Figma对应**：

- `username` → 登录页"用户名/邮箱"输入框
- `password` → 登录页"密码"输入框
- `captcha` → 登录页"验证码"输入框（超过3次失败后显示）
- `remember` → 登录页"记住我"复选框

### 响应数据

```typescript
{
  code: 200,
  msg: "登录成功",
  data: {
    token: string;           // JWT Token
    refreshToken: string;    // 刷新Token
    expiresIn: number;       // Token过期时间（秒）
    user: {
      id: number;
      username: string;
      email: string;
      avatar: string;        // 匹配Figma右上角头像
      nickname: string;
      role: UserRole;        // 控制侧边栏权限菜单显示
      createdDate: Date
    }
  },
  datetime: 1706889600000
}
```

### 错误响应

```typescript
// 用户名或密码错误
{
  code: 401,
  msg: "用户名或密码错误",
  datetime: 1706889600000
}

// 验证码错误
{
  code: 400,
  msg: "验证码错误",
  errors: [{
    field: "captcha",
    msg: "验证码错误或已过期"
  }],
  datetime: 1706889600000
}

// 账号被禁用
{
  code: 403,
  msg: "账号已被禁用，请联系管理员",
  datetime: 1706889600000
}
```

### 业务规则

1. 密码错误超过3次，需要输入验证码
2. 密码错误超过5次，锁定账号15分钟
3. Token默认有效期7天（remember=false）或30天（remember=true）
4. 登录成功后跳转到上次访问页面或工作台

---

## 用户注册

**接口路径**：`POST /api/v1/auth/register`  
**接口说明**：新用户注册

### 请求参数

```typescript
{
  username: string;      // 必填|用户名|minLength:4,maxLength:20
  email: string;         // 必填|邮箱|需验证格式
  password: string;      // 必填|密码|minLength:8,需包含字母和数字
  confirmPassword: string; // 必填|确认密码|需与password一致
  emailCode: string;     // 必填|邮箱验证码|6位数字
  inviteCode?: string;   // 可选|邀请码
  agreeTerms: boolean;   // 必填|同意服务条款|必须为true
}
```

**Figma对应**：

- `username` → 注册页"用户名"输入框
- `email` → 注册页"邮箱"输入框
- `password` → 注册页"密码"输入框
- `confirmPassword` → 注册页"确认密码"输入框
- `emailCode` → 注册页"验证码"输入框
- `inviteCode` → 注册页"邀请码"输入框（可选）
- `agreeTerms` → 注册页"同意服务条款"复选框

### 响应数据

```typescript
{
  code: 201,
  msg: "注册成功",
  data: {
    userId: number;
    username: string;
    email: string;
  },
  datetime: 1706889600000
}
```

### 错误响应

```typescript
// 用户名已存在
{
  code: 409,
  msg: "用户名已被使用",
  errors: [{
    field: "username",
    msg: "该用户名已被注册"
  }],
  datetime: 1706889600000
}

// 邮箱已存在
{
  code: 409,
  msg: "邮箱已被使用",
  errors: [{
    field: "email",
    msg: "该邮箱已被注册"
  }],
  datetime: 1706889600000
}

// 验证码错误
{
  code: 400,
  msg: "验证码错误或已过期",
  errors: [{
    field: "emailCode",
    msg: "验证码错误或已过期"
  }],
  datetime: 1706889600000
}
```

---

## 发送邮箱验证码

**接口路径**：`POST /api/v1/auth/send-email-code`  
**接口说明**：发送邮箱验证码

### 请求参数

```typescript
{
  email: string; // 必填|邮箱地址
  type: 'register' | 'reset_password'; // 必填|验证码类型
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "验证码已发送",
  data: {
    expiresIn: 300       // 有效期（秒）
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 同一邮箱60秒内只能发送一次
2. 验证码有效期5分钟
3. 验证码为6位随机数字

---

## 退出登录

**接口路径**：`POST /api/v1/auth/logout`  
**接口说明**：退出登录，销毁Token

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应数据

```typescript
{
  code: 200,
  msg: "退出成功",
  datetime: 1706889600000
}
```

---

## 刷新Token

**接口路径**：`POST /api/v1/auth/refresh-token`  
**接口说明**：使用refreshToken获取新的访问Token

### 请求参数

```typescript
{
  refreshToken: string; // 必填|刷新Token
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "刷新成功",
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  },
  datetime: 1706889600000
}
```

---

## 获取当前用户信息

**接口路径**：`GET /api/v1/auth/me`  
**接口说明**：获取当前登录用户的详细信息

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
    id: number;
    username: string;
    email: string;
    avatar: string;
    nickname: string;
    role: UserRole;
    bio?: string;          // 个人简介
    location?: string;     // 所在地
    website?: string;      // 个人网站
    preferences: {
      language: Language;   // 界面语言
      theme: Theme;         // 主题设置
      timezone: string;     // 时区
    };
    createdDate: Date
    lastModifiedDate: Date;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- `avatar` → Header右上角头像
- `username` → 用户中心页面显示
- `role` → 控制侧边栏菜单权限
- `preferences.language` → Header语言切换器当前值
- `preferences.theme` → Header主题切换器当前值

---

## 修改用户信息

**接口路径**：`PATCH /api/v1/auth/me`  
**接口说明**：修改当前用户信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  nickname?: string;     // 可选|昵称
  bio?: string;          // 可选|个人简介
  location?: string;     // 可选|所在地
  website?: string;      // 可选|个人网站
  preferences?: {
    language?: Language;
    theme?: Theme;
    timezone?: string;
  };
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "更新成功",
  data: {
    // 返回更新后的完整用户信息
  },
  datetime: 1706889600000
}
```

---

## 修改密码

**接口路径**：`POST /api/v1/auth/change-password`  
**接口说明**：修改用户密码

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  oldPassword: string; // 必填|当前密码
  newPassword: string; // 必填|新密码|minLength:8
  confirmPassword: string; // 必填|确认新密码
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "密码修改成功",
  datetime: 1706889600000
}
```

### 错误响应

```typescript
// 当前密码错误
{
  code: 400,
  msg: "当前密码错误",
  errors: [{
    field: "oldPassword",
    msg: "当前密码不正确"
  }],
  datetime: 1706889600000
}
```

---

## 上传头像

**接口路径**：`POST /api/v1/auth/upload-avatar`  
**接口说明**：上传用户头像

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  avatar: File; // 必填|图片文件|支持jpg,png,gif|最大5MB
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "上传成功",
  data: {
    avatar: string;      // 头像URL
  },
  datetime: 1706889600000
}
```

### 业务规则

1. 支持的图片格式：jpg、png、gif
2. 图片大小限制：5MB
3. 自动裁剪为正方形
4. 自动生成多种尺寸（32x32, 64x64, 128x128）

---

## 密码重置

**接口路径**：`POST /api/v1/auth/reset-password`  
**接口说明**：通过邮箱重置密码

### 请求参数

```typescript
{
  email: string; // 必填|邮箱地址
  emailCode: string; // 必填|邮箱验证码
  newPassword: string; // 必填|新密码
  confirmPassword: string; // 必填|确认密码
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "密码重置成功",
  datetime: 1706889600000
}
```

---

## 状态机说明

### 用户状态流转

```
注册 → 未激活 → 激活 → 正常
                        ↓
                      被禁用 → 解禁 → 正常
```

### Token状态

```
生成 → 有效 → 即将过期(提前刷新) → 过期(需重新登录)
            ↓
          主动销毁(退出登录)
```

---

**注意事项**：

1. 所有密码传输前需在前端使用RSA加密
2. Token存储在localStorage或sessionStorage（根据"记住我"选项）
3. 登录失败次数存储在Redis中，15分钟后自动清零
4. 头像上传建议使用OSS直传，减少服务器压力
