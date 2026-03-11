package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "统计项")
public class StatItemVo {

  @Schema(description = "指标类型：totalApps | apiCalls | tokenUsage | activeUsers")
  private String type;

  @Schema(description = "指标标签")
  private String label;

  @Schema(description = "主数值")
  private String value;

  @Schema(description = "副标题说明")
  private String subtitle;

  @Schema(description = "趋势变化（如 +12%、-5%）")
  private String trend;

  @Schema(description = "趋势方向：true 上升，false 下降")
  private Boolean trendUp;

  @Schema(description = "图标背景样式（如 bg-blue-500）")
  private String iconBg;

  @Schema(description = "周期明细")
  private StatPeriodDetailsVo details;
}
