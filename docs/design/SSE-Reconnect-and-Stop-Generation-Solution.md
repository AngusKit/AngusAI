# SSE 重连与停止生成 - 解决方案

## 一、现状分析

### 1.1 当前架构

| 层级 | 组件 | 职责 |
|------|------|------|
| 前端 | `useChatStream.chatStream()` | fetch POST `/agents/chat/stream`，解析 ReadableStream 中的 SSE |
| 前端 | `Chat.tsx` | 创建 `assistant-${Date.now()}` 占位消息，收到 sessionId 后建立会话 |
| 后端 | `AgentChatRest.chatStream()` | 返回 SseEmitter |
| 后端 | `AgentChatCmdImpl.chatStream()` | 预创建 DB 助手消息，异步执行 TokenStream，按 token 推送 SSE |
| 后端 | `AgentRegistry.chatStream()` | 调用 LangChain4j TokenStream，流式生成 |

### 1.2 问题汇总

| 问题 | 现状 | 影响 |
|------|------|------|
| **SSE 重连** | 刷新页面即断开 fetch，无重连逻辑 | 用户看不到已生成内容，后端可能继续跑完流 |
| **停止生成** | `stopGeneration(messageId)` 仅将 DB `is_streaming=false` | 未取消 TokenStream，LLM 继续生成，浪费资源 |
| **messageId 缺失** | 首块只推送 sessionId，未推送 assistant 消息 ID | 前端无法调用 `stopGeneration(messageId)` |
| **流式持久化** | 仅在 `onCompleteResponse` 时用 fullContent 覆盖 | 刷新后无法恢复未完成消息的已生成内容 |

---

## 二、SSE 重连方案

### 2.1 设计思路

SSE 是**单次请求**，刷新后连接必然断开，无真正「重连」。采用以下策略：

当用户刷新页面或列表加载时断开连接，若消息列表中存在 `is_streaming=true` 的助手消息（说明后端仍在生成）：

1. **前端展示**：仅展示「生成已中断，内容将在生成完成后自动加载，请耐心等待」
2. **轮询拉取**：前端每隔 3 秒调用「根据消息 ID 查询消息详情」接口
3. **自动更新**：当接口返回 `is_streaming=false` 且 `content` 已更新时，刷新 UI 并停止轮询

后端无需流式增量持久化，沿用现有逻辑：仅在 `onCompleteResponse` 时写入完整内容。

### 2.2 后端实现：根据消息 ID 查询消息详情

#### 2.2.1 新增 REST 接口

```
GET /api/v1/chat/messages/{messageId}
```

返回单条消息详情（MessageVo），供前端轮询使用。

#### 2.2.2 MessageRest 新增

```java
@Operation(operationId = "getMessage", summary = "获取消息详情", description = "根据消息ID查询单条消息详情，用于 SSE 断开后轮询等待生成完成")
@GetMapping("/{messageId}")
public ApiLocaleResult<MessageVo> getMessage(
    @Parameter(description = "消息ID") @PathVariable Long messageId) {
  return ApiLocaleResult.success(messageFacade.getMessage(messageId));
}
```

#### 2.2.3 MessageFacade 新增

```java
/**
 * 根据消息 ID 查询单条消息详情（用于 SSE 断开后轮询）
 */
MessageVo getMessage(Long messageId);
```

#### 2.2.4 MessageFacadeImpl 实现

```java
@Override
public MessageVo getMessage(Long messageId) {
  Message message = messageQuery.findAndCheck(messageId);
  return MessageAssembler.toMessageVo(message);
}
```

`MessageQuery.findAndCheck` 已存在，可直接复用。

### 2.3 前端实现

#### 2.3.1 Message 服务新增

```ts
/**
 * 根据消息 ID 查询单条消息详情（用于 SSE 断开后轮询等待生成完成）
 */
getMessage = (messageId: string | number, params: RequestParams = {}) =>
  this.http.request<MessageResult>({
    path: `${AI}/chat/messages/${messageId}`,
    method: 'GET',
    secure: true,
    ...params,
  });
```

#### 2.3.2 刷新后检测流式中断

在 `useChatSessions` 或 `Chat.tsx` 中，当 `loadMessages` 返回后：

- 若存在最后一条助手消息且 `isStreaming === true`（或后端返回的 `is_streaming` 等价字段）
- 判定为「刷新导致 SSE 断开，后端仍在该会话生成」

#### 2.3.3 展示等待文案并启动轮询

```tsx
// 在 ChatMainArea 或 ChatMessage 中
// 当 message.role === 'assistant' && message.isStreaming 时：
<p className="text-sm text-gray-500 dark:text-gray-400">
  生成已中断，内容将在生成完成后自动加载，请耐心等待
</p>
```

对上述消息的 `messageId`（后端 DB 的 id）启动轮询：

```ts
const POLL_INTERVAL_MS = 3000;

useEffect(() => {
  const streamingMsg = currentMessages.find(
    m => m.role === 'assistant' && m.isStreaming
  );
  if (!streamingMsg?.id) return;

  const timer = setInterval(async () => {
    const res = await MessageApi.getMessage(streamingMsg.id);
    const data = res?.data;
    if (data && !data.isStreaming) {
      updateMessage(currentSessionId, streamingMsg.id, {
        content: data.content ?? '',
        isStreaming: false,
      });
      clearInterval(timer);
    }
  }, POLL_INTERVAL_MS);

  return () => clearInterval(timer);
}, [currentMessages, currentSessionId]);
```

注意：`message.id` 需为后端消息 ID。若当前消息列表来自 `getMessageList`，返回的 `MessageVo` 应包含 `id` 字段。若前端使用临时 id（如 `assistant-xxx`），需在首块 SSE 中下发 `messageId` 并同步到前端状态，或确保列表接口返回的消息 id 与详情接口一致。

### 2.4 数据流说明

1. 用户发送消息 → SSE 建立 → 后端创建 assistant 消息（DB id=X）
2. 用户刷新 → fetch 断开 → 后端继续生成，最终 `onCompleteResponse` 写库
3. 前端 `loadMessages` → 得到列表，最后一条 assistant `id=X`，`isStreaming=true`
4. 前端展示「生成已中断，内容将在生成完成后自动加载，请耐心等待」
5. 每 3 秒 `GET /messages/X` → 某次返回 `isStreaming=false`、`content` 已填充
6. 前端更新该消息，停止轮询，展示完整内容

---

## 三、停止生成方案

### 3.1 设计思路

1. **messageId 下发**：首块 SSE 中携带 `messageId`（助手消息 DB ID）
2. **流注册表**：将 `messageId -> (SseEmitter, 可取消上下文)` 存入注册表
3. **stopGeneration**：根据 messageId 查注册表，执行取消并保存已生成内容
4. **TokenStream 可取消**：通过 `AtomicBoolean` 或 `CompletableFuture` 在 token 回调中判断是否已取消

### 3.2 后端实现

#### 3.2.1 流式任务注册表

```java
// 新建 ActiveStreamRegistry.java
@Component
public class ActiveStreamRegistry {
  private final ConcurrentHashMap<Long, StreamContext> active = new ConcurrentHashMap<>();

  @Data
  @AllArgsConstructor
  public static class StreamContext {
    private SseEmitter emitter;
    private AtomicBoolean cancelled;
    private StringBuilder fullContent;
    private Message assistantMessage;
    private MessageCmd messageCmd;
  }

  public void register(Long messageId, StreamContext ctx) {
    active.put(messageId, ctx);
  }

  public StreamContext get(Long messageId) {
    return active.get(messageId);
  }

  public StreamContext remove(Long messageId) {
    return active.remove(messageId);
  }
}
```

#### 3.2.2 首块携带 messageId

在 `AgentChatCmdImpl.chatStream` 首块中加入 `messageId`：

```java
// 首块 chunk 增加
chunk = OpenAIChatCompletionChunk.builder()
  .id("chatcmpl-stream")
  .sessionId(sessionDb.getSessionId())
  .messageId(assistantMessage.getId())  // 新增
  // ...
  .build();
```

需要在 `OpenAIChatCompletionChunk` 中增加 `messageId` 字段。

#### 3.2.3 chatStream 中注册并支持取消

```java
// AgentChatCmdImpl.chatStream
AtomicBoolean cancelled = new AtomicBoolean(false);
StreamContext ctx = new StreamContext(emitter, cancelled, fullContent, assistantMessage, messageCmd);
activeStreamRegistry.register(assistantMessage.getId(), ctx);

stream.onPartialResponse(token -> {
  if (cancelled.get()) return;  // 已取消则不再发送
  fullContent.append(token);
  // ... 原有 chunk 发送逻辑
});

// emitter 断开时清理
emitter.onCompletion(() -> activeStreamRegistry.remove(assistantMessage.getId()));
emitter.onTimeout(() -> activeStreamRegistry.remove(assistantMessage.getId()));
```

#### 3.2.4 stopGeneration 真正取消流

```java
// MessageFacadeImpl.stopGeneration
public MessageVo stopGeneration(Long messageId) {
  Message message = messageQuery.findAndCheck(messageId);
  StreamContext ctx = activeStreamRegistry.remove(messageId);
  if (ctx != null) {
    ctx.getCancelled().set(true);
    message.setContent(ctx.getFullContent().toString());
    messageCmd.updateContent(message);
    messageCmd.setStreaming(message, false);
    ctx.getEmitter().complete();  // 关闭 SSE 连接
  }
  return MessageAssembler.toMessageVo(message);
}
```

**注意**：LangChain4j `TokenStream` 未提供原生 cancel。可在 `onPartialResponse` 中通过 `cancelled.get()` 提前返回，不继续往 emitter 发送，但 LLM 侧可能仍在生成。若要彻底停止 LLM 调用，需要依赖底层 HTTP 客户端或 SDK 的取消能力（如 `CompletableFuture.cancel(true)`），实现会更复杂，上述方案至少能实现「前端停止展示 + 保存已生成内容」。

### 3.3 前端实现

#### 3.3.1 保存 messageId 并暴露停止

在 `Chat.tsx` 的 `handleSendMessage` / `handleRegenerate` 中：

```ts
// 收到首块时
onSessionId: (sessionId) => { /* 已有逻辑 */ },
onMessageId: (messageId) => {
  streamingMessageIdRef.current = messageId;  // 存起来
},

// 流结束时
finally {
  streamingMessageIdRef.current = null;
}
```

在 `useChatStream.ts` 解析首块时，若存在 `messageId`，调用 `onMessageId?.(messageId)`。

#### 3.3.2 停止按钮与调用

在 `ChatMainArea` 或 `ChatMessage` 中，当 `message.isStreaming` 时展示「停止」按钮：

```tsx
{message.isStreaming && (
  <Button onClick={() => onStopGenerate?.(message.id)}>停止</Button>
)}
```

注意：`message.id` 需为后端下发的 `messageId`。当前前端使用 `assistant-${Date.now()}`，首块收到 `messageId` 后需更新为该 ID，或在 `sessionMessages` 中维护 `id -> messageId` 映射，确保点击停止时传的是真实 `messageId`。

调用 `MessageApi.stopGeneration(messageId)` 完成停止。

---

## 四、接口与数据结构变更

### 4.1 SSE Chunk 扩展

```json
{
  "id": "chatcmpl-stream",
  "session_id": "xxx",
  "message_id": 12345,
  "object": "chat.completion.chunk",
  "choices": [{ "delta": { "content": "..." } }]
}
```

### 4.2 前端 AgentChatTypes

```ts
export interface OpenAIChatCompletionChunk {
  // ... 现有字段
  message_id?: number;  // 助手消息 DB ID，首块携带
}
```

### 4.3 chatStream 回调扩展

```ts
callbacks: {
  onToken: (token: string) => void;
  onSessionId?: (sessionId: string) => void;
  onMessageId?: (messageId: number) => void;  // 新增
  onError?: (err: Error) => void;
}
```

---

## 五、实施步骤建议

| 阶段 | 任务 | 优先级 |
|------|------|--------|
| 1 | 后端：新增 GET /chat/messages/{messageId} 消息详情接口 | P0 |
| 2 | 前端：Message 服务新增 getMessage，刷新后检测 isStreaming 并启动 3 秒轮询 | P0 |
| 3 | 后端：首块携带 messageId，前端解析并保存 | P0 |
| 4 | 后端：ActiveStreamRegistry + stopGeneration 取消逻辑 | P0 |
| 5 | 前端：停止按钮 + 调用 stopGeneration | P0 |
| 6 | 可选：继续生成 / 断点续传 | P2 |

---

## 六、与现有 API 的兼容性

- `Message.stopGeneration(messageId)`：已存在，只需后端实现真正的取消逻辑
- `GET /chat/messages`：无需修改，只要后端流式写入 content，刷新后即可拉取
- `/agents/chat/stream`：仅扩展 chunk 字段，不影响现有解析逻辑（新增字段忽略即可）
