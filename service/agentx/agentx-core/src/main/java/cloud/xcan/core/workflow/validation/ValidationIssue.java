package cloud.xcan.core.workflow.validation;

import lombok.Builder;
import lombok.Data;

/**
 * 工作流验证结果中的单条问题
 */
@Data
@Builder
public class ValidationIssue {

  public enum Severity {ERROR, WARNING, INFO}

  /**
   * 严重程度
   */
  private Severity severity;

  /**
   * 相关节点 ID（可为 null 表示全局问题）
   */
  private String nodeId;

  /**
   * 问题编码
   */
  private String code;

  /**
   * 可读描述
   */
  private String message;
}
