package cloud.xcan.agentx.core.agent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 对话配置覆盖 — 用于单次请求覆盖模型参数
 * <p>
 * 优先级：请求 > 会话 > 智能体 > 默认。仅非空字段参与覆盖。
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatConfigOverride {

  private Double temperature;
  private Integer maxTokens;
  private Double topP;
  private Double frequencyPenalty;
  private Double presencePenalty;
  private String systemPrompt;

  /** 请求级超时（毫秒），优先级高于模型级 timeoutSeconds */
  private Long timeoutMs;
}
