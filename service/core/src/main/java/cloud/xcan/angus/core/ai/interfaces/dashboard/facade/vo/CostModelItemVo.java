package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "费用成本项（费用占比 TOP5）")
public class CostModelItemVo {

  @Schema(description = "排名")
  private Integer rank;

  @Schema(description = "模型名称")
  private String modelName;

  @Schema(description = "费用（单位：分）")
  private Long cost;

  @Schema(description = "费用展示（如 ¥125.80）")
  private String costDisplay;

  @Schema(description = "占比百分比")
  private Double percentage;
}
