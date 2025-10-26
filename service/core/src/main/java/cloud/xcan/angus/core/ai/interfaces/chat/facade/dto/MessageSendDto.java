package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * 发送消息DTO
 */
@Data
@Schema(description = "发送消息请求")
public class MessageSendDto {

  @Schema(description = "消息内容", required = true)
  @NotBlank(message = "消息内容不能为空")
  @Size(max = 60000, message = "消息内容不能超过60000字符")
  private String content;

  @Schema(description = "附件列表")
  private List<MessageAttachment> attachments;

  @Schema(description = "覆盖会话配置")
  private SessionConfig overrideConfig;

  @Schema(description = "应用的提示词ID")
  private Long promptId;
}
