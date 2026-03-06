# Agent 集成工作流方案

> 基于 AgentRegistry 与 WorkflowEngine 代码分析，设计 Agent 与工作流的双向集成方案。

---

## 一、现状分析

### 1.1 已有能力

| 能力 | 实现位置 | 说明 |
|------|----------|------|
| **工作流 → Agent** | `AgentNodeExecutor` | AGENT 节点通过 `agentRegistry.chat(agentId, executionId, input)` 调用 Agent |
| **工作流引擎** | `WorkflowEngine.execute()` | 拓扑排序 + 顺序执行，支持 LLM、TOOL、HTTP、AGENT 等节点 |
| **变量与表达式** | `ExpressionEngine` | 支持 `${variables.xxx}`、`${nodes['nodeId'].outputs.xxx}` 等 |
| **上下文传递** | `NodeExecutionContext` | `variables`、`nodeOutputs` 在节点间传递 |

### 1.2 缺口

| 缺口 | 描述 |
|------|------|
| **Agent.workflowId 未使用** | `AgentDefinition.workflowId` 存在但未在 `AgentRegistry.chat()` 中接入 |
| **工作流加载** | 无统一 `WorkflowDefinitionProvider`，WorkflowController 用内存 Map 存储 |
| **ID 类型不一致** | `AgentDefinition.workflowId` 为 Long，`WorkflowDefinition.id` 为 String |
| **SubWorkflow 未真正执行** | `SubWorkflowNodeExecutor` 仅返回 `DELEGATED`，未调用 WorkflowEngine |

---

## 二、集成场景

### 2.1 场景 A：工作流调用 Agent（已实现）

```
[START] → [AGENT(agentId, input)] → [END]
```

- **实现**：`AgentNodeExecutor` 读取 `config.agentId`、`config.input`，调用 `agentRegistry.chat()`
- **待增强**：`input` 可支持 `${variables.message}` 等表达式，需在 WorkflowEngine 中对 config 做 `expressionEngine.resolveMap()` 后再传给 NodeExecutor

### 2.2 场景 B：Agent 对话触发工作流（待实现）

用户与 Agent 对话时，根据 `workflowId` 执行工作流：

| 模式 | 执行时机 | 用途 |
|------|----------|------|
| **前置** | LLM 前 | 知识检索、数据准备、意图路由 |
| **后置** | LLM 后 | 通知、记录、多步骤任务、多渠道发布 |
| **替代** | 替代 LLM | 纯工作流驱动（如表单填写、审批流） |
| **条件** | 按意图 | 特定关键词或意图时触发工作流 |

### 2.3 场景 C：子工作流真正执行（待实现）

```
[START] → [SUB_WORKFLOW(workflowId)] → [END]
```

- **现状**：`SubWorkflowNodeExecutor` 不调用 WorkflowEngine
- **目标**：加载子工作流定义，调用 `workflowEngine.execute()`，将输出写入 `nodeOutputs`

---

## 三、方案设计

### 3.1 基础设施：WorkflowDefinitionProvider

**目的**：统一工作流定义的加载入口，供 AgentRegistry、SubWorkflowNodeExecutor、WorkflowController 共用。

```java
public interface WorkflowDefinitionProvider {
  Optional<WorkflowDefinition> loadById(String workflowId);
  Optional<WorkflowDefinition> loadByLongId(Long workflowId);  // 兼容 Agent.workflowId
  List<WorkflowDefinition> loadAll();
}
```

- 宿主应用实现：从数据库/配置中心加载
- Agent 中 `workflowId` 建议统一为 String，或通过 `loadByLongId` 做映射

### 3.2 Agent 对话触发工作流

#### 3.2.1 配置扩展

在 `AgentDefinition` 中增加工作流触发策略（或沿用现有 `workflowId` + 策略枚举）：

```yaml
workflowId: "wf-customer-onboard"
workflowTrigger:
  mode: BEFORE_CHAT | AFTER_CHAT | INSTEAD_OF_CHAT | CONDITIONAL
  condition: "${intent == 'onboard'}"  # 仅 CONDITIONAL 时使用
```

#### 3.2.2 AgentRegistry 改造

在 `chat()` 中按策略插入工作流调用：

```
1. 输入护栏
2. [BEFORE_CHAT] 执行工作流，将 output 合并到 context / system message
3. 调用 LLM（或 INSTEAD_OF_CHAT 时直接返回工作流输出）
4. [AFTER_CHAT] 执行工作流，传入 { message, response } 等
5. 输出护栏
6. 返回
```

**入参约定**：

| 阶段 | inputVariables |
|------|----------------|
| BEFORE_CHAT | `{ "message": message, "sessionId": sessionId }` |
| AFTER_CHAT | `{ "message": message, "response": response, "sessionId": sessionId }` |
| INSTEAD_OF_CHAT | `{ "message": message, "sessionId": sessionId }` |

工作流输出中的 `response` 或 `text` 可作为最终返回（INSTEAD_OF_CHAT 模式）。

#### 3.2.3 依赖注入

```java
// AgentRegistry 增加
private final WorkflowEngine workflowEngine;
private final WorkflowDefinitionProvider workflowDefinitionProvider;
```

---

### 3.3 SubWorkflow 真正执行

#### 3.3.1 SubWorkflowNodeExecutor 改造

```java
// 注入
private final WorkflowEngine workflowEngine;
private final WorkflowDefinitionProvider workflowDefinitionProvider;

// execute()
String workflowId = (String) config.get("workflowId");
WorkflowDefinition subDef = workflowDefinitionProvider.loadById(workflowId)
    .orElseThrow(() -> new IllegalArgumentException("Sub-workflow not found: " + workflowId));

Map<String, Object> subInputs = 从 context.variables / config 解析;
WorkflowExecutionResult result = workflowEngine.execute(subDef, subInputs);

return Map.of(
  "subWorkflowId", workflowId,
  "status", result.getStatus(),
  "output", result.getOutput(),
  "executionId", result.getExecutionId()
);
```

- `subInputs` 可来自 `config.inputVariables` 或 `context.variables`，需用 ExpressionEngine 解析

---

### 3.4 工作流中 Agent 节点增强

**当前**：`input` 仅支持字面量或简单引用。

**建议**：在 WorkflowEngine 执行节点前，对 `node.config` 执行 `expressionEngine.resolveMap(config, buildContext(variables, nodeOutputs))`，使 `input: "${variables.userQuery}"` 等生效。

---

## 四、实施步骤

### 阶段 1：基础设施（P0）

1. 定义 `WorkflowDefinitionProvider` 接口
2. 在 WorkflowController 中实现内存版本：`workflowStore` 作为 Provider 的数据源
3. 抽取/新增 `WorkflowDefinitionProviderBean`，供多模块复用

### 阶段 2：SubWorkflow 真实执行（P0）

1. `SubWorkflowNodeExecutor` 注入 WorkflowEngine、WorkflowDefinitionProvider
2. 实现 `execute()` 中加载子工作流并调用 `workflowEngine.execute()`
3. 将子工作流输出合并到 `nodeOutputs`

### 阶段 3：Agent.workflowId 接入（P1）

1. AgentRegistry 注入 WorkflowEngine、WorkflowDefinitionProvider
2. 在 `chat()` 中判断 `definition.getWorkflowId() != null`
3. 实现 BEFORE_CHAT / AFTER_CHAT / INSTEAD_OF_CHAT 三种模式（可先做 AFTER_CHAT）
4. 统一 workflowId 类型：建议 `String`，或 Provider 支持 `Long` 查询

### 阶段 4：配置与策略扩展（P2）

1. 在 AgentDefinition 增加 `workflowTrigger`（mode、condition）
2. 条件模式需意图识别（可对接现有 skill / 分类模型）
3. 工作流入参与 Agent 变量打通（variables、sessionId、message、response）

---

## 五、数据流示意

### 5.1 工作流 → Agent

```
Workflow variables
       ↓
AgentNodeExecutor (resolve input via ExpressionEngine)
       ↓
AgentRegistry.chat(agentId, sessionId, input)
       ↓
LLM + tools + memory
       ↓
nodeOutputs["agent-node-id"] = { response }
```

### 5.2 Agent → 工作流（AFTER_CHAT）

```
User message
       ↓
AgentRegistry.chat()
       ↓
LLM 回复
       ↓
WorkflowEngine.execute(workflowDef, { message, response, sessionId })
       ↓
工作流执行（如通知、记录）
       ↓
返回 LLM 回复给用户（工作流输出可选透传）
```

### 5.3 工作流 → 子工作流

```
Parent workflow variables
       ↓
SubWorkflowNodeExecutor
       ↓
WorkflowDefinitionProvider.loadById(workflowId)
       ↓
WorkflowEngine.execute(subDef, subInputs)
       ↓
nodeOutputs["sub-node-id"] = { output, status, executionId }
```

---

## 六、注意事项

1. **循环调用**：Agent 触发的工作流若包含 AGENT 节点且指向自身，需防递归深度或超时
2. **事务与一致性**：工作流与对话分离，失败时需明确是仅记录日志还是回滚
3. **会话隔离**：工作流执行时的 `sessionId` 应与 Agent 会话一致，便于记忆与审计
4. **ID 策略**：建议 workflowId 统一为 String，便于与 DSL、API 对齐；数据库主键可单独维护映射
