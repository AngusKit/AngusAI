package cloud.xcan.angus.core.ai.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;

/**
 * 消息附件
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageAttachment implements Serializable {

  /**
   * 附件ID
   */
  private Long id;

  /**
   * 文件名
   */
  private String name;

  /**
   * MIME类型
   */
  private String type;

  /**
   * 文件大小（字节）
   */
  private Long size;

  /**
   * 访问URL
   */
  private String url;
}
