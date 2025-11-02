package cloud.xcan.angus.core.ai.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.Data;

/**
 * 会话配置
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SessionConfig implements Serializable {

  /**
   * 温度参数 0-2
   */
  private Double temperature;

  /**
   * 最大令牌数
   */
  private Integer maxTokens;

  /**
   * Top P参数 0-1
   */
  private Double topP;

  /**
   * 频率惩罚 0-2
   */
  private Double frequencyPenalty;

  /**
   * 存在惩罚 0-2
   */
  private Double presencePenalty;

  /**
   * 系统提示词
   */
  private String systemPrompt;

  /**
   * 是否启用流式响应
   */
  private Boolean streamResponse;

  /**
   * 是否保存历史记录
   */
  private Boolean saveHistory;
}
