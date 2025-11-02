package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 修改密码响应
 */
@Data
@Schema(description = "修改密码响应")
public class ChangePasswordVo {

  @Schema(description = "修改时间")
  private LocalDateTime changedAt;
}
