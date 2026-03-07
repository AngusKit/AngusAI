# Agent 关联资源缺口 — 解决方案

> 基于前期分析，针对 knowledgeBaseIds、guardrails、variables 等未接入的 Agent 关联资源，提供实施方案。

---

## 一、knowledgeBaseIds → RAG 接入

### 1.1 目标

将 `AgentDefinition.knowledgeBaseIds` 接入 LangChain4j RAG，使对话能基于知识库检索增强生成。

### 1.2 设计要点

- **知识库与向量存储映射**：`knowledgeBaseIds` 与 `VectorStoreConfigProvider` 中的配置 ID 对应（约定：知识库
  ID = 向量存储配置 ID，或通过 `KnowledgeBaseConfigProvider` 解析）。
- **ContentRetriever**：基于 `EmbeddingStore` + `EmbeddingModel`
  构建 `EmbeddingStoreContentRetriever`。
- **多知识库**：多个知识库时，使用 `CompositeContentRetriever` 合并检索结果。
- **AiServices 绑定**：通过 `AiServices.contentRetriever()` 或 `retrievalAugmentor()` 注入 RAG 能力。

### 1.3 实现步骤

1. 新增 `ContentRetrieverFactory`：根据 `knowledgeBaseIds` 创建 `ContentRetriever`。
2. 新增 `CompositeContentRetriever`：合并多个 `ContentRetriever` 的检索结果。
3. 在 `AgentRegistry.register()` 中，当 `definition.getKnowledgeBaseIds()`
   非空时，调用 `ContentRetrieverFactory` 创建 retriever 并注入 AiServices。
4. （可选）定义 `KnowledgeBaseConfigProvider` SPI，由宿主应用实现知识库元数据加载，支持每个知识库单独配置
   topK、相似度阈值等。

### 1.4 依赖

- `VectorStoreRegistry`：获取 `EmbeddingStore`。
- `ModelRegistry`：获取 `EmbeddingModel`（需支持按 provider 获取默认 Embedding 模型，或使用知识库配置的
  embedding 模型 ID）。

---

## 二、guardrails → 输入/输出护栏

### 2.1 目标

在 `chat()` 和 `chatStream()` 中执行 `AgentDefinition.guardrails` 配置的输入/输出护栏。

### 2.2 设计要点

- **输入护栏**：在调用 LLM 前，对用户消息执行 `GuardrailChain.checkInput()`；若不通过，直接返回拦截原因，不发起对话。
- **输出护栏**：在 LLM 返回后，对回复内容执行 `GuardrailChain.checkOutput()`；若不通过，可返回默认安全回复或拦截原因。
- **流式场景**：流式输出需先缓冲完整回复再执行输出护栏，或在流中逐块校验（取决于护栏实现）。

### 2.3 实现步骤

1. `AgentRegistry` 构造函数注入 `GuardrailChain`。
2. 在 `chat()` 中：
    - 若 `definition.getGuardrails() != null` 且 `inputGuardrailIds`
      非空，先执行 `guardrailChain.checkInput(message, inputGuardrailIds)`。
    - 若未通过，返回 `GuardrailResult.getReason()` 或统一错误信息。
    - 若通过且 `sanitizedContent` 非空，使用净化后的内容作为 `message`。
3. 在 `chat()` 返回前：
    - 若 `outputGuardrailIds` 非空，对 LLM
      返回结果执行 `guardrailChain.checkOutput(response, outputGuardrailIds)`。
    - 若未通过，返回默认安全回复或 `getReason()`。
4. `chatStream()`：先收集完整 token 流，拼接成字符串后执行输出护栏；或设计流式护栏接口（如有需要）。
5. 在 `AgentXCoreBeansConfiguration` 中，将 `GuardrailChain` 传入 `AgentRegistry`。

---

## 三、variables → 系统提示变量注入

### 3.1 目标

将 `AgentDefinition.variables` 注入到 system prompt，支持 `{{variableName}}` 模板替换。

### 3.2 设计要点

- **替换时机**：在 `AgentRegistry.register()` 构建 `systemMessageProvider` 时进行替换。
- **模板格式**：`{{key}}` 或 `${key}`，与 `variables` 中的 key 对应。
- **动态变量**
  ：若需运行时注入（如请求级变量），可扩展 `chat(agentId, sessionId, message, Map<String, String> runtimeVariables)`
  并在构建 system prompt 时合并。

### 3.3 实现步骤

1. 新增 `PromptVariableResolver` 工具类：`resolve(template, variables)`，将 `{{key}}`
   替换为 `variables.get(key)`。
2. 在 `AgentRegistry.register()` 中，构建 system prompt
   后调用 `PromptVariableResolver.resolve(systemPrompt, definition.getVariables())`。
3. 若 `variables` 为空，则保持原样。

---

## 四、其他资源（简要规划）

| 资源                  | 建议                                                                         |
|---------------------|----------------------------------------------------------------------------|
| **datasetIds**      | 明确业务含义：若为训练/评估数据集，则与对话无关；若为检索数据源，可参考 knowledgeBaseIds 接入 RAG 或专用检索服务。      |
| **openApiIds**      | 将 OpenAPI 规范解析为工具，注册到 `ToolRegistry`，再通过 `toolIds` 或自动合并到 Agent。           |
| **workflowId**      | 若需「对话触发工作流」：在 `chat()` 前/后根据条件调用 `WorkflowEngine.run(workflowId, params)`。 |
| **publishChannels** | 在 `chat()` 返回后，根据 `publishChannels` 将结果推送到对应渠道（如 MQ、Webhook）。              |

---

## 五、实施优先级

1. **P0**：guardrails（安全性）、variables（配置灵活性）
2. **P1**：knowledgeBaseIds → RAG（核心能力）
3. **P2**：workflowId、publishChannels（扩展场景）
4. **P3**：datasetIds、openApiIds（需业务澄清）
