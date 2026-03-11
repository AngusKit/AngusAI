package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "统计概览响应")
public class StatsOverviewVo {

  @Schema(description = "统计项列表")
  private List<StatItemVo> stats;
}
