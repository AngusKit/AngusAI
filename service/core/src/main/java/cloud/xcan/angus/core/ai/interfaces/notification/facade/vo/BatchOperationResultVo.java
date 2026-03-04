package cloud.xcan.angus.core.ai.interfaces.notification.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "批量操作结果")
public class BatchOperationResultVo {

  @Schema(description = "成功数量")
  private Integer successCount;

  @Schema(description = "失败数量")
  private Integer failedCount;
}
