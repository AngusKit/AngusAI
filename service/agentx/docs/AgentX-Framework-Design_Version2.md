# AgentX —— 基于 LangChain4j 的智能体快速开发框架

> **版本**：v1.0-DRAFT | **日期**：2026-03-05  
> **技术底座**：LangChain4j 1.11 + Java 21 + Spring Boot 3.5  
> **定位**：面向 Java 生态的生产级智能体快速开发框架，对标 Coze / Dify，提供声明式 Agent 定义、JSON/YAML
> 工作流编排、插件化工具体系与企业级运维能力。

---

## 目录

1. [设计目标与原则](#1-设计目标与原则)
2. [总体架构](#2-总体架构)
3. [分层架构详解](#3-分层架构详解)
4. [功能模块清单](#4-功能模块清单)
5. [智能体类型体系](#5-智能体类型体系)
6. [工作流引擎设计（JSON/YAML DSL）](#6-工作流引擎设计jsonyaml-dsl)
7. [RAG 与知识库模块](#7-rag-与知识库模块)
8. [工具与插件体系](#8-工具与插件体系)
9. [多 Agent 协作模块](#9-多-agent-协作模块)
10. [安全护栏模块（Guardrails）](#10-安全护栏模块guardrails)
11. [模型适配层](#11-模型适配层)
12. [可观测性与运营模块](#12-可观测性与运营模块)
13. [多租户与权限体系](#13-多租户与权限体系)
14. [技术选型总览](#14-技术选型总览)
15. [项目模块结构](#15-项目模块结构)
16. [与 Coze / Dify 竞争力对比](#16-与-coze--dify-竞争力对比)
17. [实施路线图](#17-实施路线图)

---

## 1. 设计目标与原则

### 1.1 设计目标

| 目标          | 说明                                                   |
|-------------|------------------------------------------------------|
| **快速开发**    | 5 分钟创建一个可用 Agent；30 分钟编排一个完整工作流                      |
| **生产就绪**    | 多租户、Guardrails、可观测、灰度发布、断点恢复                         |
| **开放生态**    | 20+ 模型厂商、MCP 协议、SPI 插件、OpenAPI 工具自���接入              |
| **Java 原生** | 深度利用 Java 21 虚拟线程 + Spring Boot 3.5 生态               |
| **声明式优先**   | JSON/YAML 定义 Agent 和 Workflow，无需写 Java 代码即可完成 80% 场景 |

### 1.2 设计原则

1. **Convention over Configuration** —— 合理默认值，最少配置即可运行
2. **Plugin Everything** —— 模型、工具、向量库、存储均可插拔替换
3. **Type-Safe DSL** —— JSON/YAML DSL 配套 JSON Schema 校验，IDE 友好
4. **Fail-Safe by Default** —— 每个 Agent/节点自带超时、重试、熔断、降级
5. **Observable from Day One** —— 内置 OpenTelemetry，无需额外配置

---

## 2. 总体架构

```
┌──────────────────────────────────────────────────────────────────────┐
│                            接入层                                    │
│   CLI · REST API · WebSocket/SSE · SDK(Java/Python/TS) · Webhook    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                         框架核心层                                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │ Agent Core │ │ Workflow   │ │ Knowledge  │ │   Tool & Plugin  │  │
│  │ 智能体内核  │ │ Engine     │ │ & RAG      │ │   工具与插件      │  │
│  │            │ │ 工作流引擎  │ │ 知识库&检索 │ │                  │  ���
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └───────┬──────────┘  │
│        └───────────────┼─────────────┼─────────────────┘             │
│                        ▼             ▼                               │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                   LangChain4j Abstraction                     │   │
│  │   ChatModel · AiServices · ContentRetriever                   │   │
│  │   EmbeddingModel · EmbeddingStore · ChatMemory · @Tool        │   │
│  │   Guardrails · Listeners · MCP Client                         │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │ Guardrails │ │ Multi-Agent│ │ Observ-    │ │ Tenant &         │  │
│  │ 安全护栏    │ │ 多Agent协作 │ │ ability    │ │ Permission       │  │
│  │            │ │            │ │ 可观测      │ │ 多租户&权限       │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│                         模型适配层                                    │
│   OpenAI · Anthropic · Google Gemini · Mistral · 通义千问 · 文心     │
│   智谱GLM · DeepSeek · Llama(Ollama) · Azure OpenAI · AWS Bedrock  │
└──────────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─���────────────────────────────────────┐
│                         基础设施层                                    │
│   PostgreSQL · Redis · RabbitMQ/Kafka · Milvus/PgVector/ES          │
│   MinIO/S3 · OpenTelemetry · Prometheus · Grafana                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. 分层架构详解

| 层级                  | 职责                 | 关键组件                                                          |
|---------------------|--------------------|---------------------------------------------------------------|
| **接入层**             | 对外暴露 Agent 服务；协议适配 | REST Controller、WebSocket Handler、Webhook Receiver、CLI Runner |
| **框架核心层**           | 所有业务能力的实现主体        | Agent Core、Workflow Engine、Knowledge & RAG、Tool & Plugin      |
| **LangChain4j 抽象层** | 屏蔽底层模型/向量库差异       | ChatModel、AiServices、EmbeddingStore、ChatMemory、MCP Client     |
| **横切关注点**           | 贯穿所有模块的非功能性能力      | Guardrails、Multi-Agent、Observability、Tenant & Permission      |
| **模型适配层**           | 统一对接 20+ LLM 厂商    | LangChain4j Provider Modules                                  |
| **基础设施层**           | 数据存储、消息、监控         | DB、缓存、MQ、向量库、对象存储、链路追踪                                        |

---

## 4. 功能模块清单

### 4.1 模块总览

| 编号  | 模块名称                  | 模块标识                   | 核心能力                                  | 优先级 |
|:---:|-----------------------|------------------------|---------------------------------------|:---:|
| M01 | **Agent Core**        | `agentx-core`          | 智能体定义、生命周期、运行时                        | P0  |
| M02 | **Workflow Engine**   | `agentx-workflow`      | JSON/YAML 工作流解析、DAG 执行引擎              | P0  |
| M03 | **Knowledge & RAG**   | `agentx-knowledge`     | 文档导入、分块、向量化、混合检索、重排序                  | P0  |
| M04 | **Tool & Plugin**     | `agentx-tool`          | 内置工具、MCP 适配、OpenAPI 自动接入、SPI 插件       | P0  |
| M05 | **Model Adapter**     | `agentx-model`         | 统一模型抽象、多厂商适配、流式输出、多模态                 | P0  |
| M06 | **Memory**            | `agentx-memory`        | 窗口/Token/摘要/持久化多策略记忆                  | P0  |
| M07 | **Guardrails**        | `agentx-guardrail`     | 输入/输出双向护栏链                            | P1  |
| M08 | **Multi-Agent**       | `agentx-multi-agent`   | Router/Supervisor/Swarm/Sequential 编排 | P1  |
| M09 | **Observability**     | `agentx-observability` | OpenTelemetry 集成、Metrics、日志、追踪        | P1  |
| M10 | **Tenant & Auth**     | `agentx-tenant`        | 多租户隔离、RBAC 权限、API Key 管理              | P1  |
| M11 | **Prompt Management** | `agentx-prompt`        | 提示词模板库、版本管理、A/B 测试                    | P2  |
| M12 | **Evaluation**        | `agentx-eval`          | Agent 质量评估、基准测试、回归测试                  | P2  |
| M13 | **Marketplace**       | `agentx-marketplace`   | Agent/Tool/Prompt 模板市场                | P2  |
| M14 | **Gateway**           | `agentx-gateway`       | API 网关、限流、鉴权、路由                       | P1  |

### 4.2 各模块功能明细

#### M01 Agent Core —— 智能体内核

| 功能点          | 说明                                                                 |
|--------------|--------------------------------------------------------------------|
| 声明式 Agent 定义 | 通过 YAML/JSON 定义 Agent 的所有属性，无需写 Java 代码                            |
| Agent 生命周期管理 | 创建 → 配置 → 发布 → 运行 → 暂停 → 归档                                        |
| 运行时动态构建      | 根据定义文件动态组装 AiServices 实例（模型+工具+记忆+RAG+护栏）                          |
| 多交互模式        | Chatbot / Completion / Workflow / API / Multi-turn Task            |
| 多推��策略       | Simple LLM / Function Calling / ReAct / Plan&Execute / Multi-Agent |
| 多自治等级        | L0 工具 → L1 助手 → L2 协作 → L3 代理 → L4 自主                              |
| 开场白与引导语      | 自定义首轮对话内容和建议问题                                                     |
| 变量与上下文注入     | 支持运行时注入用户信息、业务上下文等动态变量                                             |
| 版本管理         | Agent 定义支持版本化，可回滚                                                  |
| 多渠道发布        | Web / API / 微信 / 飞书 / Slack / 钉钉                                   |

#### M02 Workflow Engine —— 工作流引擎 *(详见第6章)*

| 功能点           | 说明                                            |
|---------------|-----------------------------------------------|
| JSON/YAML DSL | 声明式工作流定义，配套 JSON Schema 校验                    |
| 丰富节点类型        | 15+ 种节点（LLM/Agent/Tool/Code/条件/循环/并行/等待/子流程等） |
| DAG 执行引擎      | 拓扑排序 + 事件驱动执行                                 |
| 多触发方式         | 手动 / API Webhook / Cron 定时 / MQ 事件 / SaaS 事件  |
| 全流程快照         | 每个节点执行后持久化快照，支持断点恢复                           |
| 异常处理          | 节点级重试、超时、熔断、降级、人工介入                           |
| 变量与表达式        | 支持 `${expression}` 变量引用与 SpEL 表达式             |
| 嵌套子流程         | 工作流可嵌套调用其他工作流                                 |
| 热更新           | 运行中的工作流支持在线修改（新任务使用新版本）                       |
| 执行日志          | 每个节点的输入、输出、耗时、token 用量完整记录                    |

#### M03 Knowledge & RAG —— 知识库与检索增强

| 功能点          | 说明                                                          |
|--------------|-------------------------------------------------------------|
| 多格式文档导入      | PDF / Word / Excel / Markdown / HTML / 纯文本 / 数据库表           |
| 智能分块策略       | 递归字符分块 / 语义分块 / Token 分块，可自定义                               |
| 多向量库适配       | Milvus / PgVector / Elasticsearch / Chroma / FAISS（SPI 可扩展） |
| 多嵌入模型        | OpenAI Embedding / BGE / M3E / 自定义模型                        |
| 混合检索         | 向量语义检索 + BM25 全文检索 + 融合打分                                   |
| 重排序 Reranker | Cohere Reranker / BGE Reranker / 自定义 Cross-Encoder          |
| 知识库隔离        | 按租户、按 Agent 隔离知识数据                                          |
| 增量更新         | 文档变更时增量重新向量化，无需全量重建                                         |
| 检索质量监控       | Recall / Precision / MRR 指标自动统计                             |

#### M04 Tool & Plugin —— 工具与插件体系 *(详见第8章)*

| 功能点          | 说明                                   |
|--------------|--------------------------------------|
| 内置工具集        | 30+ 开箱即用（搜索/代码执行/HTTP/数据库/邮件/文件等）    |
| @Tool 注解     | Java 方法标注即可注册为 Agent 可用工具            |
| MCP 协议       | 原生支持 Model Context Protocol，动态发现远程工具 |
| OpenAPI 自动适配 | 导入 OpenAPI/Swagger Spec 自动生成可调用工具    |
| SPI 插件机制     | 通过 Java SPI 加载第三方插件 JAR，热插拔          |
| 工具权限控制       | 按租户/Agent/用户粒度控制工具可用范围               |
| 工具执行沙盒       | 代码类工具在 GraalVM 沙盒中隔离执行               |
| 工具执行监控       | 每次调用记录入参、出参、耗时、异常                    |

#### M05 Model Adapter —— 模型适配层 *(详见第11章)*

| 功能点         | 说明                                                                                                           |
|-------------|--------------------------------------------------------------------------------------------------------------|
| 统一抽象接口      | ChatModel / StreamingChatModel / EmbeddingModel / ImageModel                                                 |
| 20+ 厂商适配    | OpenAI / Anthropic / Google Gemini / Mistral / 通义千问 / 文心 / 智谱GLM / DeepSeek / Ollama / Azure / AWS Bedrock 等 |
| 流式输出        | SSE 流式返回，逐 token 输出                                                                                          |
| 多模态支持       | 文本 + 图片 + 音频输入                                                                                               |
| 模型路由        | 按场景/成本/延迟自动选择最优模型                                                                                            |
| Fallback 降级 | 主模型超时/异常时自动切换备用模型                                                                                            |
| Token 计量    | 精确统计每次调用的 input/output token                                                                                 |

#### M06 Memory —— 记忆模块

| 功能点      | 说明                  |
|----------|---------------------|
| 无记忆模式    | 每次对话独立，无上下文         |
| 滑动窗口     | 保留最近 N 轮对话          |
| Token 截断 | 按最大 Token 数截断历史     |
| 摘要压缩     | 用 LLM 将历史压缩为摘要      |
| 持久化记忆    | 长期记忆存储到 Redis / 数据库 |
| 会话隔离     | 按用户 + 会话 ID 隔离记忆上下文 |

#### M07 Guardrails —— 安全护栏 *(详见第10章)*

| 功能点   | 说明                                             |
|-------|------------------------------------------------|
| 输入护栏链 | Prompt 注入检测 → PII 脱敏 → 话题限制 → 内容审核             |
| 输出护栏链 | 幻觉检测 → 格式校验 → 内容审核 → 敏感词过滤                     |
| 自定义护栏 | 实现 `InputGuardrail` / `OutputGuardrail` 接口即可扩展 |
| 护栏统计  | 各类护栏触发次数、拦截率实时监控                               |

#### M08 Multi-Agent —— 多智能体协作 *(详见第9章)*

| 功能点             | 说明                           |
|-----------------|------------------------------|
| Router 路由模式     | 意图分类 → 分发给专业 Agent           |
| Supervisor 主管模式 | 任务分解 → 分配子 Agent → 汇总结果      |
| Swarm 蜂群模式      | 对等 Agent 按协议动态交接控制权          |
| Sequential 链式模式 | 串行传递，上游输出 = 下游输入             |
| 可配置化            | 通过 YAML/JSON 声明式定义多 Agent 拓扑 |

#### M09 Observability —— 可观测性 *(详见第12章)*

| 功能点   | 说明                                                 |
|-------|----------------------------------------------------|
| 分布式追踪 | OpenTelemetry Trace，从 API → Agent → LLM → Tool 全链路 |
| 指标采集  | Token 用量、延迟、成功率、工具调用频次等 Prometheus Metrics         |
| 结构化日志 | 每步推理的 Thought / Action / Observation 结构化记录         |
| 监控面板  | Grafana 预置仪表盘模板                                    |
| 告警规则  | 延迟突增、错误率攀升、Token 超限自动告警                            |

#### M10 Tenant & Auth —— 多租户与权限

| 功能点        | 说明                          |
|------------|-----------------------------|
| 多租户隔离      | 数据库行级隔离 + 向量库 Collection 隔离 |
| RBAC 权限    | 管理员 / 开发者 / 运营 / 访客 四种角色    |
| API Key 管理 | 按租户/应用颁发 API Key，支持过期与吊销    |
| 配额管理       | 按租户设置 Token / 调用次数 / 存储上限   |

#### M11 Prompt Management —— 提示词管理

| 功能点    | 说明                                 |
|--------|------------------------------------|
| 模板库    | 按行业/场景分类的提示词模板                     |
| 版本管理   | 每次修改自动版本化，可回滚                      |
| 变量占位   | `{{userName}}` `{{context}}` 运行时注入 |
| A/B 测试 | 同一 Agent 使用多个 Prompt 版本灰度对比        |

#### M12 Evaluation —— 质量评估

| 功能点   | 说明                                  |
|-------|-------------------------------------|
| 基准数据集 | 上传问答对作为评测基准                         |
| 自动评估  | LLM-as-Judge / BLEU / ROUGE / 语义相似度 |
| 回归测试  | Agent 升级后自动跑基准集，对比质量变化              |
| 人工评估  | 标注平台，人工打分与反馈                        |

#### M13 Marketplace —— 模板市场

| 功能点         | 说明                         |
|-------------|----------------------------|
| Agent 模板    | 预置行业 Agent（客服/营销/教育/研发助手等） |
| Workflow 模板 | 预置常见工作流（内容生成/数据分析/审批流等）    |
| Tool 模板     | 社区贡献的工具插件                  |
| 一键克隆        | 从市场复制模板到自己空间，自定义修改         |

---

## 5. 智能体类型体系

### 5.1 三维正交分类

```
AgentType = InteractionMode × ReasoningStrategy × AutonomyLevel
             (交互模式)         (推理策略)          (自治等级)
```

### 5.2 维度一：交互模式（Interaction Mode）

| 模式     | 标识                | 说明                    |
|--------|-------------------|-----------------------|
| 多轮对话   | `CHATBOT`         | 用户问一句答一句，保持上下文        |
| 单次生成   | `COMPLETION`      | 单次输入→单次输出             |
| 工作流    | `WORKFLOW`        | 事件/API/定时触发自动执行，无直接对话 |
| API 服务 | `AGENT_AS_API`    | 纯 REST API，嵌入第三方系统    |
| 任务引导   | `MULTI_TURN_TASK` | 多轮引导用户完成结构化任务         |

### 5.3 维度二：推理策略（Reasoning Strategy）

| 策略     | 标识                 | 工具调用 | 说明                                |
|--------|--------------------|:----:|-----------------------------------|
| 简单 LLM | `SIMPLE_LLM`       |  ❌   | Prompt → Response                 |
| 函数调用   | `FUNCTION_CALLING` | ✅ 单步 | 模型自动选择并调用函数                       |
| ReAct  | `REACT`            | ✅ 多步 | Thought → Action → Observation 循环 |
| 计划执行   | `PLAN_AND_EXECUTE` | ✅ 多步 | 先规划 → 逐步执行 → 动态调整                 |
| 多Agent | `MULTI_AGENT`      | ✅ 交叉 | 多个 Agent 协作分工                     |

### 5.4 维度三：自治等级（Autonomy Level）

| 等级 | 标识             | 人类角色 | Agent 行为        |
|----|----------------|------|-----------------|
| L0 | `TOOL`         | 完全控制 | 被动响应，无自主判断      |
| L1 | `ASSISTANT`    | 主导决策 | 提供建议/草稿，人类确认后执行 |
| L2 | `COLLABORATOR` | 人机协同 | 低风险自主执行，高风险需审批  |
| L3 | `DELEGATE`     | 设定目标 | 自主规划执行，定期汇报     |
| L4 | `AUTONOMOUS`   | 仅监督  | 自主发现→决策→执行→复盘   |

### 5.5 常见组合速查

| 场景    | 交互模式            | 推理策略             | 自治等级 |
|-------|-----------------|------------------|------|
| 知识问答  | CHATBOT         | SIMPLE_LLM + RAG | L1   |
| 智能客服  | CHATBOT         | FUNCTION_CALLING | L2   |
| 深度研究  | CHATBOT         | REACT            | L2   |
| 自动化报告 | WORKFLOW        | PLAN_AND_EXECUTE | L3   |
| 全自主运营 | WORKFLOW        | MULTI_AGENT      | L4   |
| 后端微服务 | AGENT_AS_API    | FUNCTION_CALLING | L0   |
| 引导式表单 | MULTI_TURN_TASK | FUNCTION_CALLING | L1   |

---

## 6. 工作流引擎设计（JSON/YAML DSL）

### 6.1 设计理念

| 原则            | 说明                            |
|---------------|-------------------------------|
| **声明式优先**     | 用 JSON/YAML 描述"是什么"，引擎负责"怎么做" |
| **Schema 驱动** | 配套 JSON Schema，IDE 自动补全 + 校验  |
| **双格式互通**     | JSON 与 YAML 100% 等价互转         |
| **表达式引擎**     | 节点参数支持 `${SpEL表达式}` 动态求值      |
| **可视化友好**     | DSL 结构可直接映射到前端画布节点和连线         |

### 6.2 DSL 顶层结构

**YAML 格式：**

```yaml
workflow:
  id: "wf-order-analysis"
  name: "订单数据分析工作流"
  version: "1.0.0"
  description: "每天定时拉取订单数据，AI 分析后生成报告并发送邮件"

  # ===== 触发器 =====
  trigger:
    type: CRON                    # MANUAL | WEBHOOK | CRON | MQ_EVENT | SAAS_EVENT
    config:
      cron: "0 8 * * *"          # 每天早上8点
      timezone: "Asia/Shanghai"

  # ===== 全局变量 =====
  variables:
    reportDate: "${T(java.time.LocalDate).now().minusDays(1)}"
    notifyEmail: "team@example.com"

  # ===== 全局配置 =====
  settings:
    maxExecutionSeconds: 600
    retryPolicy:
      maxRetries: 2
      backoffSeconds: 5
    onFailure: STOP               # STOP | CONTINUE | ROLLBACK

  # ===== 节点定义 =====
  nodes:
    - id: "start"
      type: START
      outputs:
        date: "${variables.reportDate}"
      next: "fetch-data"

    - id: "fetch-data"
      type: HTTP
      config:
        method: GET
        url: "https://api.example.com/orders"
        headers:
          Authorization: "Bearer ${secrets.API_TOKEN}"
        params:
          date: "${nodes.start.outputs.date}"
        timeout: 30
      outputs:
        orders: "${response.body}"
      next: "check-data"

    - id: "check-data"
      type: CONDITION
      config:
        expression: "${nodes['fetch-data'].outputs.orders.size() > 0}"
        ifTrue: "analyze"
        ifFalse: "no-data-end"

    - id: "analyze"
      type: LLM
      config:
        model:
          provider: openai
          name: gpt-4o
          temperature: 0.3
        systemPrompt: |
          你是一个数据分析专家，请分析以下订单数据，
          生成包含以下内容的分析报告：
          1. 订单总量与趋势
          2. 热门商品 TOP10
          3. 异常订单预警
        userPrompt: |
          日期：${nodes.start.outputs.date}
          订单数据（JSON）：${nodes['fetch-data'].outputs.orders}
      outputs:
        report: "${response.text}"
      next: "parallel-output"

    - id: "parallel-output"
      type: PARALLEL
      config:
        branches:
          - "save-report"
          - "send-email"
        waitAll: true
      next: "end"

    - id: "save-report"
      type: TOOL
      config:
        toolId: "file-writer"
        params:
          path: "/reports/${nodes.start.outputs.date}-analysis.md"
          content: "${nodes.analyze.outputs.report}"

    - id: "send-email"
      type: TOOL
      config:
        toolId: "email-sender"
        params:
          to: "${variables.notifyEmail}"
          subject: "${nodes.start.outputs.date} 订单分析报告"
          body: "${nodes.analyze.outputs.report}"

    - id: "no-data-end"
      type: END
      config:
        output:
          message: "当日无订单数据"

    - id: "end"
      type: END
      config:
        output:
          report: "${nodes.analyze.outputs.report}"
          message: "分析完成并已发送"
```

**等价 JSON 格式：**

```json
{
  "workflow": {
    "id": "wf-order-analysis",
    "name": "订单数据分析工作流",
    "version": "1.0.0",
    "trigger": {
      "type": "CRON",
      "config": { "cron": "0 8 * * *", "timezone": "Asia/Shanghai" }
    },
    "variables": {
      "reportDate": "${T(java.time.LocalDate).now().minusDays(1)}",
      "notifyEmail": "team@example.com"
    },
    "nodes": [
      { "id": "start", "type": "START", "next": "fetch-data" },
      { "id": "fetch-data", "type": "HTTP", "config": { "..." : "..." }, "next": "check-data" }
    ]
  }
}
```

### 6.3 完整节点类型清单

| 节点类型        | 标识                    | 功能说明                  | 配置要素                                                    |
|-------------|-----------------------|-----------------------|---------------------------------------------------------|
| **开始**      | `START`               | 流程入口，声明输入参数           | `inputs` 参数定义                                           |
| **结束**      | `END`                 | 流程出口，声明输出结果           | `output` 结果映射                                           |
| **LLM**     | `LLM`                 | 直接调用大语言模型             | `model` / `systemPrompt` / `userPrompt` / `temperature` |
| **Agent**   | `AGENT`               | 调用一个完整智能体（含工具/记忆/RAG） | `agentId` 引用已定义的 Agent                                  |
| **工具调用**    | `TOOL`                | 调用单个注册工具              | `toolId` / `params`                                     |
| **HTTP 请求** | `HTTP`                | 发起 HTTP 请求            | `method` / `url` / `headers` / `params` / `body`        |
| **代码执行**    | `CODE`                | 在沙盒中执行代码片段            | `language`(java/js/python/groovy) / `code`              |
| **条件分支**    | `CONDITION`           | if-else 分支判断          | `expression` / `ifTrue` / `ifFalse`                     |
| **Switch**  | `SWITCH`              | 多路分支（类似 switch-case）  | `expression` / `cases: [{value, next}]` / `default`     |
| **循环**      | `LOOP`                | 遍历集合执行子节点             | `collection` / `iterator` / `body` / `maxIterations`    |
| **While**   | `WHILE`               | 条件循环                  | `condition` / `body` / `maxIterations`                  |
| **并行**      | `PARALLEL`            | 并行执行多个分支              | `branches[]` / `waitAll` (true/false)                   |
| **等待**      | `WAIT`                | 暂停等待人工审批或外部事件         | `waitType`(APPROVAL/EVENT/TIMER) / `timeout`            |
| **子工作流**    | `SUB_WORKFLOW`        | 调用另一个工作流              | `workflowId` / `inputMapping`                           |
| **变量赋值**    | `SET_VARIABLE`        | 设置/修改流程变量             | `assignments: [{name, value}]`                          |
| **知识检索**    | `KNOWLEDGE_RETRIEVAL` | 检索知识库                 | `knowledgeBaseIds` / `query` / `topK`                   |

### 6.4 表达式与变量系统

| 语法                           | 说明          | 示例                                          |
|------------------------------|-------------|---------------------------------------------|
| `${variables.xxx}`           | 引用全局变量      | `${variables.reportDate}`                   |
| `${nodes['id'].outputs.xxx}` | 引用上游节点输出    | `${nodes['fetch-data'].outputs.orders}`     |
| `${secrets.xxx}`             | 引用加密密钥      | `${secrets.API_TOKEN}`                      |
| `${context.xxx}`             | 引用运行时上下文    | `${context.tenantId}` / `${context.userId}` |
| `${T(ClassName).method()}`   | SpEL 静态方法调用 | `${T(java.time.LocalDate).now()}`           |
| `${#fn.xxx()}`               | 内置函数        | `${#fn.toJson(data)}` / `${#fn.uuid()}`     |

### 6.5 异常处理策略

```yaml
# 节点级异常处理
nodes:
  - id: "risky-call"
    type: HTTP
    config:
      url: "https://unstable-api.example.com/data"
    retry:
      maxRetries: 3
      backoffSeconds: 5
      retryOn:
        - TIMEOUT
        - HTTP_5XX
    timeout: 30
    onFailure:
      strategy: FALLBACK            # STOP | SKIP | FALLBACK | GOTO
      fallbackNode: "use-cache"     # 失败时跳转到缓存节点
    onTimeout:
      strategy: GOTO
      gotoNode: "timeout-handler"
```

### 6.6 JSON Schema 校验

框架内置完整的 JSON Schema 文件，提供：

- **结构校验**：节点类型、必填字段、嵌套层级
- **表达式校验**：`${...}` 引用的变量/节点是否存在
- **连通性校验**：DAG 无孤立节点、无环检测、START/END 完整性
- **IDE 集成**：VS Code / IntelliJ 自动补全与红线提示

### 6.7 执行引擎核心流程

```
                     Workflow DSL (JSON/YAML)
                              │
                     ┌────────▼────────┐
                     │   DSL Parser    │  解析 + Schema 校验
                     │  & Validator    │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │   DAG Builder   │  构建有向无环图
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │  Topo Sorter    │  拓扑排序确定执行顺序
                     └────────┬────────┘
                              │
              ┌───────────────▼───────────────┐
              │      Execution Engine          │
              │  ┌─────────────────────────┐   │
              │  │ for each node in order: │   │
              │  │   1. 解析表达式          │   │
              │  │   2. 调用 NodeExecutor   │   │
              │  │   3. 保存节点输出        │   │
              │  │   4. 持久化快照          │   │
              │  │   5. 异常处理            │   │
              │  │   6. 推进到下一节点      │   │
              │  └─────────────────────────┘   │
              └───────────────┬───────────────┘
                              │
                     ┌────────▼────────┐
                     │  Result Builder │  汇总输出 + 执行报告
                     └─────────────────┘
```

---

## 7. RAG 与知识库模块

### 7.1 RAG Pipeline 全流程

```
文档上传 → 格式���析 → 智能分块 → 向量化 → 存储入库
                                                │
用户提问 → Query 改写 → 混合检索 → 重排序 → 上下文注入 → LLM 生成
```

### 7.2 检索策略矩阵

| 策略        | 原理                        | 优势    | 劣势     |
|-----------|---------------------------|-------|--------|
| 向量语义检索    | Embedding 余弦相似度           | 语义理解强 | 精确关键词弱 |
| BM25 全文检索 | TF-IDF 变体                 | 精确匹配强 | 不理解语义  |
| 混合检索      | 向量 + BM25 融合打分            | 兼顾两者  | 需调融合权重 |
| 混合 + 重排序  | 混合检索 + Cross-Encoder 二次排序 | 质量最高  | 延迟略高   |

### 7.3 分块策略

| 策略       | 适用场景          | 参数                                       |
|----------|---------------|------------------------------------------|
| 固定大小分块   | 通用            | `chunkSize` / `overlap`                  |
| 递归字符分块   | 结构化文档         | `separators[]` / `chunkSize`             |
| 语义分块     | 长文/论文         | `embeddingModel` / `similarityThreshold` |
| Token 分块 | 精确控制 token    | `maxTokens` / `overlap`                  |
| 按标题分块    | Markdown/HTML | 自动识别标题层级                                 |

---

## 8. 工具与插件体系

### 8.1 工具来源分层

```
┌─────────────────────────────────────────────┐
│              Tool Registry                  │
│                                             │
│  ┌───────────────┐  ┌───────────────────┐   │
│  │ 内置工具       │  │ MCP 远程工具       │   │
│  │ @Tool 注解     │  │ MCP Client 动态   │   │
│  │ Java 方法      │  │ 发现 & 注册       │   │
│  └───────────────┘  └───────────────────┘   │
│                                             │
│  ┌───────────────┐  ┌───────────────────┐   │
│  │ OpenAPI 工具   │  │ SPI 插件工具       │   │
│  │ 导入 Swagger   │  │ 第三方 JAR 包     │   │
│  │ 自动生成       │  │ 热插拔加载        │   │
│  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────┘
```

### 8.2 内置工具清单（首期 30+）

| 分类        | 工具名称              | 说明                            |
|-----------|-------------------|-------------------------------|
| **搜索**    | web-search        | 互联网搜索                         |
|           | news-search       | 新闻搜索                          |
|           | academic-search   | 学术论文搜索                        |
| **代码**    | code-executor     | 沙盒代码执行（Java/JS/Python/Groovy） |
|           | code-interpreter  | 代码解释与分析                       |
| **数据**    | sql-query         | SQL 数据库查询                     |
|           | http-request      | 通用 HTTP 请���                  |
|           | json-parser       | JSON 解析与转换                    |
|           | xml-parser        | XML 解析                        |
|           | csv-reader        | CSV 数据读取                      |
| **文件**    | file-reader       | 文件读取                          |
|           | file-writer       | 文件写入                          |
|           | pdf-generator     | PDF 生成                        |
|           | excel-generator   | Excel 生成                      |
| **通信**    | email-sender      | 邮件发送                          |
|           | slack-notifier    | Slack 消息推送                    |
|           | feishu-notifier   | 飞书消息推送                        |
|           | dingtalk-notifier | 钉钉消息推送                        |
|           | webhook-caller    | Webhook 回调                    |
| **AI 增强** | image-generator   | 图片生成（DALL·E / SD）             |
|           | image-analyzer    | 图片分析与描述                       |
|           | ocr               | 图片文字识别                        |
|           | speech-to-text    | 语音转文字                         |
|           | text-to-speech    | 文字转语音                         |
|           | translator        | 多语种翻译                         |
| **数学/逻辑** | calculator        | 数学计算                          |
|           | date-calculator   | 日期计算                          |
| **系统**    | variable-store    | 变量持久化存储                       |
|           | cache-manager     | 缓存读写                          |
|           | uuid-generator    | UUID 生成                       |

### 8.3 MCP 协议集成

| 能力        | 说明                                       |
|-----------|------------------------------------------|
| 动态发现      | 连接 MCP Server，自动获取可用工具列表                 |
| Schema 映射 | MCP Tool Schema ↔ LangChain4j @Tool 自动转换 |
| 上下文注入     | 通过 MCP Header Provider 注入租户/用户上下文        |
| 执行监听      | MCP Listener 记录每次远程工具调用                  |
| 连接池       | 复用 MCP 连接，降低延迟                           |

---

## 9. 多 Agent 协作模块

### 9.1 四种协作模式

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ① Router 路由模式           ② Supervisor 主管模式              │
│                                                                 │
│  用户 ──→ [Router Agent]     用户 ──→ [Supervisor Agent]        │
│           ╱     │     ╲              ╱      │      ╲            │
│          ▼      ▼      ▼           ▼       ▼       ▼           │
│       [专家A] [专家B] [专家C]    [Worker] [Worker] [Worker]      │
│         │                         │        │        │           │
│         └──→ 直接返回              └────────┴────────┘           │
│                                          │                      │
│                                    [Supervisor 汇总]            │
│                                          │                      │
│                                        返回                     │
│                                                                 │
│  ③ Swarm 蜂群模式            ④ Sequential 链式模式              │
│                                                                 │
│  用户 ──→ [Agent A]          用户 ──→ [Agent 1]                 │
│              │ 交接                       │                     │
│              ▼                            ▼                     │
│          [Agent B]                   [Agent 2]                  │
│              │ 交接                       │                     │
│              ▼                            ▼                     │
│          [Agent C]                   [Agent 3]                  │
│              │                            │                     │
│            返回                          返回                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 YAML 定义示例（Supervisor 模式）

```yaml
multi-agent:
  pattern: SUPERVISOR
  supervisor:
    agentId: "supervisor-agent"
    maxRounds: 5
  workers:
    - agentId: "research-agent"
      role: "负责信息调研和数据收集"
    - agentId: "analysis-agent"
      role: "负责数据分析和洞察提取"
    - agentId: "writing-agent"
      role: "负责报告撰写和格式化"
  summarization:
    strategy: LLM_MERGE          # LLM_MERGE | CONCAT | LAST_ONLY
```

---

## 10. 安全护栏模块（Guardrails）

### 10.1 双向护栏链

```
用户输入
   │
   ▼
┌──────────────────────────────────────┐
│           输入护栏链 (Input)          │
│                                      │
│  Prompt注入检测 → PII脱敏 → 话题限制  │
│  → 长度限制 → 内容审核 → 自定义规则   │
└──────────────────┬───────────────────┘
                   │ (通过)
                   ▼
            ┌──────────┐
            │  Agent   │
            │  推理执行  │
            └────┬─────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│          输出护栏链 (Output)          │
│                                      │
│  幻觉检测 → 格式校验(JSON Schema)    │
│  → 敏感词过滤 → 内容审核 → 自定义规则 │
└──────────────────┬───────────────────┘
                   �� (通过)
                   ▼
              返回用户
```

### 10.2 护栏类型清单

| 护栏             | 方向    | 说明                        |
|----------------|-------|---------------------------|
| Prompt 注入检测    | 输入    | 检测并拦截 prompt injection 攻击 |
| PII 脱敏         | 输入    | 自动识别并脱敏手机号/身份证/银行卡等       |
| 话题限制           | 输入    | 限制 Agent 只讨论允许的话题         |
| 长度限制           | 输入    | 限制输入最大长度                  |
| 内容审核           | 输入/输出 | 违规内容（暴力/色情/政治）过滤          |
| 幻觉检测           | 输出    | 基于知识库检验输出是否有事实依据          |
| JSON Schema 校验 | 输出    | 验证结构化输出符合预定义格式            |
| 敏感词过滤          | 输出    | 自定义敏感词/关键词过滤              |
| 自定义规则          | 输入/输出 | 实现 Guardrail SPI 接口自行扩展   |

---

## 11. 模型适配层

### 11.1 支持厂商矩阵

| 厂商               | Chat 模型 | Embedding 模型 | 图片模型 | 流式 | MCP |
|------------------|:-------:|:------------:|:----:|:--:|:---:|
| OpenAI           |    ✅    |      ✅       |  ✅   | ✅  |  ✅  |
| Anthropic Claude |    ✅    |      —       |  —   | ✅  |  ✅  |
| Google Gemini    |    ✅    |      ✅       |  ✅   | ✅  |  ✅  |
| Mistral          |    ✅    |      ✅       |  —   | ✅  |  —  |
| 通义千问 (Qwen)      |    ✅    |      ✅       |  —   | ✅  |  —  |
| 百度文心             |    ✅    |      ✅       |  —   | ✅  |  —  |
| 智谱 GLM           |    ✅    |      ✅       |  —   | ✅  |  —  |
| DeepSeek         |    ✅    |      —       |  —   | ✅  |  —  |
| Ollama (本地)      |    ✅    |      ✅       |  —   | ✅  |  —  |
| Azure OpenAI     |    ✅    |      ✅       |  ✅   | ✅  |  ✅  |
| AWS Bedrock      |    ✅    |      ✅       |  —   | ✅  |  —  |

### 11.2 模型路由与降级

| 策略         | 说明                  |
|------------|---------------------|
| 成本优先       | 简单任务用便宜模型，复杂任务用高端模型 |
| 延迟优先       | 实时场景选延迟最低的可用模型      |
| Fallback 链 | 主模型 → 备用模型1 → 备用模型2 |
| A/B 路由     | 按百分比分流到不同模型，对比效果    |
| 负载均衡       | 同一模型多 API Key 轮询    |

---

## 12. 可观测性与运营模块

### 12.1 三大支柱

| 支柱          | 技术方案                         | 采集内容                                      |
|-------------|------------------------------|-------------------------------------------|
| **Traces**  | OpenTelemetry → Jaeger/Tempo | 请求全链路：API → Agent → LLM → Tool → Response |
| **Metrics** | Micrometer → Prometheus      | Token 用量、延迟、成功率、并发数、队列深度                  |
| **Logs**    | SLF4J → Loki/ELK             | Thought / Action / Observation 结构化推理日志    |

### 12.2 核心监控指标

| 分类      | 指标                          | 说明                     |
|---------|-----------------------------|------------------------|
| **性能**  | `agent.latency.p50/p95/p99` | 端到端延迟分位数               |
|         | `llm.call.duration`         | 模型调用耗时                 |
|         | `tool.call.duration`        | 工具调用耗时                 |
| **用量**  | `token.input.total`         | 输入 Token 总量（按租户/Agent） |
|         | `token.output.total`        | 输出 Token 总量            |
|         | `token.cost.usd`            | Token 费用估算             |
| **质量**  | `rag.retrieval.recall`      | 知识库检索召回率               |
|         | `guardrail.block.rate`      | 护栏拦截率                  |
|         | `user.feedback.score`       | 用户满意度（点赞/点踩）           |
| **可用性** | `agent.error.rate`          | Agent 错误率              |
|         | `workflow.success.rate`     | 工作流成功完成率               |
|         | `tool.failure.rate`         | 工具调用失败率                |

### 12.3 Grafana 预置仪表盘

| 面板               | 内容                            |
|------------------|-------------------------------|
| Agent Overview   | 调用量趋势、延迟分布、错误率、Top 5 热门 Agent |
| Token Economics  | 各模型/租户的 Token 消耗与费用趋势         |
| RAG Quality      | 检索命中率、重排序提升比例、无结果查询 TOP       |
| Workflow Monitor | 工作流执行漏斗、各节点耗时、失败节点分布          |
| Tool Health      | 工具调用 QPS、成功率、P95 延迟           |
| Guardrail Stats  | 各护栏触发次数、拦截分类分布                |

---

## 13. 多租户与权限体系

### 13.1 隔离策略

| 层面      | 隔离方式                             |
|---------|----------------------------------|
| 数据库     | 行级隔离（`tenant_id` 字段 + 全局 Filter） |
| 向量库     | 按租户独立 Collection / Namespace     |
| 对象存储    | 按租户独立 Bucket / Prefix            |
| 缓存      | Key 前缀隔离 `{tenantId}:`           |
| API Key | 按租户颁发，自动注入 tenant 上下文            |

### 13.2 RBAC 角色模型

| 角色        | 权限                                      |
|-----------|-----------------------------------------|
| **超级管理员** | 所有操作 + 租户管理                             |
| **租户管理员** | 管理本租户的 Agent / Workflow / 知识库 / 工具 / 用户 |
| **开发者**   | 创建和编辑 Agent / Workflow / 工具             |
| **运营**    | 发布/下线 Agent、查看监控数据、管理知识库内容              |
| **访客**    | 仅使用已发布的 Agent 对话                        |

### 13.3 配额管理

| 配额维度     | 说明               |
|----------|------------------|
| Token 上限 | 每日/每月 Token 消耗上限 |
| 调用频率     | QPS 限流           |
| Agent 数量 | 最大可创建 Agent 数    |
| 知识库容量    | 最大文档数 / 向量数      |
| 工作流数量    | 最大可创建 Workflow 数 |

---

## 14. 技术选型总览

| 层级          | 技术                                            | 版本                   |
|-------------|-----------------------------------------------|----------------------|
| **语言**      | Java                                          | 21 (Virtual Threads) |
| **AI 框架**   | LangChain4j                                   | 1.11.0               |
| **应用框架**    | Spring Boot                                   | 3.5.x                |
| **构建工具**    | Maven                                         | 3.9.x                |
| **关系数据库**   | PostgreSQL                                    | 16+                  |
| **缓存**      | Redis                                         | 7+                   |
| **向量数据库**   | Milvus / PgVector / Elasticsearch             | 可插拔                  |
| **消息队列**    | RabbitMQ 或 Kafka                              | 按需                   |
| **对象存储**    | MinIO / S3                                    | 兼容                   |
| **代码沙盒**    | GraalVM Polyglot                              | 24+                  |
| **表达式引擎**   | Spring Expression Language (SpEL)             | Spring 内置            |
| **DSL 校验**  | JSON Schema (networknt/json-schema-validator) | draft-2020-12        |
| **YAML 解析** | SnakeYAML / Jackson YAML                      | —                    |
| **分布式追踪**   | OpenTelemetry                                 | 1.x                  |
| **指标**      | Micrometer → Prometheus                       | —                    |
| **日志**      | SLF4J → Logback → Loki / ELK                  | —                    |
| **监控面板**    | Grafana                                       | 11+                  |
| **容器**      | Docker                                        | —                    |
| **编排**      | Kubernetes + Helm                             | —                    |

---

## 15. 项目模块结构

```
agentx/
│
├── agentx-bom/                        # 依赖版本统一管理 (BOM)
│
├── agentx-core/                       # 核心模块
│   ├── agent/                         #   智能体定义 & 运行时
│   ├── workflow/                      #   工作流引擎
│   │   ├── dsl/                       #     DSL 解析器（JSON/YAML）
│   │   ├── schema/                    #     JSON Schema 校验
│   │   ├── engine/                    #     DAG 执行引擎
│   │   ├── node/                      #     节点执行器（SPI）
│   │   ├── expression/                #     SpEL 表达式引擎
│   │   └── state/                     #     状态快照 & 断点恢复
│   ├── knowledge/                     #   知识库 & RAG Pipeline
│   │   ├── parser/                    #     文档解析器
│   │   ├── splitter/                  #     分块策略
│   │   ├── retriever/                 #     检索器（向量/全文/混合）
│   │   └── reranker/                  #     重排序器
│   ├── tool/                          #   工具注册中心
│   ├── memory/                        #   记忆模块
│   ├── guardrail/                     #   安全护栏
│   ├── multi-agent/                   #   多 Agent 协作
│   └── prompt/                        #   提示词管理
│
├── agentx-model-providers/            # 模型厂商适配
│   ├── agentx-model-openai/
│   ├── agentx-model-anthropic/
│   ├── agentx-model-gemini/
│   ├── agentx-model-qwen/
│   ├── agentx-model-zhipu/
│   ├── agentx-model-deepseek/
│   ├── agentx-model-ollama/
│   └── ...
│
├── agentx-tools-builtin/             # 内置工具集
│   ├── agentx-tool-search/
│   ├── agentx-tool-code/
│   ├── agentx-tool-http/
│   ├── agentx-tool-database/
│   ├── agentx-tool-file/
│   ├── agentx-tool-notify/
│   └── agentx-tool-ai/
│
├── agentx-vectorstore/               # 向量库适配
│   ├── agentx-vectorstore-milvus/
│   ├── agentx-vectorstore-pgvector/
│   ├── agentx-vectorstore-elasticsearch/
│   └── agentx-vectorstore-chroma/
│
├── agentx-infrastructure/            # 基础设施
│   ├── persistence/                  #   JPA / MyBatis-Plus
│   ├── messaging/                    #   RabbitMQ / Kafka
│   ├── storage/                      #   MinIO / S3
│   ├── cache/                        #   Redis
│   └── security/                     #   认证 & 鉴权
│
├── agentx-observability/             # 可观测性
│   ├── tracing/                      #   OpenTelemetry 集成
│   ├── metrics/                      #   Micrometer / Prometheus
│   ├── logging/                      #   结构化日志
│   └── dashboard/                    #   Grafana 模板
│
├── agentx-starter/       # Spring Boot 自动装配
│
├── agentx-api-examples/                       # REST API / WebSocket 接入层
│
├── agentx-cli/                       # 命令行工具
│
├── agentx-eval/                      # 评估模块
│
├── agentx-samples/                   # 示例项目
│   ├── sample-chatbot/
│   ├── sample-workflow/
│   ├── sample-multi-agent/
│   └── sample-rag/
│
├── docs/                             # 文档
│   ├── architecture.md
│   ├── getting-started.md
│   ├── workflow-dsl-spec.md
│   ├── tool-development-guide.md
│   └── deployment-guide.md
│
└── deploy/                           # 部署配置
    ├── docker/
    ├── docker-compose/
    ├── kubernetes/
    └── helm/
```

---

## 16. 与 Coze / Dify 竞争力对比

| 维度              | Coze             | Dify                     | **AgentX (本方案)**              |
|-----------------|------------------|--------------------------|-------------------------------|
| **语言生��**       | Python (后端不开源)   | Python (Flask)           | **Java 21 + Spring Boot**     |
| **开源**          | ❌ 闭源 SaaS        | ✅ 开源                     | ✅ 开源                          |
| **企业级适配**       | 一般               | 中等                       | **⭐ 天然适配 Java 企业**            |
| **工作流 DSL**     | 可视化拖拽 (无 DSL 文件) | 可视化 + JSON               | **JSON + YAML + JSON Schema** |
| **工作流 GitOps**  | ❌                | ❌                        | **✅ 文件化可 Git 版本管理**           |
| **推理策略**        | Function Calling | ReAct + Function Calling | **5 种策略全覆盖**                  |
| **多 Agent 协作**  | 弱 (Bot 嵌套)       | 中 (Agent节点)              | **⭐ 4 种模式原生支持**               |
| **自治等级控制**      | ❌                | ❌                        | **✅ L0-L4 精细控制**              |
| **Guardrails**  | 基础审核             | 基础 Moderation            | **⭐ 双向多级护栏链**                 |
| **MCP 协议**      | ❌                | ❌                        | **✅ 原生支持**                    |
| **模型适配**        | 字节系为主            | 多厂商                      | **20+ 厂商 (LangChain4j)**      |
| **可观测性**        | 后台监控             | 基础日志                     | **⭐ OTel 全链路追踪**              |
| **多租户**         | ✅ (SaaS)         | ✅ (基础)                   | **✅ (行级隔离+配额)**               |
| **私有化部署**       | ❌                | ✅                        | **✅ Docker/K8s/Helm**         |
| **Spring 生态整合** | ❌                | ❌                        | **⭐ Spring Boot Starter**     |
| **虚拟线程**        | —                | —                        | **✅ Java 21 高并发**             |

### 核心差异化优势总结

1. **Java 企业级定位** —— 银行/保险/政企/大型制造业的首选技术栈
2. **JSON/YAML DSL + GitOps** —— 工作流可纳入代码仓库版本管理，支持 Code Review 和 CI/CD
3. **五种推理策略 + 四种协作模式** —— 覆盖从简单到超复杂的全场景
4. **L0-L4 自治等级** —— 业界首创精细化 Agent 权限控制
5. **双向多级 Guardrails** —— 满足金融/医疗/政务等高合规行业
6. **MCP 协议原生** —— 工具生态无限扩展
7. **OpenTelemetry 全链路** —— 从 API 入口到 LLM Token 每一步可追踪

---

## 17. 实施路线图

| 阶段                     | 周期        | 交付模块                                                           | 里程碑                      |
|------------------------|-----------|----------------------------------------------------------------|--------------------------|
| **Phase 0 — 奠基**       | 第 1-2 周   | BOM + Core 骨架 + Spring Boot Starter                            | 框架可运行，Hello Agent        |
| **Phase 1 — MVP**      | 第 3-6 周   | M01 Agent Core + M05 Model Adapter + M06 Memory + M04 Tool(内置) | 单 Agent 对话 + 工具调用        |
| **Phase 2 — RAG**      | 第 7-9 周   | M03 Knowledge & RAG                                            | 文档导入 + 混合检索 + Agent 知识问答 |
| **Phase 3 — Workflow** | 第 10-14 周 | M02 Workflow Engine(JSON/YAML DSL + 15 节点类型)                   | 完整工作流编排能力                |
| **Phase 4 — 安全**       | 第 15-17 周 | M07 Guardrails + M10 Tenant & Auth                             | 双向护栏 + 多租户隔离             |
| **Phase 5 — 协作**       | 第 18-20 周 | M08 Multi-Agent                                                | 4 种协作模式                  |
| **Phase 6 — 运维**       | 第 21-23 周 | M09 Observability + M14 Gateway                                | OTel 全链路 + API 网关        |
| **Phase 7 — 生态**       | 第 24-28 周 | M11 Prompt + M12 Eval + M13 Marketplace + CLI                  | 提示词管理 + 评估 + 模板市场        |
| **Phase 8 — 打磨**       | 第 29-32 周 | 文档完善 + 示例项目 + 性能调优 + 安全审计                                      | **v1.0 正式发布**            |

---

> **AgentX** —— 让每一位 Java 开发者都能快速构建生产级智能体应用。
