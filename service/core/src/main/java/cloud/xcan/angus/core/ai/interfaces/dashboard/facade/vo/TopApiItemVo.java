package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "API 调用项（使用频次占比 TOP5）")
public class TopApiItemVo {

  @Schema(description = "排名")
  private Integer rank;

  @Schema(description = "接口路径")
  private String endpoint;

  @Schema(description = "HTTP 方法")
  private String method;

  @Schema(description = "调用次数")
  private Long callCount;

  @Schema(description = "占比百分比")
  private Double percentage;
}
