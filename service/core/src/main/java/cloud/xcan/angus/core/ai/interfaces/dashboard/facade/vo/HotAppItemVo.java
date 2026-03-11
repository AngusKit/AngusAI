package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "热度应用项（使用频次占比 TOP5）")
public class HotAppItemVo {

  @Schema(description = "排名")
  private Integer rank;

  @Schema(description = "应用名称")
  private String appName;

  @Schema(description = "调用次数")
  private Long callCount;

  @Schema(description = "占比百分比")
  private Double percentage;
}
