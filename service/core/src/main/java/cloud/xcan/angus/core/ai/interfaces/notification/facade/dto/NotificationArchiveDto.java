package cloud.xcan.angus.core.ai.interfaces.notification.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "归档通知请求参数")
public class NotificationArchiveDto {

  @NotEmpty
  @Schema(description = "通知ID列表", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<Long> notificationIds;
}
