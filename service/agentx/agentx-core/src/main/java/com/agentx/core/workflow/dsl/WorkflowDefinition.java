package com.agentx.core.workflow.dsl;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 工作流 DSL 顶层结构
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowDefinition {

  private String id;
  private String name;
  private String version;
  private String description;
  private TriggerConfig trigger;
  private Map<String, Object> variables;
  private WorkflowSettings settings;
  private List<NodeDefinition> nodes;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TriggerConfig {

    /**
     * MANUAL | WEBHOOK | CRON | MQ_EVENT | SAAS_EVENT
     */
    private String type;
    private Map<String, Object> config;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class WorkflowSettings {

    @Builder.Default
    private int maxExecutionSeconds = 600;
    private RetryPolicy retryPolicy;
    /**
     * STOP | CONTINUE | ROLLBACK
     */
    @Builder.Default
    private String onFailure = "STOP";
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class RetryPolicy {

    @Builder.Default
    private int maxRetries = 2;
    @Builder.Default
    private int backoffSeconds = 5;
  }
}
