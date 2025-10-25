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
- [删除附件](#删除附件)
- [应用提示词](#应用提示词)
- [切换应用](#切换应用)
- [切换模型](#切换模型)
- [停止生成](#停止生成)
- [重新生成](#重新生成)
- [消息反馈](#消息反馈)
- [导出会话](#导出会话)
- [清空当前对话](#清空当前对话)
- [收藏/取消收藏会话](#收藏取消收藏会话)
- [批量删除会话](#批量删除会话)
- [语音输入](#语音输入)
- [获取对话统计](#获取对话统计)

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
  pageNo?: number;
  pageSize?: number;
  keyword?: string;           // 搜索会话标题或内容
  appId?: number;             // 筛选指定应用
  modelId?: number;           // 筛选使用的模型
  orderBy?: 'createdDate' | 'lastModifiedDate' | 'messageCount';
  orderSort?: 'asc' | 'desc';
  isArchived?: boolean;       // 是否已归档
  isStarred?: boolean;        // 是否已收藏（星标）
  isPinned?: boolean;         // 是否已置顶
}
```

**Figma对应**：

- `keyword` → 侧边栏搜索框
- 会话列表（左侧边栏）

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
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
          datetime: number;
        };

        messageCount: number;    // 消息总数
        isArchived: boolean;     // 是否归档
        isPinned: boolean;       // 是否置顶
        isStarred: boolean;      // 是否收藏（前端使用星标功能）

        createdDate: Date
        lastModifiedDate: Date;
        createdBy: number;
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
  id: number; // 会话ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "success",
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
      frequencyPenalty?: number;  // 频率惩罚 0-2
      presencePenalty?: number;   // 存在惩罚 0-2
      systemPrompt?: string;      // 系统提示词
    };

    messageCount: number;
    isArchived: boolean;
    isPinned: boolean;
    isStarred: boolean;      // 是否收藏

    createdDate: Date
    lastModifiedDate: Date;
    createdBy: number;
  },
  datetime: 1706889600000
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
    frequencyPenalty?: number;  // 频率惩罚 0-2
    presencePenalty?: number;   // 存在惩罚 0-2
    systemPrompt?: string;   // 系统提示词
    streamResponse?: boolean;  // 是否启用流式响应
    saveHistory?: boolean;     // 是否保存历史记录
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
  msg: "会话创建成功",
  data: {
    id: number;
    title: string;
    appId: number;
    modelId: number;
    createdDate: Date
  },
  datetime: 1706889600000
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
  id: number; // 会话ID
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
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt?: string;
    streamResponse?: boolean;
    saveHistory?: boolean;
  };
  isPinned?: boolean;        // 置顶
  isStarred?: boolean;       // 收藏（星标）
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
  msg: "更新成功",
  data: {
    // 返回更新后的会话信息
  },
  datetime: 1706889600000
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
  id: number; // 会话ID
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
  sessionId: number; // 会话ID
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
  msg: "success",
  data: {
    // 用户消息
    usermsg: {
      id: number;
      sessionId: number;
      role: 'user';
      content: string;
      attachments?: Attachment[];
      datetime: number;
    },

    // AI响应消息
    assistantmsg: {
      id: number;
      sessionId: number;
      role: 'assistant';
      content: string;         // 完整响应内容
      datetime: number;

      // 使用统计
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        cost: number;
      };
    }
  },
  datetime: 1706889600000
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

| 事件类型 | 说明     | 数据结构                                         |
| -------- | -------- | ------------------------------------------------ |
| start    | 开始生成 | `{type: "start", messageId: number}`             |
| content  | 内容增量 | `{type: "content", delta: string}`               |
| end      | 生成完成 | `{type: "end", usage: {...}}`                    |
| error    | 错误     | `{type: "error", code: number, msg: string}` |

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
  pageNo?: number;
  pageSize?: number;         // 默认20，最大100
  beforeId?: number;         // 获取指定消息之前的消息
  afterId?: number;          // 获取指定消息之后的消息
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

        datetime: number;
        isStreaming?: boolean;   // 是否正在流式生成
      }
    ],
    pagination: {
      pageNo: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;        // 是否有更多消息
    }
  },
  datetime: 1706889600000
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
  msg: "上传成功",
  data: {
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;             // 访问URL
    uploadedAt: number;
  },
  datetime: 1706889600000
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
  id: number; // 附件ID
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
  msg: "提示词应用成功",
  data: {
    content: string;         // 渲染后的提示词内容
    promptId: number;
    appliedAt: number;
  },
  datetime: 1706889600000
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
  appId: number; // 必填|新应用ID
}
```

**Figma对应**：

- 应用切换器下拉框

### 响应数据

```typescript
{
  code: 200,
  msg: "切换成功",
  data: {
    sessionId: number;
    appId: number;
    appName: string;
  },
  datetime: 1706889600000
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
  modelId: number; // 必填|新模型ID
}
```

**Figma对应**：

- 模型切换器下拉框

### 响应数据

```typescript
{
  code: 200,
  msg: "切换成功",
  data: {
    sessionId: number;
    modelId: number;
    modelName: string;
  },
  datetime: 1706889600000
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
  msg: "已停止生成",
  data: {
    messageId: number;
    content: string;         // 已生成的部分内容
    stoppedAt: number;
  },
  datetime: 1706889600000
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
  messageId: number; // 用户消息ID
}
```

### 响应数据

```typescript
{
  code: 201,
  msg: "重新生成成功",
  data: {
    // 新生成的AI消息
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 消息右键菜单
- 重新生成选项

---

## 消息反馈

**接口路径**：`POST /api/v1/chat/sessions/:sessionId/messages/:messageId/feedback`  
**接口说明**：对AI消息进行反馈（点赞/点踩）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number;  // 会话ID
  messageId: number;  // 消息ID（必须是assistant消息）
}
```

### 请求参数

```typescript
{
  feedbackType: 'like' | 'dislike';  // 反馈类型
  comment?: string;                   // 可选|反馈说明
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "反馈已提交",
  data: {
    messageId: number;
    feedbackType: 'like' | 'dislike';
    submittedAt: number;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- AI消息下方的点赞/点踩按钮
- 反馈后按钮状态变化

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
  msg: "success",
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
  datetime: 1706889600000
}
```

---

## 清空当前对话

**接口路径**：`DELETE /api/v1/chat/sessions/:sessionId/messages`  
**接口说明**：清空指定会话的所有消息

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number; // 会话ID
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "对话已清空",
  data: {
    sessionId: number;
    clearedCount: number;  // 清空的消息数量
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 更多菜单中的"清空当前对话"选项

---

## 收藏/取消收藏会话

**接口路径**：`PATCH /api/v1/chat/sessions/:sessionId/star`  
**接口说明**：收藏或取消收藏会话（前端显示为星标）

### 请求头

```http
Authorization: Bearer <JWT_TOKEN>
```

### 路径参数

```typescript
{
  sessionId: number; // 会话ID
}
```

### 请求参数

```typescript
{
  isStarred: boolean;  // true=收藏，false=取消收藏
}
```

### 响应数据

```typescript
{
  code: 200,
  msg: "操作成功",
  data: {
    sessionId: number;
    isStarred: boolean;
  },
  datetime: 1706889600000
}
```

**Figma对应**：

- 会话列表中的星标图标
- 会话操作菜单中的"收藏/取消收藏"

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
  msg: "批量删除成功",
  data: {
    deletedCount: number;
  },
  datetime: 1706889600000
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
  msg: "识别成功",
  data: {
    text: string;            // 识别的文本
    language: string;        // 检测到的语言
    confidence: number;      // 置信度 0-1
  },
  datetime: 1706889600000
}
```

---

## 业务规则说明

### 会话管理

- 每个用户最多1000个会话
- 会话标题自动从首条消息生成（默认"新对话"）
- 支持置顶、归档、收藏（星标）功能
- 删除后保留30天可恢复
- 会话按时间分组：今天、昨天、最近7天、更早
- 支持搜索会话标题和内容
- 支持重命名会话

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

| 错误码 | 说明           |
| ------ | -------------- |
| 40301  | 会话不存在     |
| 40302  | 消息内容为空   |
| 40303  | 附件上传失败   |
| 40304  | 附件格式不支持 |
| 40305  | 附件大小超限   |
| 40306  | Token余额不足  |
| 40307  | 模型不可用     |
| 40308  | 生成超时       |
| 40309  | 内容违规       |

---

**前端特性说明**：

### 主题外观

前端支持4种对话界面主题模板：
1. **现代蓝** (modern-blue)：专业清新的蓝色主题
2. **简约灰** (minimal-gray)：简洁优雅的灰色主题
3. **优雅紫** (elegant-purple)：高雅精致的紫色主题
4. **温暖橙** (warm-orange)：活力温馨的橙色主题

每个主题包含：
- primaryColor：主色调（按钮、高亮）
- secondaryColor：次要背景色
- accentColor：边框颜色
- hoverColor：悬停效果色

主题选择存储在前端本地，不需要后端API支持。

### 消息格式化

前端支持的Markdown格式：
- **粗体**：`**文本**`
- *斜体*：`*文本*`
- 行内代码：`` `代码` ``
- 代码块：` ```语言\n代码\n``` `
- 链接：`[文本](URL)`
- 无序列表：`- 项目`

### 侧边栏功能

- 可折叠侧边栏（保留最小宽度显示图标）
- 会话列表支持搜索和时间分组
- 支持拖拽重命名会话
- 收藏的会话显示星标图标
- 悬停显示会话操作菜单
- 显示会话消息数量

### 顶部工具栏

- 应用切换器：快速切换不同应用
- 模型切换器：切换AI模型
- 提示词库按钮：快速访问提示词
- 外观设置（主题选择）：4种主题模板
- 对话设置：温度、Token等参数配置
- 全屏模式：进入/退出全屏显示
- 更多操作：导出对话、分享对话、清空对话

### 输入框功能

- 自动调整高度（最小80px，最大240px）
- Shift + Enter 换行，Enter 发送
- 支持附件预览和移除
- 语音录音指示器
- 发送按钮禁用状态（无内容且无附件时）

### 消息交互

- 用户消息右对齐，AI消息左对齐
- 支持复制、点赞/点踩、重新生成
- 流式响应显示打字机效果和加载动画
- 代码块支持语法高亮和复制
- 附件支持预览和下载

---

**性能优化建议**：

1. 消息列表使用虚拟滚动
2. 流式响应使用SSE或WebSocket
3. 附件使用CDN
4. 消息缓存在本地
5. 离线消息队列
6. 历史消息懒加载
7. Token统计异步计算
