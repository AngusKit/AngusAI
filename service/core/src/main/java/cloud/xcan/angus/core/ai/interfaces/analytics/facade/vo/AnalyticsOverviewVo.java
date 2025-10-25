package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "分析概览统计")
public class AnalyticsOverviewVo {

  @Schema(description = "时间范围")
  private String timeRange;

  @Schema(description = "统计周期")
  private PeriodVo period;

  @Schema(description = "核心指标")
  private StatsVo stats;

  @Schema(description = "成功率")
  private SuccessRateVo successRate;

  @Data
  @Schema(description = "统计周期")
  public static class PeriodVo {
    @Schema(description = "开始时间戳")
    private Long start;

    @Schema(description = "结束时间戳")
    private Long end;
  }

  @Data
  @Schema(description = "核心统计指标")
  public static class StatsVo {
    @Schema(description = "API总调用")
    private MetricVo totalApiCalls;

    @Schema(description = "活跃用户数")
    private MetricVo activeUsers;

    @Schema(description = "Token消耗")
    private MetricVo tokenConsumption;

    @Schema(description = "平均响应时间")
    private MetricVo avgResponseTime;
  }

  @Data
  @Schema(description = "指标详情")
  public static class MetricVo {
    @Schema(description = "数值")
    private Long value;

    @Schema(description = "显示值", example = "25,590")
    private String valueDisplay;

    @Schema(description = "变化百分比", example = "+12.5%")
    private String change;

    @Schema(description = "趋势", allowableValues = {"up", "down"})
    private String trend;

    @Schema(description = "对比说明", example = "与上周期相比")
    private String comparedTo;
  }

  @Data
  @Schema(description = "成功率统计")
  public static class SuccessRateVo {
    @Schema(description = "成功率百分比")
    private Double value;

    @Schema(description = "总数")
    private Long total;

    @Schema(description = "成功数")
    private Long successful;

    @Schema(description = "失败数")
    private Long failed;
  }

}
