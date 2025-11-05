package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "同步任务信息")
public class SyncTaskVo {

  @Schema(description = "任务ID")
  private String taskId;

  @Schema(description = "任务状态", allowableValues = {"pending", "processing", "completed", "failed"})
  private String status;

  @Schema(description = "预计完成时间（秒）")
  private Long estimatedTime;
}

