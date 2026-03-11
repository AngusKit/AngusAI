package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "统计项周期明细")
public class StatPeriodDetailsVo {

  @Schema(description = "本周/当前周数据")
  private String thisWeek;

  @Schema(description = "上周数据")
  private String lastWeek;

  @Schema(description = "本月/当前月数据")
  private String thisMonth;

  @Schema(description = "上月数据")
  private String lastMonth;
}
