package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * 消息反馈DTO
 */
@Data
@Schema(description = "消息反馈请求")
public class MessageFeedbackDto {

  @Schema(description = "反馈类型：like或dislike", required = true)
  @NotBlank(message = "反馈类型不能为空")
  @Pattern(regexp = "^(like|dislike)$", message = "反馈类型只能是like或dislike")
  private String feedbackType;

  @Schema(description = "反馈说明")
  private String comment;
}
