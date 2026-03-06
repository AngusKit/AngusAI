package com.agentx.core.workflow.dsl;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 工作流节点定义
 */
@Data
@Builder
public class NodeDefinition {

  private String id;

  /**
   * START | END | LLM | AGENT | TOOL | HTTP | CODE | CONDITION | SWITCH | LOOP | WHILE | PARALLEL |
   * WAIT | SUB_WORKFLOW | SET_VARIABLE | KNOWLEDGE_RETRIEVAL
   */
  private String type;

  /**
   * 节点特定配置
   */
  private Map<String, Object> config;

  /**
   * 输出映射
   */
  private Map<String, String> outputs;

  /**
   * 下一个节点 ID
   */
  private String next;

  /**
   * 重试策略
   */
  private RetryConfig retry;

  /**
   * 超时（秒）
   */
  private Integer timeout;

  /**
   * 失败处理策略
   */
  private FailureHandler onFailure;

  /**
   * 超时处理策略
   */
  private FailureHandler onTimeout;

  @Data
  @Builder
  public static class RetryConfig {

    @Builder.Default
    private int maxRetries = 3;
    @Builder.Default
    private int backoffSeconds = 5;
    private List<String> retryOn;
  }

  @Data
  @Builder
  public static class FailureHandler {

    /**
     * STOP | SKIP | FALLBACK | GOTO
     */
    private String strategy;
    private String fallbackNode;
    private String gotoNode;
  }
}
