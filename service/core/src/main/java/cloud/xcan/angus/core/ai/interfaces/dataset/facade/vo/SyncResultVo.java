package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "同步结果响应")
public class SyncResultVo {

  @Schema(description = "同步ID")
  private String syncId;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "开始时间")
  private Long startedAt;
}
