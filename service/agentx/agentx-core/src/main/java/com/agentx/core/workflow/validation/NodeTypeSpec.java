package com.agentx.core.workflow.validation;

import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * 工作流 DSL 规范描述 — 描述一个节点类型的完整规范
 */
@Data
@Builder
public class NodeTypeSpec {

  /**
   * 节点类型名称
   */
  private String type;

  /**
   * 中文说明
   */
  private String description;

  /**
   * config 中的参数规范
   */
  private List<ParamSpec> configParams;

  /**
   * 是否支持 next 字段
   */
  @Builder.Default
  private boolean supportsNext = true;

  /**
   * 是否支持 retry
   */
  @Builder.Default
  private boolean supportsRetry = true;

  /**
   * 是否支持 timeout
   */
  @Builder.Default
  private boolean supportsTimeout = true;

  @Data
  @Builder
  public static class ParamSpec {

    private String name;
    private String type;
    private String description;
    private boolean required;
    private Object defaultValue;
  }
}
