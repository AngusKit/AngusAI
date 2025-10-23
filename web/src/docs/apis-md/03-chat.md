# AI对话模块 API

**Figma来源**：AI Chat页面、对话侧边栏、消息列表、应用切换器、模型切换器、提示词库  
**模块说明**：AI对话会话管理、消息发送接收、流式响应、附件处理、提示词应用等功能

## 目录
- [获取会话列表](#获取会话列表)
- [获取会话详情](#获取会话详情)
- [创建会话](#创建会话)
- [更新会话](#更新会话)
- [删除会话](#删除会话)
- [发送消息](#发送消息)
- [流式响应](#流式响应)
- [获取消息历史](#获取消息历史)
- [上传附件](#上传附件)
- [应用提示词](#应用提示词)
- [切换应用](#切换应用)
- [切换模型](#切换模型)

---

## 获取会话列表

**接口路径**：`GET /api/v1/chat/sessions`  
**接口说明**：获取用户的对话会话列表

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;
  keyword?: string;           // 搜索会话标题或内容
  appId?: number;             // 筛选指定应用
  modelId?: number;           // 筛选使用的模型
  sortBy?: 'createdAt' | 'updatedAt' | 'messageCount';
  sortOrder?: 'asc' | 'desc';
  isArchived?: boolean;       // 是否已归档
}
```

**Figma对应**：
- `keyword` → 侧边栏搜索框
- 会话列表（左侧边栏）

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    items: [
      {
        id: number;
        title: string;           // 会话标题
        appId: number;           // 关联的应用ID
        appName: string;         // 应用名称
        modelId: number;         // 使用的模型ID
        modelName: string;       // 模型名称
        
        // 最后一条消息
        lastMessage?: {
          role: 'user' | 'assistant';
          content: string;       // 消息摘要
          timestamp: number;
        };
        
        messageCount: number;    // 消息总数
        isArchived: boolean;     // 是否归档
        isPinned: boolean;       // 是否置顶
        
        createdAt: number;
        updatedAt: number;
        createdBy: number;
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
- 左侧会话列表
- 每个会话显示：标题、最后消息、时间

---

## 获取会话详情

**接口路径**：`GET /api/v1/chat/sessions/:id`  
**接口说明**：获取指定会话的详细信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 会话ID
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    id: number;
    title: string;
    appId: number;
    appName: string;
    modelId: number;
    modelName: string;
    
    // 会话配置
    config: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      systemPrompt?: string;  // 系统提示词
    };
    
    messageCount: number;
    isArchived: boolean;
    isPinned: boolean;
    
    createdAt: number;
    updatedAt: number;
    createdBy: number;
  },
  timestamp: 1706889600000
}
```

---

## 创建会话

**接口路径**：`POST /api/v1/chat/sessions`  
**接口说明**：创建新的对话会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  title?: string;            // 可选|会话标题，默认"新对话"
  appId: number;             // 必填|应用ID
  modelId: number;           // 必填|模型ID
  
  // 可选：会话配置
  config?: {
    temperature?: number;    // 温度参数 0-2
    maxTokens?: number;      // 最大令牌数
    topP?: number;           // 0-1
    systemPrompt?: string;   // 系统提示词
  };
}
```

**Figma对应**：
- 新建对话按钮
- 应用选择器
- 模型选择器

### 响应数据

```typescript
{
  code: 201,
  message: "会话创建成功",
  data: {
    id: number;
    title: string;
    appId: number;
    modelId: number;
    createdAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 标题默认为"新对话"
2. 自动使用用户上次选择的应用和模型
3. 创建后自动切换到该会话

---

## 更新会话

**接口路径**：`PATCH /api/v1/chat/sessions/:id`  
**接口说明**：更新会话信息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 会话ID
}
```

### 请求参数

```typescript
{
  title?: string;
  appId?: number;
  modelId?: number;
  config?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    systemPrompt?: string;
  };
  isPinned?: boolean;        // 置顶
  isArchived?: boolean;      // 归档
}
```

**Figma对应**：
- 重命名会话
- 切换应用/模型
- 置顶/归档操作

### 响应数据

```typescript
{
  code: 200,
  message: "更新成功",
  data: {
    // 返回更新后的会话信息
  },
  timestamp: 1706889600000
}
```

---

## 删除会话

**接口路径**：`DELETE /api/v1/chat/sessions/:id`  
**接口说明**：删除会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 会话ID
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

1. 删除会话会同时删除所有消息
2. 软删除，保留30天可恢复
3. 删除后自动切换到其他会话

---

## 发送消息（普通模式）

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/messages`  
**接口说明**：发送消息并获取AI响应

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;         // 会话ID
}
```

### 请求参数

```typescript
{
  content: string;           // 必填|消息内容|maxLength:10000
  attachments?: Array<{      // 可选|附件列表
    id: number;              // 附件ID（已上传）
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  
  // 可选：覆盖会话配置
  overrideConfig?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
  
  // 可选：应用提示词
  promptId?: number;         // 提示词库ID
}
```

**Figma对应**：
- 消息输入框
- 附件预览
- 发送按钮

### 响应数据

```typescript
{
  code: 201,
  message: "success",
  data: {
    // 用户消息
    userMessage: {
      id: number;
      sessionId: number;
      role: 'user';
      content: string;
      attachments?: Attachment[];
      timestamp: number;
    },
    
    // AI响应消息
    assistantMessage: {
      id: number;
      sessionId: number;
      role: 'assistant';
      content: string;         // 完整响应内容
      timestamp: number;
      
      // 使用统计
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        cost: number;
      };
    }
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 支持文本消息和附件
2. 附件需要先上传获取ID
3. 自动保存到会话历史
4. 消息长度限制10000字符

---

## 发送消息（流式模式）

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/messages/stream`  
**接口说明**：发送消息并获取流式AI响应（Server-Sent Events）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Accept: text/event-stream
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 请求参数

```typescript
{
  content: string;
  attachments?: Attachment[];
  overrideConfig?: any;
  promptId?: number;
}
```

### 响应数据（SSE流）

```typescript
// 事件流格式
event: message
data: {"type": "start", "messageId": 123}

event: message
data: {"type": "content", "delta": "你好"}

event: message
data: {"type": "content", "delta": "，"}

event: message
data: {"type": "content", "delta": "我是"}

event: message
data: {"type": "end", "usage": {...}}

// 错误事件
event: error
data: {"code": 500, "message": "生成失败"}
```

**Figma对应**：
- 消息实时显示
- 打字机效果
- 流式响应动画

### 事件类型

| 事件类型 | 说明 | 数据结构 |
|---------|------|---------|
| start | 开始生成 | `{type: "start", messageId: number}` |
| content | 内容增量 | `{type: "content", delta: string}` |
| end | 生成完成 | `{type: "end", usage: {...}}` |
| error | 错误 | `{type: "error", code: number, message: string}` |

---

## 获取消息历史

**接口路径**：`GET /api/v1/chat/sessions/:sessionId/messages`  
**接口说明**：获取会话的消息历史

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 查询参数

```typescript
{
  page?: number;
  pageSize?: number;         // 默认20，最大100
  beforeId?: number;         // 获取指定消息之前的消息
  afterId?: number;          // 获取指定消息之后的消息
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
        sessionId: number;
        role: 'user' | 'assistant';
        content: string;
        
        // 附件（仅用户消息）
        attachments?: Array<{
          id: number;
          name: string;
          type: string;          // MIME type
          size: number;
          url: string;
        }>;
        
        // 使用统计（仅AI消息）
        usage?: {
          promptTokens: number;
          completionTokens: number;
          totalTokens: number;
          cost: number;
        };
        
        timestamp: number;
        isStreaming?: boolean;   // 是否正在流式生成
      }
    ],
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;        // 是否有更多消息
    }
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 消息列表
- 滚动加载更多
- 消息气泡（用户/AI）

---

## 上传附件

**接口路径**：`POST /api/v1/chat/attachments`  
**接口说明**：上传消息附件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  file: File;                // 文件
  sessionId?: number;        // 可选|关联会话
}
```

**Figma对应**：
- 附件上传按钮
- 附件预览

### 响应数据

```typescript
{
  code: 201,
  message: "上传成功",
  data: {
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;             // 访问URL
    uploadedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 支持的文件类型：
   - 图片：jpg, png, gif, webp（最大10MB）
   - 文档：pdf, doc, docx, txt（最大20MB）
   - 其他：csv, json, xlsx（最大20MB）
2. 单次最多上传10个文件
3. 附件保留30天

---

## 删除附件

**接口路径**：`DELETE /api/v1/chat/attachments/:id`  
**接口说明**：删除附件

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  id: number;                // 附件ID
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

## 应用提示词

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/apply-prompt`  
**接口说明**：将提示词库中的提示词应用到当前会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 请求参数

```typescript
{
  promptId: number;          // 必填|提示词ID
  variables?: Record<string, any>;  // 可选|变量替换
}
```

**Figma对应**：
- 提示词库弹窗
- 提示词选择
- 变量填充表单

### 响应数据

```typescript
{
  code: 200,
  message: "提示词应用成功",
  data: {
    content: string;         // 渲染后的提示词内容
    promptId: number;
    appliedAt: number;
  },
  timestamp: 1706889600000
}
```

### 业务规则

1. 支持变量占位符：{变量名}
2. 变量未提供时使用默认值
3. 应用后自动填充到输入框

---

## 切换应用

**接口路径**：`PATCH /api/v1/chat/sessions/:sessionId/switch-app`  
**接口说明**：切换会话使用的应用

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 请求参数

```typescript
{
  appId: number;             // 必填|新应用ID
}
```

**Figma对应**：
- 应用切换器下拉框

### 响应数据

```typescript
{
  code: 200,
  message: "切换成功",
  data: {
    sessionId: number;
    appId: number;
    appName: string;
  },
  timestamp: 1706889600000
}
```

---

## 切换模型

**接口路径**：`PATCH /api/v1/chat/sessions/:sessionId/switch-model`  
**接口说明**：切换会话使用的AI模型

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 请求参数

```typescript
{
  modelId: number;           // 必填|新模型ID
}
```

**Figma对应**：
- 模型切换器下拉框

### 响应数据

```typescript
{
  code: 200,
  message: "切换成功",
  data: {
    sessionId: number;
    modelId: number;
    modelName: string;
  },
  timestamp: 1706889600000
}
```

---

## 停止生成

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/stop`  
**接口说明**：停止当前正在生成的消息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "已停止生成",
  data: {
    messageId: number;
    content: string;         // 已生成的部分内容
    stoppedAt: number;
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 停止生成按钮（流式响应时显示）

---

## 重新生成

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/messages/:messageId/regenerate`  
**接口说明**：重新生成AI响应

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
  messageId: number;         // 用户消息ID
}
```

### 响应数据

```typescript
{
  code: 201,
  message: "重新生成成功",
  data: {
    // 新生成的AI消息
  },
  timestamp: 1706889600000
}
```

**Figma对应**：
- 消息右键菜单
- 重新生成选项

---

## 导出会话

**接口路径**：`GET /api/v1/chat/sessions/:sessionId/export`  
**接口说明**：导出会话内容

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;
}
```

### 查询参数

```typescript
{
  format?: 'markdown' | 'json' | 'pdf' | 'html';
}
```

### 响应数据

返回文件下载

---

## 获取对话统计

**接口路径**：`GET /api/v1/chat/statistics`  
**接口说明**：获取对话模块统计数据

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 查询参数

```typescript
{
  period?: 'today' | 'week' | 'month' | 'year';
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "success",
  data: {
    totalSessions: number;
    totalMessages: number;
    totalTokens: number;
    totalCost: number;
    
    // 今日统计
    todayStats: {
      sessions: number;
      messages: number;
      tokens: number;
      cost: number;
    };
    
    // 使用趋势
    usageTrend: Array<{
      date: string;
      sessions: number;
      messages: number;
      tokens: number;
    }>;
    
    // Top应用
    topApps: Array<{
      appId: number;
      appName: string;
      messageCount: number;
      percentage: number;
    }>;
    
    // Top模型
    topModels: Array<{
      modelId: number;
      modelName: string;
      messageCount: number;
      tokens: number;
    }>;
  },
  timestamp: 1706889600000
}
```

---

## 批量删除会话

**接口路径**：`POST /api/v1/chat/sessions/batch-delete`  
**接口说明**：批量删除会话

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 请求参数

```typescript
{
  sessionIds: number[];      // 会话ID列表
}
```

### 响应数据

```typescript
{
  code: 200,
  message: "批量删除成功",
  data: {
    deletedCount: number;
  },
  timestamp: 1706889600000
}
```

---

## 语音输入

**接口路径**：`POST /api/v1/chat/voice-to-text`  
**接口说明**：语音转文字

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

### 请求参数

```typescript
{
  audio: File;               // 音频文件（wav, mp3, m4a）
  language?: string;         // 可选|语言代码，默认自动检测
}
```

**Figma对应**：
- 语音输入按钮
- 录音界面

### 响应数据

```typescript
{
  code: 200,
  message: "识别成功",
  data: {
    text: string;            // 识别的文本
    language: string;        // 检测到的语言
    confidence: number;      // 置信度 0-1
  },
  timestamp: 1706889600000
}
```

---

## 业务规则说明

### 会话管理

- 每个用户最多1000个会话
- 会话标题自动从首条消息生成
- 支持置顶、归档功能
- 删除后保留30天可恢复

### 消息发送

```
发送 → 验证 → 保存用户消息 → 调用AI → 流式返回 → 保存AI消息 → 完成
```

### 流式响应

```
建立SSE连接 → start事件 → content事件(多次) → end事件 → 关闭连接
                                           ↓
                                         error事件(出错时)
```

### 附件处理

1. 图片自动压缩和缩略图
2. 文档提取文本内容
3. 附件URL有效期7天
4. 支持多模态模型识别图片

### Token计费

- 输入Token：用户消息 + 系统提示词 + 上下文
- 输出Token：AI响应
- 不同模型有不同价格
- 实时统计和成本显示

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 40301 | 会话不存在 |
| 40302 | 消息内容为空 |
| 40303 | 附件上传失败 |
| 40304 | 附件格式不支持 |
| 40305 | 附件大小超限 |
| 40306 | Token余额不足 |
| 40307 | 模型不可用 |
| 40308 | 生成超时 |
| 40309 | 内容违规 |

---

**性能优化建议**：

1. 消息列表使用虚拟滚动
2. 流式响应使用SSE或WebSocket
3. 附件使用CDN
4. 消息缓存在本地
5. 离线消息队列
6. 历史消息懒加载
7. Token统计异步计算
