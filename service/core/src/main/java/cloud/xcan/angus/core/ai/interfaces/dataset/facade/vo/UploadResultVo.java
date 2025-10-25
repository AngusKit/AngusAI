package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "上传结果响应")
public class UploadResultVo {

  @Schema(description = "上传ID")
  private String uploadId;

  @Schema(description = "预估记录数")
  private Long recordsCount;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "预计处理时间（秒）")
  private Long estimatedTime;
}
