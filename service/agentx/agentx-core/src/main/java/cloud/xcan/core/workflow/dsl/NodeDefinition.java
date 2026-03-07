package cloud.xcan.core.workflow.dsl;

import cloud.xcan.core.workflow.enums.FailureStrategy;
import cloud.xcan.core.workflow.enums.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 工作流节点定义
 */
@Schema(description = "工作流节点定义 — 对应 YAML/JSON 中的单个节点")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NodeDefinition {

  @Schema(description = "节点唯一标识", example = "start")
  private String id;

  @Schema(description = "节点类型：START | END | LLM | AGENT | TOOL | HTTP | CODE | CONDITION | SWITCH | LOOP | WHILE | PARALLEL | WAIT | SUB_WORKFLOW | SET_VARIABLE | KNOWLEDGE_RETRIEVAL")
  private NodeType type;

  @Schema(description = "节点特定配置，如 HTTP 的 url、LLM 的 prompt 等")
  private Map<String, Object> config;

  @Schema(description = "输出映射，将节点输出映射到变量名")
  private Map<String, String> outputs;

  @Schema(description = "下一个节点 ID，用于线性流程")
  private String next;

  @Schema(description = "重试策略配置")
  private RetryConfig retry;

  @Schema(description = "超时（秒）")
  private Integer timeout;

  @Schema(description = "失败处理策略")
  private FailureHandler onFailure;

  @Schema(description = "超时处理策略")
  private FailureHandler onTimeout;

  @Schema(description = "节点重试策略配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class RetryConfig {

    @Schema(description = "最大重试次数", example = "3")
    @Builder.Default
    private int maxRetries = 3;

    @Schema(description = "重试间隔（秒）", example = "5")
    @Builder.Default
    private int backoffSeconds = 5;

    @Schema(description = "触发重试的异常类型列表")
    private List<String> retryOn;
  }

  @Schema(description = "节点失败/超时处理配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class FailureHandler {

    @Schema(description = "处理策略：STOP | SKIP | FALLBACK | GOTO")
    private FailureStrategy strategy;

    @Schema(description = "FALLBACK 策略时的备用节点 ID")
    private String fallbackNode;

    @Schema(description = "GOTO 策略时的目标节点 ID")
    private String gotoNode;
  }
}
