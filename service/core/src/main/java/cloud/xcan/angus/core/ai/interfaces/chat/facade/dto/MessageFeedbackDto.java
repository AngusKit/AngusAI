package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_REMARK_LENGTH_X4;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

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
  @Length(max = MAX_REMARK_LENGTH_X4)
  private String comment;
}
