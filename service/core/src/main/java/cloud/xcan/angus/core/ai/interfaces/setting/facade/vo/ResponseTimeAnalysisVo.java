package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "响应时间分析")
public class ResponseTimeAnalysisVo {

  @Schema(description = "趋势数据点列表")
  private List<TrendItemVo> items;

  @Schema(description = "汇总统计")
  private SummaryVo summary;

  @Data
  @Schema(description = "趋势数据点")
  public static class TrendItemVo {

    @Schema(description = "时间戳")
    private Long datetime;

    @Schema(description = "日期显示")
    private String date;

    @Schema(description = "平均响应时间(毫秒)")
    private Integer avgTime;

    @Schema(description = "P50(毫秒)")
    private Integer p50;

    @Schema(description = "P95(毫秒)")
    private Integer p95;

    @Schema(description = "P99(毫秒)")
    private Integer p99;

    @Schema(description = "最小时间(毫秒)")
    private Integer minTime;

    @Schema(description = "最大时间(毫秒)")
    private Integer maxTime;
  }

  @Data
  @Schema(description = "汇总统计")
  public static class SummaryVo {

    @Schema(description = "总体平均响应时间")
    private Double overallAvg;

    @Schema(description = "总体P95")
    private Integer overallP95;

    @Schema(description = "总体P99")
    private Integer overallP99;

    @Schema(description = "最慢接口")
    private SlowestEndpointVo slowestEndpoint;
  }

  @Data
  @Schema(description = "最慢接口")
  public static class SlowestEndpointVo {

    @Schema(description = "接口路径")
    private String endpoint;

    @Schema(description = "平均响应时间(毫秒)")
    private Integer avgTime;
  }

}
