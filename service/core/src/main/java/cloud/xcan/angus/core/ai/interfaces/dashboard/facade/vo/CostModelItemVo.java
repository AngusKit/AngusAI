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

  @Schema(description = "费用，单位：美分(cents)；展示请用 costDisplay")
  private Long cost;

  @Schema(description = "费用展示字符串，如 $125.80，后端已格式化，前端直接展示")
  private String costDisplay;

  @Schema(description = "占比百分比")
  private Double percentage;
}
