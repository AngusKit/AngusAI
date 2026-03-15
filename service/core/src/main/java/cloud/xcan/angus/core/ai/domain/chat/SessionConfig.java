package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.ai.domain.Constants;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

/**
 * 会话/对话配置
 * <p>
 * 合并原 AgentChatConfig 与 SessionConfig，用于会话创建、对话请求覆盖等。优先级：请求 > 会话 > 智能体 > 默认。
 * </p>
 */
@Schema(description = "会话/对话配置")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SessionConfig implements Serializable {

  /**
   * 温度参数 0-2
   */
  @Schema(description = "温度参数，范围 0-2，用于控制生成文本的随机性，越大越随机。", example = "0.5")
  @Range(min = 0, max = 2)
  private Double temperature;

  /**
   * 最大令牌数
   */
  @Schema(description = "最大令牌数（max tokens），控制生成文本的最大长度。若为空则使用模型默认值。", example = "1024")
  @Min(1)
  @Max(128000)
  private Integer maxTokens;

  /**
   * Top P参数 0-1
   */
  @Schema(description = "Top-p (nucleus sampling) 参数，范围 0-1，用于采样时截断概率分布。", example = "0.9")
  @Range(min = 0, max = 1)
  private Double topP;

  /**
   * 频率惩罚 0-2
   */
  @Schema(description = "频率惩罚（frequency penalty），范围 0-2，用于降低重复词语的概率。", example = "0.0")
  @Range(min = 0, max = 2)
  private Double frequencyPenalty;

  /**
   * 存在惩罚 0-2
   */
  @Schema(description = "存在惩罚（presence penalty），范围 0-2，用于鼓励模型引入新话题。", example = "0.0")
  @Range(min = 0, max = 2)
  private Double presencePenalty;

  /**
   * 系统提示词
   */
  @Schema(description = "系统提示词（system prompt），用于设定对话的系统角色或上下文，最大长度 60000 字符。")
  @Length(max = Constants.AGENT_SYSTEM_PROMPT_MAX_LENGTH)
  private String systemPrompt;

  /**
   * 模型请求超时（毫秒），请求级，优先级高于模型配置
   */
  @Schema(description = "模型请求超时（毫秒），请求级，优先级高于模型配置", example = "60000")
  @Min(1000)
  private Long timeoutMs;
}
