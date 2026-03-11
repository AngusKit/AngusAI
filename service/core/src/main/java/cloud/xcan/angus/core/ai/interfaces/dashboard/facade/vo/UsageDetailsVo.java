package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "使用详情响应")
public class UsageDetailsVo {

  @Schema(description = "热度应用 TOP5")
  private List<HotAppItemVo> hotApps;

  @Schema(description = "API 调用 TOP5")
  private List<TopApiItemVo> topApis;

  @Schema(description = "费用成本 TOP5")
  private List<CostModelItemVo> costModels;
}
