package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.ai.domain.Constants;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

/**
 * 会话配置
 */
@Schema(description = "会话配置")
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
  @NotBlank
  @Length(max = Constants.AGENT_SYSTEM_PROMPT_MAX_LENGTH)
  private String systemPrompt;

  /**
   * 是否启用流式响应，为null时自动根据接口类型判断
   */
  @Schema(description = "是否启用流式响应（stream response）；为 null 时自动根据接口类型判断。", example = "true")
  private Boolean streamResponse;

  /**
   * 是否保存历史记录
   */
  @Schema(description = "是否保存历史记录（save history），默认 true。", example = "true")
  private Boolean saveHistory = true;
}
