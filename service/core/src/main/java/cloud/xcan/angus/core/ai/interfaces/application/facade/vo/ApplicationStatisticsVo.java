package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "应用统计数据")
public class ApplicationStatisticsVo {

  @Schema(description = "概览统计")
  private OverviewStatsVo overview;

  @Schema(description = "趋势数据")
  private TrendsStatsVo trends;

  @Schema(description = "热门用户")
  private List<TopUserVo> topUsers;

  @Data
  @Schema(description = "概览统计")
  public static class OverviewStatsVo {

    @Schema(description = "总调用次数")
    private Long totalCalls;

    @Schema(description = "总token数")
    private Long totalTokens;

    @Schema(description = "总成本")
    private Double totalCost;

    @Schema(description = "平均响应时间（秒）")
    private Long avgResponseTime;

    @Schema(description = "成功率")
    private Double successRate;
  }

  @Data
  @Schema(description = "趋势数据")
  public static class TrendsStatsVo {

    @Schema(description = "调用次数趋势")
    private List<TrendDataVo> calls;

    @Schema(description = "token数趋势")
    private List<TrendDataVo> tokens;

    @Schema(description = "响应时间趋势")
    private List<TrendDataVo> responseTime;
  }

  @Data
  @Schema(description = "趋势数据项")
  public static class TrendDataVo {

    @Schema(description = "时间戳")
    private Long datetime;

    @Schema(description = "数值")
    private Double value;
  }

  @Data
  @Schema(description = "热门用户")
  public static class TopUserVo {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "调用次数")
    private Long callCount;
  }
}
