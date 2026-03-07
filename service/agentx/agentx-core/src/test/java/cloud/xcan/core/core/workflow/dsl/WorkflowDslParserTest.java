package cloud.xcan.core.core.workflow.dsl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cloud.xcan.core.workflow.dsl.NodeDefinition;
import cloud.xcan.core.workflow.dsl.WorkflowDefinition;
import cloud.xcan.core.workflow.dsl.WorkflowDslParser;
import cloud.xcan.core.workflow.enums.FailurePolicy;
import cloud.xcan.core.workflow.enums.FailureStrategy;
import cloud.xcan.core.workflow.enums.NodeType;
import cloud.xcan.core.workflow.enums.TriggerType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

/**
 * WorkflowDslParser 单元测试 — 覆盖 JSON/YAML 双格式解析、序列化、异常处理
 */
@DisplayName("WorkflowDslParser Tests")
class WorkflowDslParserTest {

  private WorkflowDslParser parser;

  @BeforeEach
  void setUp() {
    parser = new WorkflowDslParser();
  }

  // ==================== JSON 解析 ====================

  @Nested
  @DisplayName("JSON Parsing")
  class JsonParsing {

    @Test
    @DisplayName("解析简单 JSON 工作流")
    void parseSimpleJson() throws IOException {
      String json = """
          {
            "id": "wf-1",
            "name": "Test Workflow",
            "version": "1.0.0",
            "nodes": [
              {"id": "start", "type": "START", "next": "end"},
              {"id": "end", "type": "END"}
            ]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);

      assertEquals("wf-1", def.getId());
      assertEquals("Test Workflow", def.getName());
      assertEquals("1.0.0", def.getVersion());
      assertNotNull(def.getNodes());
      assertEquals(2, def.getNodes().size());
      assertEquals(NodeType.START, def.getNodes().get(0).getType());
      assertEquals("end", def.getNodes().get(0).getNext());
      assertEquals(NodeType.END, def.getNodes().get(1).getType());
    }

    @Test
    @DisplayName("解析带 workflow 包裹的 JSON")
    void parseJsonWithWorkflowWrapper() throws IOException {
      String json = """
          {
            "workflow": {
              "id": "wf-wrapped",
              "name": "Wrapped",
              "nodes": [
                {"id": "s", "type": "START"}
              ]
            }
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);

      assertEquals("wf-wrapped", def.getId());
      assertEquals("Wrapped", def.getName());
    }

    @Test
    @DisplayName("解析包含变量的 JSON")
    void parseJsonWithVariables() throws IOException {
      String json = """
          {
            "id": "wf-vars",
            "name": "Variables WF",
            "variables": {"key1": "value1", "key2": 42},
            "nodes": [{"id": "s", "type": "START"}]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);

      assertNotNull(def.getVariables());
      assertEquals("value1", def.getVariables().get("key1"));
      assertEquals(42, def.getVariables().get("key2"));
    }

    @Test
    @DisplayName("解析包含完整配置的 JSON")
    void parseJsonWithFullConfig() throws IOException {
      String json = """
          {
            "id": "wf-full",
            "name": "Full Config",
            "version": "2.0.0",
            "description": "Full config workflow",
            "trigger": {"type": "WEBHOOK", "config": {"path": "/hook"}},
            "settings": {
              "maxExecutionSeconds": 300,
              "onFailure": "CONTINUE",
              "retryPolicy": {"maxRetries": 3, "backoffSeconds": 10}
            },
            "nodes": [
              {"id": "s", "type": "START", "next": "e"},
              {"id": "e", "type": "END"}
            ]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);

      assertEquals("Full config workflow", def.getDescription());
      assertNotNull(def.getTrigger());
      assertEquals(TriggerType.WEBHOOK, def.getTrigger().getType());
      assertNotNull(def.getSettings());
      assertEquals(300, def.getSettings().getMaxExecutionSeconds());
      assertEquals(FailurePolicy.CONTINUE, def.getSettings().getOnFailure());
      assertNotNull(def.getSettings().getRetryPolicy());
      assertEquals(3, def.getSettings().getRetryPolicy().getMaxRetries());
    }

    @Test
    @DisplayName("解析包含节点配置的 JSON")
    void parseJsonWithNodeConfig() throws IOException {
      String json = """
          {
            "id": "wf-node-cfg",
            "name": "Node Config",
            "nodes": [
              {
                "id": "llm-node",
                "type": "LLM",
                "config": {"systemPrompt": "Hello", "userPrompt": "World"},
                "outputs": {"text": "response"},
                "next": "end",
                "timeout": 30,
                "retry": {"maxRetries": 2, "backoffSeconds": 3}
              },
              {"id": "end", "type": "END"}
            ]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);

      NodeDefinition llmNode = def.getNodes().get(0);
      assertEquals(NodeType.LLM, llmNode.getType());
      assertNotNull(llmNode.getConfig());
      assertEquals("Hello", llmNode.getConfig().get("systemPrompt"));
      assertEquals("end", llmNode.getNext());
      assertEquals(30, llmNode.getTimeout());
      assertNotNull(llmNode.getRetry());
      assertEquals(2, llmNode.getRetry().getMaxRetries());
      assertNotNull(llmNode.getOutputs());
    }

    @Test
    @DisplayName("解析 JSON 无效格式抛出异常")
    void parseInvalidJson() {
      assertThrows(IOException.class, () -> parser.parseJson("not valid json"));
    }

    @Test
    @DisplayName("解析空 JSON 对象")
    void parseEmptyJson() throws IOException {
      WorkflowDefinition def = parser.parseJson("{}");
      assertNull(def.getId());
      assertNull(def.getNodes());
    }
  }

  // ==================== YAML 解析 ====================

  @Nested
  @DisplayName("YAML Parsing")
  class YamlParsing {

    @Test
    @DisplayName("解析简单 YAML 工作流")
    void parseSimpleYaml() throws IOException {
      String yaml = """
          id: "wf-yaml"
          name: "YAML Workflow"
          version: "1.0.0"
          nodes:
            - id: "start"
              type: "START"
              next: "end"
            - id: "end"
              type: "END"
          """;

      WorkflowDefinition def = parser.parseYaml(yaml);

      assertEquals("wf-yaml", def.getId());
      assertEquals("YAML Workflow", def.getName());
      assertEquals(2, def.getNodes().size());
    }

    @Test
    @DisplayName("解析带 workflow 包裹的 YAML")
    void parseYamlWithWrapper() throws IOException {
      String yaml = """
          workflow:
            id: "wf-yaml-wrap"
            name: "Wrapped YAML"
            nodes:
              - id: "s"
                type: "START"
          """;

      WorkflowDefinition def = parser.parseYaml(yaml);

      assertEquals("wf-yaml-wrap", def.getId());
    }

    @Test
    @DisplayName("解析复杂 YAML 工作流")
    void parseComplexYaml() throws IOException {
      String yaml = """
          id: "wf-complex"
          name: "Complex YAML"
          variables:
            threshold: 80
            items:
              - "a"
              - "b"
          settings:
            maxExecutionSeconds: 600
            onFailure: "CONTINUE"
          nodes:
            - id: "start"
              type: "START"
              next: "cond"
            - id: "cond"
              type: "CONDITION"
              config:
                expression: "#variables['threshold'] > 50"
                ifTrue: "parallel"
                ifFalse: "end"
            - id: "parallel"
              type: "PARALLEL"
              config:
                branches:
                  - "branch1"
                  - "branch2"
                waitAll: true
              next: "end"
            - id: "branch1"
              type: "SET_VARIABLE"
              config:
                assignments:
                  - name: "b1"
                    value: "done1"
            - id: "branch2"
              type: "SET_VARIABLE"
              config:
                assignments:
                  - name: "b2"
                    value: "done2"
            - id: "end"
              type: "END"
          """;

      WorkflowDefinition def = parser.parseYaml(yaml);

      assertEquals("wf-complex", def.getId());
      assertEquals(6, def.getNodes().size());
      assertNotNull(def.getSettings());
      assertEquals(FailurePolicy.CONTINUE, def.getSettings().getOnFailure());

      // Verify CONDITION node config
      NodeDefinition cond = def.getNodes().get(1);
      assertEquals(NodeType.CONDITION, cond.getType());
      assertNotNull(cond.getConfig());
      assertEquals("parallel", cond.getConfig().get("ifTrue"));
    }

    @Test
    @DisplayName("解析包含所有节点类型的 YAML")
    void parseAllNodeTypes() throws IOException {
      String yaml = """
          id: "wf-all-types"
          name: "All Node Types"
          nodes:
            - id: "n1"
              type: "START"
              next: "n2"
            - id: "n2"
              type: "LLM"
              config:
                systemPrompt: "sys"
                userPrompt: "user"
              next: "n3"
            - id: "n3"
              type: "AGENT"
              config:
                agentId: "agent-1"
                input: "hello"
              next: "n4"
            - id: "n4"
              type: "TOOL"
              config:
                toolId: "tool-1"
                params:
                  key: "value"
              next: "n5"
            - id: "n5"
              type: "HTTP"
              config:
                url: "https://api.example.com"
                method: "GET"
              next: "n6"
            - id: "n6"
              type: "CODE"
              config:
                language: "javascript"
                code: "return 1;"
              next: "n7"
            - id: "n7"
              type: "CONDITION"
              config:
                expression: "true"
                ifTrue: "n8"
                ifFalse: "n9"
            - id: "n8"
              type: "SWITCH"
              config:
                expression: "case1"
                cases:
                  - value: "case1"
                    next: "n9"
                default: "n9"
              next: "n9"
            - id: "n9"
              type: "LOOP"
              config:
                collection:
                  - 1
                  - 2
                iterator: "item"
              next: "n10"
            - id: "n10"
              type: "WHILE"
              config:
                condition: "false"
                maxIterations: 10
              next: "n11"
            - id: "n11"
              type: "PARALLEL"
              config:
                branches:
                  - "n12"
                waitAll: true
              next: "n13"
            - id: "n12"
              type: "WAIT"
              config:
                waitType: "APPROVAL"
                timeout: 60
            - id: "n13"
              type: "SUB_WORKFLOW"
              config:
                workflowId: "sub-wf-1"
              next: "n14"
            - id: "n14"
              type: "SET_VARIABLE"
              config:
                assignments:
                  - name: "x"
                    value: "y"
              next: "n15"
            - id: "n15"
              type: "KNOWLEDGE_RETRIEVAL"
              config:
                query: "test query"
                topK: 3
              next: "n16"
            - id: "n16"
              type: "END"
          """;

      WorkflowDefinition def = parser.parseYaml(yaml);

      assertEquals(16, def.getNodes().size());

      List<String> expectedTypes = List.of(
          NodeType.START.name(), NodeType.LLM.name(), NodeType.AGENT.name(), NodeType.TOOL.name(),
          NodeType.HTTP.name(), NodeType.CODE.name(), NodeType.CONDITION.name(),
          NodeType.SWITCH.name(),
          NodeType.LOOP.name(), NodeType.WHILE.name(), NodeType.PARALLEL.name(),
          NodeType.WAIT.name(), NodeType.SUB_WORKFLOW.name(), NodeType.SET_VARIABLE.name(),
          NodeType.KNOWLEDGE_RETRIEVAL.name(), NodeType.END.name()
      );

      for (int i = 0; i < expectedTypes.size(); i++) {
        assertEquals(expectedTypes.get(i), def.getNodes().get(i).getType().name(),
            "Mismatch at node index " + i);
      }
    }

    @Test
    @DisplayName("解析 YAML 无效格式抛出异常")
    void parseInvalidYaml() {
      assertThrows(IOException.class, () -> parser.parseYaml(":::invalid::yaml:::"));
    }
  }

  // ==================== 文件解析 ====================

  @Nested
  @DisplayName("File Parsing")
  class FileParsing {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("解析 YAML 文件 (.yaml)")
    void parseYamlFile() throws IOException {
      Path yamlFile = tempDir.resolve("test.yaml");
      Files.writeString(yamlFile, """
          id: "file-wf"
          name: "File Workflow"
          nodes:
            - id: "s"
              type: "START"
          """);

      WorkflowDefinition def = parser.parseFile(yamlFile);
      assertEquals("file-wf", def.getId());
    }

    @Test
    @DisplayName("解析 YML 文件 (.yml)")
    void parseYmlFile() throws IOException {
      Path ymlFile = tempDir.resolve("test.yml");
      Files.writeString(ymlFile, """
          id: "yml-wf"
          name: "YML Workflow"
          nodes:
            - id: "s"
              type: "START"
          """);

      WorkflowDefinition def = parser.parseFile(ymlFile);
      assertEquals("yml-wf", def.getId());
    }

    @Test
    @DisplayName("解析 JSON 文件 (.json)")
    void parseJsonFile() throws IOException {
      Path jsonFile = tempDir.resolve("test.json");
      Files.writeString(jsonFile, """
          {
            "id": "json-file-wf",
            "name": "JSON File Workflow",
            "nodes": [{"id": "s", "type": "START"}]
          }
          """);

      WorkflowDefinition def = parser.parseFile(jsonFile);
      assertEquals("json-file-wf", def.getId());
    }

    @Test
    @DisplayName("解析不存在的文件抛出异常")
    void parseNonExistentFile() {
      Path nonExistent = tempDir.resolve("non-existent.yaml");
      assertThrows(IOException.class, () -> parser.parseFile(nonExistent));
    }

    @Test
    @DisplayName("解析带 workflow 包裹的 YAML 文件")
    void parseWrappedYamlFile() throws IOException {
      Path yamlFile = tempDir.resolve("wrapped.yaml");
      Files.writeString(yamlFile, """
          workflow:
            id: "wrapped-file"
            name: "Wrapped"
            nodes:
              - id: "s"
                type: "START"
          """);

      WorkflowDefinition def = parser.parseFile(yamlFile);
      assertEquals("wrapped-file", def.getId());
    }
  }

  // ==================== 序列化 ====================

  @Nested
  @DisplayName("Serialization")
  class Serialization {

    @Test
    @DisplayName("序列化为 JSON 并反序列化")
    void roundTripJson() throws IOException {
      WorkflowDefinition original = WorkflowDefinition.builder()
          .id("rt-json")
          .name("Round Trip")
          .version("1.0.0")
          .nodes(List.of(
              NodeDefinition.builder().id("s").type(NodeType.START).next("e").build(),
              NodeDefinition.builder().id("e").type(NodeType.END).build()
          ))
          .build();

      String json = parser.toJson(original);
      assertNotNull(json);
      assertTrue(json.contains("rt-json"));

      WorkflowDefinition restored = parser.parseJson(json);
      assertEquals("rt-json", restored.getId());
      assertEquals(2, restored.getNodes().size());
    }

    @Test
    @DisplayName("序列化为 YAML 并反序列化")
    void roundTripYaml() throws IOException {
      WorkflowDefinition original = WorkflowDefinition.builder()
          .id("rt-yaml")
          .name("YAML Round Trip")
          .nodes(List.of(
              NodeDefinition.builder().id("s").type(NodeType.START).build()
          ))
          .build();

      String yaml = parser.toYaml(original);
      assertNotNull(yaml);
      assertTrue(yaml.contains("rt-yaml"));

      WorkflowDefinition restored = parser.parseYaml(yaml);
      assertEquals("rt-yaml", restored.getId());
    }

    @Test
    @DisplayName("序列化包含变量和设置的工作流")
    void serializeWithVariablesAndSettings() throws IOException {
      WorkflowDefinition original = WorkflowDefinition.builder()
          .id("full-serial")
          .name("Full")
          .variables(Map.of("key", "value"))
          .settings(WorkflowDefinition.WorkflowSettings.builder()
              .maxExecutionSeconds(120)
              .onFailure(FailurePolicy.CONTINUE)
              .retryPolicy(WorkflowDefinition.RetryPolicy.builder()
                  .maxRetries(5).backoffSeconds(10).build())
              .build())
          .nodes(List.of(NodeDefinition.builder().id("s").type(NodeType.START).build()))
          .build();

      String json = parser.toJson(original);
      assertTrue(json.contains("full-serial"));
      assertTrue(json.contains("CONTINUE"));

      WorkflowDefinition restored = parser.parseJson(json);
      assertEquals(FailurePolicy.CONTINUE, restored.getSettings().getOnFailure());
      assertEquals(5, restored.getSettings().getRetryPolicy().getMaxRetries());
    }
  }

  // ==================== 边界情况 ====================

  @Nested
  @DisplayName("Edge Cases")
  class EdgeCases {

    @Test
    @DisplayName("解析节点包含失败处理策略")
    void parseNodeWithFailureHandler() throws IOException {
      String json = """
          {
            "id": "wf-fh",
            "nodes": [
              {
                "id": "n1",
                "type": "HTTP",
                "config": {"url": "http://example.com"},
                "onFailure": {"strategy": "GOTO", "gotoNode": "fallback"},
                "onTimeout": {"strategy": "SKIP"}
              }
            ]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);
      NodeDefinition node = def.getNodes().get(0);

      assertNotNull(node.getOnFailure());
      assertEquals(FailureStrategy.GOTO, node.getOnFailure().getStrategy());
      assertEquals("fallback", node.getOnFailure().getGotoNode());
      assertNotNull(node.getOnTimeout());
      assertEquals(FailureStrategy.SKIP, node.getOnTimeout().getStrategy());
    }

    @Test
    @DisplayName("解析节点包含重试配置")
    void parseNodeWithRetry() throws IOException {
      String json = """
          {
            "id": "wf-retry",
            "nodes": [
              {
                "id": "n1",
                "type": "HTTP",
                "config": {"url": "http://example.com"},
                "retry": {
                  "maxRetries": 5,
                  "backoffSeconds": 10,
                  "retryOn": ["TimeoutException", "IOException"]
                }
              }
            ]
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);
      NodeDefinition node = def.getNodes().get(0);

      assertNotNull(node.getRetry());
      assertEquals(5, node.getRetry().getMaxRetries());
      assertEquals(10, node.getRetry().getBackoffSeconds());
      assertNotNull(node.getRetry().getRetryOn());
      assertEquals(2, node.getRetry().getRetryOn().size());
    }

    @Test
    @DisplayName("解析触发器配置")
    void parseTriggerConfig() throws IOException {
      String yaml = """
          id: "wf-trigger"
          trigger:
            type: "CRON"
            config:
              schedule: "0 0 * * *"
          nodes:
            - id: "s"
              type: "START"
          """;

      WorkflowDefinition def = parser.parseYaml(yaml);
      assertNotNull(def.getTrigger());
      assertEquals(TriggerType.CRON, def.getTrigger().getType());
      assertEquals("0 0 * * *", def.getTrigger().getConfig().get("schedule"));
    }

    @Test
    @DisplayName("解析空节点列表")
    void parseEmptyNodeList() throws IOException {
      String json = """
          {
            "id": "empty-nodes",
            "nodes": []
          }
          """;

      WorkflowDefinition def = parser.parseJson(json);
      assertNotNull(def.getNodes());
      assertTrue(def.getNodes().isEmpty());
    }
  }
}
