# AgentX 插件开发指南

> 版本：1.0.0 | 适用 AgentX Framework 1.0.0+

---

## 目录

1. [概述](#1-概述)
2. [插件架构](#2-插件架构)
3. [快速开始](#3-快速开始)
4. [插件生命周期](#4-插件生命周期)
5. [扩展点详解](#5-扩展点详解)
6. [技能系统](#6-技能系统)
7. [插件配置](#7-插件配置)
8. [完整示例](#8-完整示例)
9. [最佳实践](#9-最佳实践)
10. [常见问题](#10-常见问题)

---

## 1. 概述

AgentX 插件系统允许开发者以**插拔式**方式扩展框架能力，无需修改核心代码。一个插件可以向框架注册：

| 扩展点                             | 说明               | 接口                                   |
|---------------------------------|------------------|--------------------------------------|
| **工具 (Tool)**                   | Agent 可调用的外部能力   | `ToolDescriptor`                     |
| **技能 (Skill)**                  | 工具 + 提示词的可复用能力单元 | `SkillDefinition`                    |
| **护栏 (Guardrail)**              | 输入/输出安全检查        | `InputGuardrail` / `OutputGuardrail` |
| **工作流节点 (NodeExecutor)**        | 自定义工作流节点类型       | `NodeExecutor`                       |
| **模型工厂 (ModelFactory)**         | 新的 LLM 提供商适配     | `ModelFactory`                       |
| **向量存储工厂 (VectorStoreFactory)** | 新的向量数据库适配        | `VectorStoreFactory`                 |

---

## 2. 插件架构

```
┌─────────────────────────────────────────────────┐
│                 AgentX Framework                 │
│                                                  │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐  │
│  │  Agent     │   │ Workflow  │   │ Knowledge │  │
│  │  Registry  │   │ Engine    │   │ Base      │  │
│  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘  │
│        │               │               │         │
│  ┌─────▼───────────────▼───────────────▼─────┐   │
│  │            PluginManager                   │   │
│  │  ┌────────────────────────────────────┐    │   │
│  │  │         PluginContext               │    │   │
│  │  │  registerTool()                     │    │   │
│  │  │  registerSkill()                    │    │   │
│  │  │  registerInputGuardrail()           │    │   │
│  │  │  registerOutputGuardrail()          │    │   │
│  │  │  registerNodeExecutor()             │    │   │
│  │  │  registerModelFactory()             │    │   │
│  │  │  registerVectorStoreFactory()       │    │   │
│  │  └────────────────────────────────────┘    │   │
│  └─────┬──────────┬──────────┬───────────┘    │   │
│        │          │          │                 │
│  ┌─────▼────┐ ┌──▼─────┐ ┌─▼──────────┐      │
│  │ Plugin A │ │Plugin B│ │ Plugin C   │      │
│  └──────────┘ └────────┘ └────────────┘      │
└─────────────────────────────────────────────────┘
```

### 核心类

- **`AgentXPlugin`** — 插件 SPI 接口，所有插件必须实现
- **`PluginDescriptor`** — 插件元信息（ID、名称、版本、扩展点）
- **`PluginContext`** — 框架提供给插件的注册 API
- **`PluginManager`** — 管理插件的生命周期

---

## 3. 快速开始

### 3.1 创建插件类

```java
package com.example.plugins;

import com.agentx.core.plugin.AgentXPlugin;
import com.agentx.core.plugin.PluginContext;
import com.agentx.core.plugin.PluginDescriptor;
import com.agentx.core.tool.ToolDescriptor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@Slf4j
public class MyFirstPlugin implements AgentXPlugin {

    @Override
    public PluginDescriptor getDescriptor() {
        return PluginDescriptor.builder()
                .id("my-first-plugin")           // 唯一标识
                .name("我的第一个插件")             // 显示名称
                .version("1.0.0")                 // 版本号
                .description("一个简单的示例插件")   // 描述
                .author("Your Name")              // 作者
                .extensionPoints(List.of("tool"))  // 声明扩展点类型
                .config(Map.of(                    // 默认配置
                        "greeting", "Hello"
                ))
                .build();
    }

    @Override
    public void init(PluginContext context) {
        // 在这里注册你的扩展组件
        String greeting = context.getConfig("greeting", String.class);

        context.registerTool(ToolDescriptor.builder()
                .id("greeting-tool")
                .name("问候工具")
                .description("向用户发送问候")
                .category("utility")
                .source(ToolDescriptor.ToolSource.SPI)
                .executor(params -> {
                    String name = (String) params.getOrDefault("name", "World");
                    return greeting + ", " + name + "!";
                })
                .build());

        log.info("MyFirstPlugin initialized");
    }
}
```

### 3.2 注册插件

有两种方式让框架发现你的插件：

**方式一：Spring Bean 自动发现（推荐）**

```java
@Configuration
public class PluginConfig {

    @Bean
    public MyFirstPlugin myFirstPlugin() {
        return new MyFirstPlugin();
    }
}
```

**方式二：手动安装**

```java
@Autowired
private PluginManager pluginManager;

public void loadPlugin() {
    pluginManager.install(new MyFirstPlugin());
}
```

### 3.3 验证插件

启动应用后通过 REST API 验证：

```bash
# 查看所有已安装插件
curl http://localhost:8080/api/v1/plugins

# 查看插件状态
curl http://localhost:8080/api/v1/plugins/status
```

---

## 4. 插件生命周期

```
LOADED → INITIALIZED → STARTED → STOPPED
                ↓
              FAILED
```

| 阶段      | 方法                    | 说明                |
|---------|-----------------------|-------------------|
| **加载**  | —                     | 框架发现并创建插件实例       |
| **初始化** | `init(PluginContext)` | 注册扩展组件（工具、技能、护栏等） |
| **启动**  | `start()`             | 初始化完成后调用，可启动后台任务  |
| **停止**  | `stop()`              | 卸载或关闭时调用，释放资源     |

> **重要**：所有扩展注册操作必须在 `init()` 方法中完成。`start()` 和 `stop()` 是可选的。

---

## 5. 扩展点详解

### 5.1 注册工具 (Tool)

工具是 Agent 与外部世界交互的能力单元。

```java
@Override
public void init(PluginContext context) {
    context.registerTool(ToolDescriptor.builder()
            .id("my-tool")                       // 唯一 ID
            .name("我的工具")                      // 显示名称
            .description("工具功能描述")            // LLM 会读取此描述来决定是否调用
            .category("utility")                  // 分类
            .source(ToolDescriptor.ToolSource.SPI) // 来源标记
            .executor(params -> {                  // 执行逻辑
                // params 是 Map<String, Object>
                String input = (String) params.get("input");
                return "处理结果: " + input;
            })
            .build());
}
```

**注意事项**：

- `description` 非常重要，LLM 通过描述决定何时调用工具
- `executor` 的返回值建议使用 JSON 字符串格式
- 工具 ID 必须全局唯一

### 5.2 注册护栏 (Guardrail)

护栏用于检查 Agent 的输入和输出安全性。

```java
// 输入护栏
context.registerInputGuardrail(new InputGuardrail() {
    @Override
    public String getId() { return "my-input-guard"; }

    @Override
    public GuardrailResult check(String input) {
        if (input.contains("危险词汇")) {
            return GuardrailResult.builder()
                    .passed(false)
                    .message("输入包含不允许的内容")
                    .build();
        }
        return GuardrailResult.builder().passed(true).build();
    }
});

// 输出护栏
context.registerOutputGuardrail(new OutputGuardrail() {
    @Override
    public String getId() { return "my-output-guard"; }

    @Override
    public GuardrailResult check(String output) {
        // 检查输出中是否有敏感信息泄露
        return GuardrailResult.builder().passed(true).build();
    }
});
```

### 5.3 注册工作流节点执行器

自定义新的工作流节点类型。

```java
context.registerNodeExecutor(new NodeExecutor() {
    @Override
    public String getNodeType() { return "custom-transform"; }

    @Override
    public Map<String, Object> execute(NodeDefinition node, Map<String, Object> inputs) {
        // 自定义节点执行逻辑
        String data = (String) inputs.get("data");
        return Map.of("result", data.toUpperCase());
    }
});
```

### 5.4 注册模型工厂

适配新的 LLM 提供商。

```java
context.registerModelFactory(new ModelFactory() {
    @Override
    public String getProvider() { return "my-llm-provider"; }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
        // 创建你的 ChatModel 实现
        return null;
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
        return null;
    }
});
```

### 5.5 注册向量存储工厂

适配新的向量数据库。

```java
context.registerVectorStoreFactory(new VectorStoreFactory() {
    @Override
    public String getType() { return "my-vectordb"; }

    @Override
    public EmbeddingStore<TextSegment> createEmbeddingStore(VectorStoreConfigDefinition config) {
        // 创建 EmbeddingStore 实例
        return null;
    }
});
```

---

## 6. 技能系统

技能 (Skill) 是 AgentX 的核心创新，它将**工具 + 提示词 + 行为规则**打包为一个可复用的能力单元。

### 6.1 声明式技能

在插件中通过 PluginContext 注册技能定义：

```java
context.registerSkill(SkillDefinition.builder()
        .id("my-skill")
        .name("我的技能")
        .description("技能描述")
        .category("tool_use")            // 分类
        .toolIds(List.of("tool-a", "tool-b"))  // 依赖的工具
        .promptFragment(                  // 提示词片段（追加到 Agent 系统提示词）
                "你具备 XX 能力，可以：\n1. ...\n2. ...")
        .knowledgeBaseIds(List.of("kb-1")) // 关联知识库
        .guardrails(SkillDefinition.SkillGuardrails.builder()
                .inputGuardrailIds(List.of("guard-1"))
                .outputGuardrailIds(List.of("guard-2"))
                .build())
        .build());
```

### 6.2 编程式技能

实现 `Skill` 接口创建可执行技能：

```java
@Component
public class TranslationSkill implements Skill {

    @Override
    public SkillDefinition getDefinition() {
        return SkillDefinition.builder()
                .id("translation-skill")
                .name("翻译技能")
                .description("多语言翻译")
                .category("communication")
                .build();
    }

    @Override
    public String execute(Map<String, Object> input) {
        String text = (String) input.get("text");
        String targetLang = (String) input.getOrDefault("targetLang", "en");
        // 执行翻译逻辑
        return "翻译结果...";
    }
}
```

### 6.3 Agent 绑定技能

在 Agent 定义中通过 `skillIds` 绑定技能：

```json
{
  "id": "my-agent",
  "name": "多技能助手",
  "skillIds": ["web-search-skill", "code-analysis-skill", "translation-skill"],
  "toolIds": ["http-request-tool"],
  "model": { "provider": "openai", "modelName": "gpt-4o" }
}
```

当 Agent 注册时，框架会自动：

1. 合并所有技能的 `toolIds` 到 Agent 的工具列表
2. 将所有技能的 `promptFragment` 追加到 Agent 系统提示词
3. 合并技能关联的 `knowledgeBaseIds`

### 6.4 技能分类

| 分类              | 说明    | 示例            |
|-----------------|-------|---------------|
| `reasoning`     | 推理与分析 | 逻辑推理、问题分解     |
| `tool_use`      | 工具使用  | 搜索、数据库查询、文件操作 |
| `knowledge`     | 知识检索  | RAG 问答、文档分析   |
| `communication` | 通信交互  | 邮件发送、消息通知     |
| `coding`        | 编程能力  | 代码分析、代码生成     |
| `analysis`      | 数据分析  | 统计分析、趋势发现     |

---

## 7. 插件配置

### 7.1 定义默认配置

在 `getDescriptor()` 中定义插件的默认配置：

```java
@Override
public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
            .id("my-plugin")
            .name("My Plugin")
            .version("1.0.0")
            .config(Map.of(
                    "apiKey", "default-key",
                    "timeout", 30,
                    "retryCount", 3
            ))
            .build();
}
```

### 7.2 读取配置

在 `init()` 中通过 PluginContext 读取配置值：

```java
@Override
public void init(PluginContext context) {
    String apiKey = context.getConfig("apiKey", String.class);
    Integer timeout = context.getConfig("timeout", Integer.class);
    // ...
}
```

### 7.3 覆盖配置

通过 REST API 安装插件时可传入自定义配置（覆盖默认值）。

---

## 8. 完整示例

以下是一个完整的**数据库查询插件**实现，展示了工具 + 技能 + 护栏的组合使用：

```java
@Slf4j
public class DatabaseQueryPlugin implements AgentXPlugin {

    @Override
    public PluginDescriptor getDescriptor() {
        return PluginDescriptor.builder()
                .id("database-query-plugin")
                .name("数据库查询插件")
                .version("1.0.0")
                .description("安全的自然语言数据库查询")
                .author("Your Name")
                .extensionPoints(List.of("tool", "skill", "guardrail"))
                .config(Map.of(
                        "jdbcUrl", "jdbc:postgresql://localhost/demo",
                        "maxRows", 100,
                        "readOnly", true
                ))
                .build();
    }

    @Override
    public void init(PluginContext context) {
        String jdbcUrl = context.getConfig("jdbcUrl", String.class);
        Integer maxRows = context.getConfig("maxRows", Integer.class);

        // 1. 注册查询工具
        context.registerTool(ToolDescriptor.builder()
                .id("db-query-tool")
                .name("数据库查询")
                .description("执行只读 SQL，仅支持 SELECT")
                .category("database")
                .source(ToolDescriptor.ToolSource.SPI)
                .executor(params -> {
                    String sql = (String) params.getOrDefault("sql", "");
                    if (!sql.trim().toUpperCase().startsWith("SELECT")) {
                        return "{\"error\":\"仅支持 SELECT\"}";
                    }
                    // 执行查询...
                    return "{\"rows\":[]}";
                })
                .build());

        // 2. 注册 SQL 注入检测护栏
        context.registerInputGuardrail(new InputGuardrail() {
            @Override
            public String getId() { return "sql-injection-guard"; }

            @Override
            public GuardrailResult check(String input) {
                String upper = input.toUpperCase();
                if (upper.contains("DROP ") || upper.contains("DELETE ") ||
                    upper.contains("INSERT ") || upper.contains("UPDATE ")) {
                    return GuardrailResult.builder()
                            .passed(false)
                            .message("检测到危险 SQL 操作")
                            .build();
                }
                return GuardrailResult.builder().passed(true).build();
            }
        });

        // 3. 注册数据库查询技能
        context.registerSkill(SkillDefinition.builder()
                .id("db-query-skill")
                .name("数据库查询技能")
                .description("自然语言数据库查询")
                .category("tool_use")
                .toolIds(List.of("db-query-tool"))
                .promptFragment("你可以查询数据库。规则：\n" +
                        "1. 仅生成 SELECT 语句\n" +
                        "2. 限制返回 " + maxRows + " 行\n" +
                        "3. 敏感字段需脱敏")
                .guardrails(SkillDefinition.SkillGuardrails.builder()
                        .inputGuardrailIds(List.of("sql-injection-guard"))
                        .build())
                .build());

        log.info("DatabaseQueryPlugin initialized");
    }

    @Override
    public void start() {
        // 可在此建立数据库连接池
        log.info("DatabaseQueryPlugin started");
    }

    @Override
    public void stop() {
        // 释放数据库连接池
        log.info("DatabaseQueryPlugin stopped");
    }
}
```

---

## 9. 最佳实践

### 9.1 插件设计原则

1. **单一职责** — 每个插件聚焦一个场景或能力域
2. **配置外置** — 通过 `PluginDescriptor.config` 参数化，不要硬编码
3. **优雅降级** — 工具执行失败时返回友好的错误信息，不抛异常
4. **资源管理** — 在 `stop()` 中释放所有资源（连接池、线程、缓存）
5. **安全优先** — 工具执行逻辑中验证输入，防止注入攻击

### 9.2 工具描述写法

工具的 `description` 直接影响 LLM 调用决策，建议：

```
✅ 好的描述：
"查询指定城市的实时天气信息。参数：city（城市名称，如 '北京'）"

❌ 不好的描述：
"天气工具"
```

### 9.3 技能提示词片段写法

```
✅ 好的提示词片段：
"你具备数据库查询能力。可以将用户的自然语言问题转换为 SQL 查询。
规则：1) 仅生成 SELECT 语句 2) 查询限制 100 行 3) 敏感字段需脱敏"

❌ 不好的提示词片段：
"你能查数据库"
```

### 9.4 错误处理

```java
.executor(params -> {
    try {
        // 执行逻辑
        return "{\"result\": \"success\"}";
    } catch (Exception e) {
        log.error("Tool execution failed", e);
        return String.format("{\"error\":\"%s\"}", e.getMessage());
    }
})
```

### 9.5 插件之间的协作

插件之间可以通过工具 ID 引用彼此注册的工具。例如：

- 插件 A 注册了 `web-search-tool`
- 插件 B 的技能可以将 `web-search-tool` 加入其 `toolIds`

---

## 10. 常见问题

### Q: 插件注册的工具为什么 Agent 调用不到？

A: 检查以下几点：

1. Agent 定义的 `toolIds` 或 `skillIds` 中是否包含了该工具
2. 插件是否成功初始化（查看 `/api/v1/plugins/status`）
3. 工具的 `description` 是否清晰描述了功能

### Q: 如何在插件中访问 Spring Bean？

A: 将插件注册为 `@Component` 即可通过构造函数注入其他 Bean：

```java
@Component
@RequiredArgsConstructor
public class MyPlugin implements AgentXPlugin {
    private final SomeService someService;
    // ...
}
```

### Q: 插件可以依赖其他插件吗？

A: 目前不支持显式的插件依赖声明。但插件可以引用其他插件注册的工具 ID。建议通过 Spring Bean
的加载顺序（`@Order` 或 `@DependsOn`）控制初始化顺序。

### Q: 如何调试插件？

A:

1. 查看日志中的 `Plugin initialized` / `Plugin started` 消息
2. 通过 `/api/v1/plugins/status` 查看插件状态
3. 通过 `/api/v1/tools` 查看已注册的工具列表
4. 通过 `/api/v1/skills` 查看已注册的技能列表

### Q: 插件的配置如何从数据库加载？

A: 通过实现 `AgentXPlugin` 接口的 Spring Bean 方式注册，在 Bean
创建时从数据库加载配置并传入 `PluginDescriptor.config`。

---

## 附录：内置插件参考

| 插件                          | 场景    | 扩展点                    |
|-----------------------------|-------|------------------------|
| `weather-plugin`            | 天气查询  | tool                   |
| `database-query-plugin`     | 数据库查询 | tool, skill, guardrail |
| `email-notification-plugin` | 邮件通知  | tool, skill            |
| `file-operation-plugin`     | 文件操作  | tool, skill            |
| `customer-service-plugin`   | 智能客服  | tool, skill, guardrail |
| `search-engine-plugin`      | 搜索引擎  | tool, skill            |
| `content-generation-plugin` | 内容生成  | tool, skill            |

---

*AgentX Team — 让智能体开发更简单*
