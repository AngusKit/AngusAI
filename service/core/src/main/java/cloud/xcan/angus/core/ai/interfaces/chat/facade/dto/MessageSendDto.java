package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "发送消息请求")
public class MessageSendDto {

  @NotBlank
  @Length(max = 60000)
  @Schema(description = "消息内容", requiredMode = RequiredMode.REQUIRED)
  private String content;

  @Size(max = 5)
  @Schema(description = "附件列表")
  private List<MessageAttachment> attachments;

  @Valid
  @Schema(description = "覆盖会话配置")
  private SessionConfig overrideConfig;

  @Schema(description = "应用的提示词ID，用于统计分析")
  private Long promptId;
}
