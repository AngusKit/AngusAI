package cloud.xcan.core.workflow.dsl;

import cloud.xcan.core.workflow.enums.FailurePolicy;
import cloud.xcan.core.workflow.enums.TriggerType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 工作流 DSL 顶层结构
 */
@Schema(description = "工作流定义 — 对应 YAML/JSON 配置的顶层结构")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowDefinition {

  @Schema(description = "工作流唯一标识", example = "wf-001")
  private String id;

  @Schema(description = "工作流名称", example = "订单处理流程")
  private String name;

  @Schema(description = "版本号", example = "1.0.0")
  private String version;

  @Schema(description = "工作流描述")
  private String description;

  @Schema(description = "触发配置")
  private TriggerConfig trigger;

  @Schema(description = "全局变量，可在节点中通过 ${key} 引用")
  private Map<String, Object> variables;

  @Schema(description = "工作流级设置")
  private WorkflowSettings settings;

  @Schema(description = "节点列表，定义执行 DAG")
  private List<NodeDefinition> nodes;

  @Schema(description = "工作流触发配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TriggerConfig {

    @Schema(description = "触发类型：MANUAL | WEBHOOK | CRON | MQ_EVENT | SAAS_EVENT", example = "WEBHOOK")
    private TriggerType type;

    @Schema(description = "触发相关配置，如 path、cron 表达式等")
    private Map<String, Object> config;
  }

  @Schema(description = "工作流级设置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class WorkflowSettings {

    @Schema(description = "最大执行时长（秒）", example = "600")
    @Builder.Default
    private int maxExecutionSeconds = 600;

    @Schema(description = "全局重试策略")
    private RetryPolicy retryPolicy;

    @Schema(description = "节点失败时的全局策略：STOP | CONTINUE | ROLLBACK")
    @Builder.Default
    private FailurePolicy onFailure = FailurePolicy.STOP;
  }

  @Schema(description = "重试策略配置")
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class RetryPolicy {

    @Schema(description = "最大重试次数", example = "2")
    @Builder.Default
    private int maxRetries = 2;

    @Schema(description = "重试间隔（秒）", example = "5")
    @Builder.Default
    private int backoffSeconds = 5;
  }
}
