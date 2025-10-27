package cloud.xcan.angus.core.ai.domain.dataset;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "同步结果响应")
public class SyncDataResult {

  @Schema(description = "同步文件名或表名")
  private String name;

  @Schema(description = "同步状态", allowableValues = {"PROCESSING", "COMPLETED", "FAILED"})
  private DatasetDataStatus status;

  @Schema(description = "失败原因")
  private String failedReason;

}
