package cloud.xcan.core.guardrail;

import lombok.Builder;
import lombok.Data;

/**
 * 护栏检查结果
 */
@Data
@Builder
public class GuardrailResult {

  /**
   * 是否通过
   */
  private boolean passed;

  /**
   * 拦截原因（如未通过）
   */
  private String reason;

  /**
   * 修正后的内容（如脱敏后）
   */
  private String sanitizedContent;

  /**
   * 护栏 ID
   */
  private String guardrailId;

  public static GuardrailResult pass() {
    return GuardrailResult.builder().passed(true).build();
  }

  public static GuardrailResult block(String guardrailId, String reason) {
    return GuardrailResult.builder()
        .passed(false)
        .guardrailId(guardrailId)
        .reason(reason)
        .build();
  }

  public static GuardrailResult sanitize(String guardrailId, String sanitizedContent) {
    return GuardrailResult.builder()
        .passed(true)
        .guardrailId(guardrailId)
        .sanitizedContent(sanitizedContent)
        .build();
  }
}
