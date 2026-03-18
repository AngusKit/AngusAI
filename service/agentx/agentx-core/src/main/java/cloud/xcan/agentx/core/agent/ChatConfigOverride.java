package cloud.xcan.agentx.core.agent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 对话配置覆盖 — 用于单次请求覆盖模型参数
 * <p>
 * 优先级：请求 > 会话 > 智能体 > 默认。仅非空字段参与覆盖。
 * </p>
 */
@Data
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChatConfigOverride {

  /**
   * 温度参数 0-2，控制生成随机性，越高越随机
   */
  private Double temperature;

  /**
   * 最大输出 Token 数
   */
  private Integer maxTokens;

  /**
   * Top-p 核采样 0-1，控制采样范围
   */
  private Double topP;

  /**
   * 频率惩罚 0-2，降低重复词出现概率
   */
  private Double frequencyPenalty;

  /**
   * 存在惩罚 0-2，降低重复主题出现概率
   */
  private Double presencePenalty;

  /**
   * 系统提示词覆盖
   */
  private String systemPrompt;

  /**
   * 请求级超时（毫秒），优先级高于模型级 timeoutSeconds
   */
  private Long timeoutMs;
}
