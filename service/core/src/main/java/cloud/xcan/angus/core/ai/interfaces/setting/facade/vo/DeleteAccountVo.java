package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 删除账户响应
 */
@Data
@Schema(description = "删除账户响应")
public class DeleteAccountVo {

  @Schema(description = "计划删除时间")
  private LocalDateTime scheduledAt;

  @Schema(description = "是否可以取消")
  private Boolean cancellable;
}
