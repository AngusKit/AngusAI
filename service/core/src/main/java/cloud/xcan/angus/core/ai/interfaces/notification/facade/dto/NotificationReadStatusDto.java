package cloud.xcan.angus.core.ai.interfaces.notification.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "更新通知已读状态请求参数")
public class NotificationReadStatusDto {

  @NotEmpty
  @Schema(description = "通知ID列表", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<Long> notificationIds;

  @NotNull
  @Schema(description = "是否已读：true-已读, false-未读", requiredMode = Schema.RequiredMode.REQUIRED)
  private Boolean isRead;
}
