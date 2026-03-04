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
@Schema(description = "更新通知星标状态请求参数")
public class NotificationStarStatusDto {

  @NotEmpty
  @Schema(description = "通知ID列表", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<Long> notificationIds;

  @NotNull
  @Schema(description = "是否星标：true-星标, false-取消星标", requiredMode = Schema.RequiredMode.REQUIRED)
  private Boolean isStarred;
}
