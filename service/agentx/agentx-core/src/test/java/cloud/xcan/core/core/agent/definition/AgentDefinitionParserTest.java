package cloud.xcan.core.core.agent.definition;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.agent.definition.AgentDefinitionParser;
import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.agentx.core.model.ModelProvider;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * AgentDefinitionParser 单元测试 — 覆盖所有 Agent 类型的 JSON/YAML 解析和序列化
 */
@DisplayName("AgentDefinitionParser Tests")
class AgentDefinitionParserTest {

  private AgentDefinitionParser parser;

  @BeforeEach
  void setUp() {
    parser = new AgentDefinitionParser();
  }

  // ==================== JSON 解析 ====================

  @Nested
  @DisplayName("JSON Parsing")
  class JsonParsing {

    @Test
    @DisplayName("解析最简 Agent JSON")
    void parseMinimalJson() throws IOException {
      String json = """
          {
            "id": "agent-1",
            "name": "Simple Agent"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals("agent-1", def.getId());
      assertEquals("Simple Agent", def.getName());
      // Defaults
      assertEquals(InteractionMode.CHATBOT, def.getInteractionMode());
      assertEquals(ReasoningStrategy.FUNCTION_CALLING, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.ASSISTANT, def.getAutonomyLevel());
    }

    @Test
    @DisplayName("解析完整 Agent JSON — CHATBOT 类型")
    void parseChatbotAgent() throws IOException {
      String json = """
          {
            "id": "chatbot-1",
            "name": "Chatbot Agent",
            "description": "A chatbot",
            "version": "1.0.0",
            "interactionMode": "CHATBOT",
            "reasoningStrategy": "FUNCTION_CALLING",
            "autonomyLevel": "ASSISTANT",
            "model": {
              "provider": "openai",
              "modelName": "gpt-4",
              "temperature": 0.7,
              "maxTokens": 4096
            },
            "systemPrompt": "You are helpful.",
            "welcomeMessage": "Hello!",
            "suggestedQuestions": ["What can you do?"],
            "toolIds": ["tool-1", "tool-2"],
            "skillIds": ["skill-1"],
            "memory": {
              "strategy": "SLIDING_WINDOW",
              "windowSize": 20
            },
            "guardrails": {
              "inputGuardrailIds": ["length-limit"],
              "outputGuardrailIds": ["sensitive-filter"]
            }
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals("chatbot-1", def.getId());
      assertEquals(InteractionMode.CHATBOT, def.getInteractionMode());
      assertEquals(ReasoningStrategy.FUNCTION_CALLING, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.ASSISTANT, def.getAutonomyLevel());
      assertNotNull(def.getModel());
      assertEquals(ModelProvider.OPEN_AI, def.getModel().getProvider());
      assertEquals("gpt-4", def.getModel().getModelName());
      assertEquals(0.7, def.getModel().getTemperature());
      assertEquals("You are helpful.", def.getSystemPrompt());
      assertEquals("Hello!", def.getWelcomeMessage());
      assertEquals(1, def.getSuggestedQuestions().size());
      assertEquals(2, def.getToolIds().size());
      assertEquals(1, def.getSkillIds().size());
      assertNotNull(def.getMemory());
      assertEquals(MemoryStrategy.MESSAGE_WINDOW, def.getMemory().getStrategy());
      assertNotNull(def.getGuardrails());
      assertEquals(1, def.getGuardrails().getInputGuardrailIds().size());
    }

    @Test
    @DisplayName("解析 COMPLETION 类型 Agent")
    void parseCompletionAgent() throws IOException {
      String json = """
          {
            "id": "completion-1",
            "name": "Completion Agent",
            "interactionMode": "COMPLETION",
            "reasoningStrategy": "SIMPLE_LLM",
            "autonomyLevel": "TOOL"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(InteractionMode.COMPLETION, def.getInteractionMode());
      assertEquals(ReasoningStrategy.SIMPLE_LLM, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.TOOL, def.getAutonomyLevel());
    }

    @Test
    @DisplayName("解析 WORKFLOW 类型 Agent")
    void parseWorkflowAgent() throws IOException {
      String json = """
          {
            "id": "workflow-1",
            "name": "Workflow Agent",
            "interactionMode": "WORKFLOW",
            "reasoningStrategy": "PLAN_AND_EXECUTE"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(InteractionMode.WORKFLOW, def.getInteractionMode());
      assertEquals(ReasoningStrategy.PLAN_AND_EXECUTE, def.getReasoningStrategy());
    }

    @Test
    @DisplayName("解析 AGENT_AS_API 类型 Agent")
    void parseApiAgent() throws IOException {
      String json = """
          {
            "id": "api-1",
            "name": "API Agent",
            "interactionMode": "AGENT_AS_API",
            "reasoningStrategy": "REACT"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(InteractionMode.AGENT_AS_API, def.getInteractionMode());
      assertEquals(ReasoningStrategy.REACT, def.getReasoningStrategy());
    }

    @Test
    @DisplayName("解析 MULTI_TURN_TASK 类型 Agent")
    void parseMultiTurnTaskAgent() throws IOException {
      String json = """
          {
            "id": "task-1",
            "name": "Task Agent",
            "interactionMode": "MULTI_TURN_TASK",
            "reasoningStrategy": "PLAN_AND_EXECUTE",
            "autonomyLevel": "DELEGATE"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(InteractionMode.MULTI_TURN_TASK, def.getInteractionMode());
      assertEquals(AutonomyLevel.DELEGATE, def.getAutonomyLevel());
    }

    @Test
    @DisplayName("解析 MULTI_AGENT 推理策略")
    void parseMultiAgentStrategy() throws IOException {
      String json = """
          {
            "id": "multi-1",
            "name": "Multi Agent",
            "reasoningStrategy": "MULTI_AGENT",
            "autonomyLevel": "AUTONOMOUS"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(ReasoningStrategy.MULTI_AGENT, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.AUTONOMOUS, def.getAutonomyLevel());
    }

    @Test
    @DisplayName("解析 COLLABORATOR 自治等级")
    void parseCollaboratorLevel() throws IOException {
      String json = """
          {
            "id": "collab-1",
            "name": "Collaborator",
            "autonomyLevel": "COLLABORATOR"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(AutonomyLevel.COLLABORATOR, def.getAutonomyLevel());
    }

    @Test
    @DisplayName("解析模型 fallback 配置")
    void parseModelFallback() throws IOException {
      String json = """
          {
            "id": "fb-1",
            "name": "Fallback",
            "model": {
              "provider": "openai",
              "modelName": "gpt-4",
              "fallbackProvider": "anthropic",
              "fallbackModelName": "claude-3"
            }
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(ModelProvider.ANTHROPIC, def.getModel().getFallbackProvider());
      assertEquals("claude-3", def.getModel().getFallbackModelName());
    }

    @Test
    @DisplayName("解析知识库和发布渠道配置")
    void parseKnowledgeAndChannels() throws IOException {
      String json = """
          {
            "id": "kb-1",
            "name": "KB Agent",
            "knowledgeBaseIds": ["kb-001", "kb-002"],
            "publishChannels": ["web", "api", "slack"],
            "tenantId": "tenant-123"
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(2, def.getKnowledgeBaseIds().size());
      assertEquals(3, def.getPublishChannels().size());
      assertEquals("tenant-123", def.getTenantId());
    }

    @Test
    @DisplayName("解析变量映射")
    void parseVariables() throws IOException {
      String json = """
          {
            "id": "var-1",
            "name": "Var Agent",
            "variables": {
              "language": "zh-CN",
              "maxRetries": "3"
            }
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertNotNull(def.getVariables());
      assertEquals("zh-CN", def.getVariables().get("language"));
    }

    @Test
    @DisplayName("解析记忆策略 — TOKEN_WINDOW")
    void parseTokenWindowMemory() throws IOException {
      String json = """
          {
            "id": "mem-1",
            "name": "Token Window",
            "memory": {"strategy": "TOKEN_WINDOW", "maxTokens": 16000}
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(MemoryStrategy.TOKEN_WINDOW, def.getMemory().getStrategy());
      assertEquals(16000, def.getMemory().getMaxTokens());
    }

    @Test
    @DisplayName("解析记忆策略 — PERSISTENT")
    void parsePersistentMemory() throws IOException {
      String json = """
          {
            "id": "mem-2",
            "name": "Persistent",
            "memory": {"strategy": "PERSISTENT", "windowSize": 50}
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(MemoryStrategy.MESSAGE_WINDOW, def.getMemory().getStrategy());
      assertEquals(50, def.getMemory().getWindowSize());
    }

    @Test
    @DisplayName("解析记忆策略 — NONE")
    void parseNoneMemory() throws IOException {
      String json = """
          {
            "id": "mem-3",
            "name": "No Memory",
            "memory": {"strategy": "NONE"}
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(MemoryStrategy.NONE, def.getMemory().getStrategy());
    }

    @Test
    @DisplayName("解析未知策略 — 映射为 TOKEN_WINDOW")
    void parseUnknownMemoryStrategy() throws IOException {
      String json = """
          {
            "id": "mem-unknown",
            "name": "Unknown",
            "memory": {"strategy": "UNKNOWN_STRATEGY"}
          }
          """;

      AgentDefinition def = parser.parseJson(json);

      assertEquals(MemoryStrategy.TOKEN_WINDOW, def.getMemory().getStrategy());
    }

    @Test
    @DisplayName("解析无效 JSON 抛出异常")
    void parseInvalidJson() {
      assertThrows(IOException.class, () -> parser.parseJson("invalid json"));
    }
  }

  // ==================== YAML 解析 ====================

  @Nested
  @DisplayName("YAML Parsing")
  class YamlParsing {

    @Test
    @DisplayName("解析 YAML Agent")
    void parseYamlAgent() throws IOException {
      String yaml = """
          id: "yaml-agent"
          name: "YAML Agent"
          description: "An agent defined in YAML"
          interactionMode: "CHATBOT"
          reasoningStrategy: "REACT"
          autonomyLevel: "COLLABORATOR"
          model:
            provider: "anthropic"
            modelName: "claude-3"
            temperature: 0.5
          systemPrompt: "You are a YAML agent."
          toolIds:
            - "tool-a"
            - "tool-b"
          memory:
            strategy: "SUMMARY"
            windowSize: 10
          """;

      AgentDefinition def = parser.parseYaml(yaml);

      assertEquals("yaml-agent", def.getId());
      assertEquals(InteractionMode.CHATBOT, def.getInteractionMode());
      assertEquals(ReasoningStrategy.REACT, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.COLLABORATOR, def.getAutonomyLevel());
      assertEquals(ModelProvider.ANTHROPIC, def.getModel().getProvider());
      assertEquals(MemoryStrategy.SUMMARY, def.getMemory().getStrategy());
      assertEquals(2, def.getToolIds().size());
    }

    @Test
    @DisplayName("解析无效 YAML 抛出异常")
    void parseInvalidYaml() {
      assertThrows(IOException.class, () -> parser.parseYaml(":::invalid:::"));
    }
  }

  // ==================== 文件解析 ====================

  @Nested
  @DisplayName("File Parsing")
  class FileParsing {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("解析 YAML 文件")
    void parseYamlFile() throws IOException {
      Path file = tempDir.resolve("agent.yaml");
      Files.writeString(file, """
          id: "file-agent"
          name: "File Agent"
          interactionMode: "COMPLETION"
          """);

      AgentDefinition def = parser.parseFile(file);

      assertEquals("file-agent", def.getId());
      assertEquals(InteractionMode.COMPLETION, def.getInteractionMode());
    }

    @Test
    @DisplayName("解析 JSON 文件")
    void parseJsonFile() throws IOException {
      Path file = tempDir.resolve("agent.json");
      Files.writeString(file, """
          {"id": "json-file", "name": "JSON File Agent"}
          """);

      AgentDefinition def = parser.parseFile(file);

      assertEquals("json-file", def.getId());
    }

    @Test
    @DisplayName("解析 YML 文件")
    void parseYmlFile() throws IOException {
      Path file = tempDir.resolve("agent.yml");
      Files.writeString(file, """
          id: "yml-agent"
          name: "YML Agent"
          """);

      AgentDefinition def = parser.parseFile(file);

      assertEquals("yml-agent", def.getId());
    }
  }

  // ==================== 序列化 ====================

  @Nested
  @DisplayName("Serialization")
  class Serialization {

    @Test
    @DisplayName("JSON 序列化往返")
    void jsonRoundTrip() throws IOException {
      AgentDefinition original = AgentDefinition.builder()
          .id("rt-1")
          .name("Round Trip")
          .interactionMode(InteractionMode.CHATBOT)
          .reasoningStrategy(ReasoningStrategy.FUNCTION_CALLING)
          .autonomyLevel(AutonomyLevel.ASSISTANT)
          .model(AgentDefinition.ModelConfig.builder()
              .provider(ModelProvider.OPEN_AI).modelName("gpt-4").build())
          .systemPrompt("Hello")
          .toolIds(List.of("tool-1"))
          .memory(AgentDefinition.MemoryConfig.builder()
              .strategy(MemoryStrategy.MESSAGE_WINDOW).windowSize(20).build())
          .build();

      String json = parser.toJson(original);
      assertNotNull(json);
      assertTrue(json.contains("rt-1"));

      AgentDefinition restored = parser.parseJson(json);
      assertEquals("rt-1", restored.getId());
      assertEquals(InteractionMode.CHATBOT, restored.getInteractionMode());
      assertEquals(ModelProvider.OPEN_AI, restored.getModel().getProvider());
    }

    @Test
    @DisplayName("YAML 序列化往返")
    void yamlRoundTrip() throws IOException {
      AgentDefinition original = AgentDefinition.builder()
          .id("rt-2")
          .name("YAML RT")
          .reasoningStrategy(ReasoningStrategy.REACT)
          .build();

      String yaml = parser.toYaml(original);
      assertNotNull(yaml);

      AgentDefinition restored = parser.parseYaml(yaml);
      assertEquals("rt-2", restored.getId());
      assertEquals(ReasoningStrategy.REACT, restored.getReasoningStrategy());
    }
  }

  // ==================== 默认值验证 ====================

  @Nested
  @DisplayName("Default Values")
  class DefaultValues {

    @Test
    @DisplayName("ModelConfig 默认值")
    void modelConfigDefaults() {
      AgentDefinition.ModelConfig config = AgentDefinition.ModelConfig.builder().build();
      assertEquals(0.7, config.getTemperature());
      assertEquals(4096, config.getMaxTokens());
    }

    @Test
    @DisplayName("MemoryConfig 默认值")
    void memoryConfigDefaults() {
      AgentDefinition.MemoryConfig config = AgentDefinition.MemoryConfig.builder().build();
      assertEquals(MemoryStrategy.TOKEN_WINDOW, config.getStrategy());
      assertEquals(20, config.getWindowSize());
      assertEquals(8000, config.getMaxTokens());
    }

    @Test
    @DisplayName("AgentDefinition 默认值")
    void agentDefinitionDefaults() {
      AgentDefinition def = AgentDefinition.builder()
          .id("def-1").name("Defaults").build();
      assertEquals(InteractionMode.CHATBOT, def.getInteractionMode());
      assertEquals(ReasoningStrategy.FUNCTION_CALLING, def.getReasoningStrategy());
      assertEquals(AutonomyLevel.ASSISTANT, def.getAutonomyLevel());
    }
  }
}
