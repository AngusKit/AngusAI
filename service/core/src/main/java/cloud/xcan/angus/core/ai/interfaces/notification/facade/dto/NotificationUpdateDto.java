package cloud.xcan.angus.core.ai.interfaces.notification.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_CODE_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH_X2;

import cloud.xcan.angus.core.ai.domain.notification.enums.NotificationPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "更新通知请求参数")
public class NotificationUpdateDto {

  @NotBlank
  @Length(max = MAX_NAME_LENGTH_X2)
  @Schema(description = "通知标题", requiredMode = Schema.RequiredMode.REQUIRED)
  private String title;

  @NotBlank
  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "通知描述", requiredMode = Schema.RequiredMode.REQUIRED)
  private String description;

  @NotBlank
  @Length(max = MAX_CODE_LENGTH)
  @Schema(description = "分类", requiredMode = Schema.RequiredMode.REQUIRED)
  private String category;

  @NotNull
  @Schema(description = "优先级：HIGH, MEDIUM, LOW", requiredMode = Schema.RequiredMode.REQUIRED)
  private NotificationPriority priority;
}
