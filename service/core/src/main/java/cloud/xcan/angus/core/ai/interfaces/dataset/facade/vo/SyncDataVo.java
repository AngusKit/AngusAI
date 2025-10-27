package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "同步结果响应")
public class SyncDataVo {

  @Schema(description = "同步文件名或表名")
  private String name;

  @Schema(description = "同步状态", allowableValues = {"PROCESSING", "COMPLETED", "FAILED"})
  private DatasetDataStatus status;

  @Schema(description = "失败原因")
  private String failedReason;

}
