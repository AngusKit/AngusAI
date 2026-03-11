package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "关键资源badge统计")
public class ResourcesBadgeVo {

  @Schema(description = "对话Session数")
  private long sessionCount;

  @Schema(description = "我的应用数")
  private long applicationCount;

  @Schema(description = "未读通知数")
  private long notificationCount;
}
