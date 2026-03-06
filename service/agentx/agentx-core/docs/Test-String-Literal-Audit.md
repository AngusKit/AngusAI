# agentx-core 测试中未使用枚举引用的字符串字面量检查报告

> 检查范围：`agentx-core/src/test/java/com/agentx/core/**`

---

## 一、已有枚举且测试已正确使用的

| 枚举 | 测试文件 | 说明 |
|------|----------|------|
| **AgentStatus** | `AgentInstanceTest` | 使用 `AgentStatus.CONFIGURED`、`AgentStatus.RUNNING` 等 |
| **AutonomyLevel** | `AgentDefinitionParserTest` | JSON 输入 `"TOOL"` 经 Jackson 反序列化为 `AutonomyLevel.TOOL`，断言使用 `AutonomyLevel.TOOL` |
| **InteractionMode** | `AgentDefinitionParserTest` | 断言使用 `InteractionMode.COMPLETION` 等 |
| **ReasoningStrategy** | `AgentDefinitionParserTest` | 断言使用 `ReasoningStrategy.SIMPLE_LLM` 等 |

---

## 二、应使用枚举但当前为字符串字面量的情况

### 2.1 当前无对应枚举（需新增）

#### 工作流节点类型 (NodeType)

| 字符串值 | 出现位置 | 建议 |
|----------|----------|------|
| START, END, CODE, CONDITION, SWITCH, LOOP, WHILE, PARALLEL, WAIT, SUB_WORKFLOW, SET_VARIABLE, KNOWLEDGE_RETRIEVAL | NodeExecutorTest, WorkflowValidatorTest, WorkflowDslParserTest | 新增 `NodeType` 枚举，`NodeDefinition.type` 改为 enum 或保留 String 时用 `NodeType.START.name()` |
| LLM, AGENT, TOOL, HTTP | WorkflowDslParserTest, NodeExecutorTest 等 | 同 NodeType |
| APPROVAL, WAITING | NodeExecutorTest (WAIT 节点 config) | 可纳入 `WaitType` 枚举 |

#### 工作流执行状态

| 字符串值 | 出现位置 | 建议 |
|----------|----------|------|
| COMPLETED, FAILED, CANCELLED | WorkflowEngineTest, NodeExecutorTest | 新增 `WorkflowExecutionStatus` 枚举 |
| SUCCESS, FAILED, SKIPPED | WorkflowEngineTest (NodeExecutionRecord.status) | 新增 `NodeExecutionStatus` 枚举 |

#### 触发器类型 (TriggerType)

| 字符串值 | 出现位置 | 建议 |
|----------|----------|------|
| WEBHOOK, CRON, MANUAL | WorkflowDslParserTest | 新增 `TriggerType` 枚举 |

#### 失败策略 (FailurePolicy)

| 字符串值 | 出现位置 | 建议 |
|----------|----------|------|
| STOP, CONTINUE, ROLLBACK | WorkflowEngineTest, WorkflowDslParserTest, WorkflowEngine | 新增 `FailurePolicy` 枚举 |

#### 重试/超时策略

| 字符串值 | 出现位置 | 建议 |
|----------|----------|------|
| GOTO, SKIP | WorkflowDslParserTest (onFailure/onTimeout strategy) | 纳入 `RetryStrategy` 或类似枚举 |

### 2.2 有对应枚举但未使用枚举引用的

#### AutonomyLevel

| 文件 | 位置 | 当前 | 建议 |
|------|------|------|------|
| AgentDefinitionParserTest | JSON 输入 `"autonomyLevel": "TOOL"` | 字符串（JSON 格式） | **可保留**，JSON 反序列化需要字符串，断言已使用 `AutonomyLevel.TOOL` |

#### CollaborationPattern

| 文件 | 位置 | 当前 | 说明 |
|------|------|------|------|
| MultiAgentOrchestratorTest | `assertEquals("LLM_MERGE", config.getStrategy())` | 字符串 `"LLM_MERGE"` | CollaborationPattern 无 `LLM_MERGE`，可能为扩展策略，需确认是否应纳入枚举 |

### 2.3 工具名称/分类（可选）

| 文件 | 位置 | 当前 | 说明 |
|------|------|------|------|
| ToolRegistryTest | `.name("HTTP")` | 字符串 | ToolDescriptor.name 为展示名，非枚举；若为工具类型可考虑 ToolType 枚举 |

---

## 三、按文件汇总

### NodeExecutorTest.java

| 字符串 | 行号区间 | 用途 |
|--------|----------|------|
| "START", "END", "CODE", "CONDITION", "SWITCH", "LOOP", "WHILE", "PARALLEL", "WAIT", "SUB_WORKFLOW", "SET_VARIABLE", "KNOWLEDGE_RETRIEVAL" | 多处 | NodeDefinition.type、getNodeType() 断言 |
| "COMPLETED" | ~720 | SubWorkflow 输出 status |
| "APPROVAL", "WAITING" | ~657, 658, 673 | WAIT 节点 config |

### WorkflowEngineTest.java

| 字符串 | 用途 |
|--------|------|
| "COMPLETED", "FAILED" | WorkflowExecutionResult.status |
| "SUCCESS", "FAILED" | NodeExecutionRecord.status |
| "START" | startRecord.nodeType |
| "STOP", "CONTINUE" | WorkflowSettings.onFailure |

### WorkflowDslParserTest.java

| 字符串 | 用途 |
|--------|------|
| "START", "END", "LLM", "CONDITION" 等 | 节点 type 断言 |
| "WEBHOOK", "CRON" | Trigger.type |
| "CONTINUE" | Settings.onFailure |
| "GOTO", "SKIP" | 节点 RetryConfig strategy |

### WorkflowValidatorTest.java

| 字符串 | 用途 |
|--------|------|
| "START", "END", "SET_VARIABLE", "CONDITION" | NodeDefinition.type |

### MultiAgentOrchestratorTest.java

| 字符串 | 用途 |
|--------|------|
| "LLM_MERGE" | config.getStrategy() |

### ToolRegistryTest.java

| 字符串 | 用途 |
|--------|------|
| "HTTP" | ToolDescriptor.name |

---

## 四、建议优先级

1. **P0**：新增 `WorkflowExecutionStatus`、`NodeExecutionStatus`，替换 `WorkflowExecutionResult` / `NodeExecutionRecord` 中的 status 字符串
2. **P1**：新增 `NodeType` 枚举，在测试中使用 `NodeType.XXX.name()` 替代字面量
3. **P2**：新增 `TriggerType`、`FailurePolicy` 枚举
4. **P3**：确认 `LLM_MERGE` 与 CollaborationPattern 关系，必要时扩展枚举

---

## 五、实施注意

- `NodeDefinition.type`、`WorkflowDefinition.TriggerConfig.type` 等若改为 enum，需确保 JSON/YAML 反序列化兼容（如 `@JsonValue` / `@JsonCreator`）
- 工作流 DSL 及配置文件中的 type 通常为字符串，枚举主要用于生产代码与测试断言，避免拼写错误
