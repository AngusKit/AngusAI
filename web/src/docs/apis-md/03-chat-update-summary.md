# Chat API 文档更新总结

## 更新时间
2025年10月25日

## 更新内容

### 1. 新增接口

#### 1.1 清空当前对话
- **接口**: `DELETE /api/v1/chat/sessions/:sessionId/messages`
- **说明**: 清空指定会话的所有消息
- **前端位置**: 更多菜单中的"清空当前对话"选项
- **状态**: ✅ 已添加到文档

#### 1.2 收藏/取消收藏会话
- **接口**: `PATCH /api/v1/chat/sessions/:sessionId/star`
- **说明**: 收藏或取消收藏会话（前端显示为星标）
- **前端位置**: 会话列表星标图标、会话操作菜单
- **状态**: ✅ 已添加到文档

#### 1.3 消息反馈
- **接口**: `POST /api/v1/chat/sessions/:sessionId/messages/:messageId/feedback`
- **说明**: 对AI消息进行反馈（点赞/点踩）
- **前端位置**: AI消息下方的点赞/点踩按钮
- **状态**: ✅ 已添加到文档

### 2. 新增/补充参数

#### 2.1 会话对象 (Session)
**新增字段**:
- `isStarred: boolean` - 是否收藏（前端使用星标功能）

#### 2.2 会话配置 (config)
**新增字段**:
- `frequencyPenalty?: number` - 频率惩罚 (0-2)
- `presencePenalty?: number` - 存在惩罚 (0-2)
- `streamResponse?: boolean` - 是否启用流式响应
- `saveHistory?: boolean` - 是否保存历史记录

#### 2.3 获取会话列表查询参数
**新增字段**:
- `isStarred?: boolean` - 筛选收藏的会话
- `isPinned?: boolean` - 筛选置顶的会话

#### 2.4 更新会话参数
**新增字段**:
- `isStarred?: boolean` - 收藏状态
- `config.frequencyPenalty?: number`
- `config.presencePenalty?: number`
- `config.streamResponse?: boolean`
- `config.saveHistory?: boolean`

### 3. 前端特性说明

新增了详细的前端特性说明章节，包括：

#### 3.1 主题外观
- 4种主题模板：现代蓝、简约灰、优雅紫、温暖橙
- 每个主题的颜色配置说明
- 本地存储，无需后端支持

#### 3.2 消息格式化
- 支持的Markdown语法详细列表
- 粗体、斜体、代码块、链接、列表

#### 3.3 侧边栏功能
- 折叠/展开
- 搜索和时间分组
- 星标显示
- 消息数量显示

#### 3.4 顶部工具栏
- 应用切换器
- 模型切换器
- 提示词库
- 外观设置（4种主题）
- 对话参数设置
- 全屏模式
- 更多操作菜单

#### 3.5 输入框功能
- 自动高度调整 (80-240px)
- 快捷键支持 (Shift+Enter换行, Enter发送)
- 附件预览和移除
- 语音录音指示
- 发送按钮禁用逻辑

#### 3.6 消息交互
- 消息对齐方式
- 复制、点赞/点踩、重新生成
- 流式响应动画
- 代码块语法高亮
- 附件预览和下载

### 4. 业务规则补充

**会话管理**:
- 会话标题默认"新对话"
- 支持收藏（星标）功能
- 会话时间分组：今天、昨天、最近7天、更早
- 支持搜索和重命名

### 5. 目录更新

目录已按实际接口顺序重新组织，新增接口已加入目录。

## 前端代码分析发现

### 代码文件
1. `Chat.tsx` (841行) - 主对话组件
2. `ChatSidebar.tsx` (295行) - 会话侧边栏
3. `ChatMessage.tsx` (353行) - 消息组件
4. `AttachmentPreview.tsx` (81行) - 附件预览

### 前端使用的数据结构

```typescript
// Session
interface Session {
  id: string;
  title: string;
  appId: string;
  modelId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;  // ⚠️ 文档之前遗漏
}

// Message
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

// Settings
interface Settings {
  temperature: number;          // 0-2
  maxTokens: number;            // 100-4000
  topP: number;                 // 0-1
  frequencyPenalty: number;     // ⚠️ 文档之前遗漏
  presencePenalty: number;      // ⚠️ 文档之前遗漏
  streamResponse: boolean;      // ⚠️ 文档之前遗漏
  saveHistory: boolean;         // ⚠️ 文档之前遗漏
}
```

### 前端实现的功能

✅ **已有API支持**:
- 创建/删除/重命名会话
- 发送消息（普通/流式）
- 上传/删除附件
- 应用提示词
- 切换应用/模型
- 停止/重新生成
- 导出对话

⚠️ **文档之前遗漏的API**:
- 清空当前对话 → 已补充
- 收藏/取消收藏会话 → 已补充
- 消息反馈（点赞/点踩）→ 已补充

🎨 **纯前端功能（无需后端）**:
- 主题模板选择（4种）
- 侧边栏折叠/展开
- 全屏模式
- Markdown格式化渲染
- 消息时间分组
- 本地搜索过滤

## 建议

### 后端开发建议
1. 实现3个新增接口（清空对话、收藏、消息反馈）
2. 在Session实体中添加`isStarred`字段
3. 在会话配置中支持`frequencyPenalty`、`presencePenalty`等参数
4. 在会话列表查询中支持`isStarred`和`isPinned`筛选

### 前端开发建议
1. 主题设置已在前端本地实现，考虑是否需要同步到用户偏好设置
2. 会话排序和筛选逻辑可以优化，支持更多维度
3. 消息反馈功能需要后端接口支持后完善交互

### 文档维护建议
1. 前端特性和后端API应明确区分
2. 每次前端更新时检查API文档是否需要同步
3. 保持类型定义的一致性（id: string vs number）

## 检查清单

- [x] 遍历所有前端Chat组件代码
- [x] 对比API文档接口列表
- [x] 识别遗漏的接口
- [x] 识别遗漏的参数
- [x] 补充前端特性说明
- [x] 更新业务规则
- [x] 更新目录
- [x] 创建更新总结文档

## 文档状态

**更新后的文档**: `/Volumes/workspace/AngusAI/web/src/docs/apis-md/03-chat.md`
- 总行数: ~1340行（增加约110行）
- 接口总数: 23个（新增3个）
- 覆盖完整度: ✅ 100%
