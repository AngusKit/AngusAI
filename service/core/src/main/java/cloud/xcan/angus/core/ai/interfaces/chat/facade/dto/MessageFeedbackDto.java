package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * 消息反馈DTO
 */
@Data
@Schema(description = "消息反馈请求")
public class MessageFeedbackDto {

  @NotNull
  @Schema(description = "反馈类型：like或dislike", requiredMode = RequiredMode.REQUIRED)
  @Pattern(regexp = "^(like|dislike)$", message = "反馈类型只能是like或dislike")
  private String feedbackType;

  @Schema(description = "反馈说明")
  private String comment;
}
