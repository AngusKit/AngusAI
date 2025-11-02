package cloud.xcan.angus.core.ai.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

/**
 * 消息使用统计
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageUsage implements Serializable {

  /**
   * 输入Token数
   */
  private Integer promptTokens;

  /**
   * 输出Token数
   */
  private Integer completionTokens;

  /**
   * 总Token数
   */
  private Integer totalTokens;

  /**
   * 成本
   */
  private BigDecimal cost;
}
