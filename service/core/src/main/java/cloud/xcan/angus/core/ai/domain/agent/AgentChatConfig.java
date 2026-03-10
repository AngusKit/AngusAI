package cloud.xcan.angus.core.ai.domain.agent;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import cloud.xcan.angus.core.ai.domain.Constants;

/**
 * 智能体对话配置（可选覆盖参数）
 * <p>
 * 优先级：请求参数 > 会话参数 > 智能体参数 > 默认值。未设置的字段不传，使用下游默认。
 * </p>
 */
@Schema(description = "对话配置覆盖，可选；未设置使用默认（会话/智能体/系统默认）")
@Data
public class AgentChatConfig implements Serializable {

  @Schema(description = "温度参数 0-2，控制随机性", example = "0.7")
  @Range(min = 0, max = 2)
  private Double temperature;

  @Schema(description = "最大令牌数", example = "4096")
  @Min(1)
  @Max(128000)
  private Integer maxTokens;

  @Schema(description = "Top-p 采样 0-1", example = "0.9")
  @Range(min = 0, max = 1)
  private Double topP;

  @Schema(description = "频率惩罚 0-2", example = "0.0")
  @Range(min = 0, max = 2)
  private Double frequencyPenalty;

  @Schema(description = "存在惩罚 0-2", example = "0.0")
  @Range(min = 0, max = 2)
  private Double presencePenalty;

  @Schema(description = "系统提示词覆盖", example = "You are a helpful assistant.")
  @Length(max = Constants.AGENT_SYSTEM_PROMPT_MAX_LENGTH)
  private String systemPrompt;

  @Schema(description = "模型请求超时（毫秒），请求级，优先级高于模型配置", example = "60000")
  @Min(1000)
  private Long timeoutMs;
}
