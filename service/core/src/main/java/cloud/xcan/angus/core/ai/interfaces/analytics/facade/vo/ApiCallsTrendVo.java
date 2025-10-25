package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "API调用趋势")
public class ApiCallsTrendVo {

  @Schema(description = "趋势数据点列表")
  private List<TrendItemVo> items;

  @Schema(description = "汇总统计")
  private SummaryVo summary;

  @Data
  @Schema(description = "趋势数据点")
  public static class TrendItemVo {
    @Schema(description = "时间戳")
    private Long datetime;

    @Schema(description = "日期显示", example = "10/16")
    private String date;

    @Schema(description = "总调用次数")
    private Integer totalCalls;

    @Schema(description = "成功调用次数")
    private Integer successfulCalls;

    @Schema(description = "失败调用次数")
    private Integer failedCalls;

    @Schema(description = "成功率百分比")
    private Double successRate;
  }

  @Data
  @Schema(description = "汇总统计")
  public static class SummaryVo {
    @Schema(description = "总调用次数")
    private Long totalCalls;

    @Schema(description = "平均每周期调用")
    private Double avgCallsPerPeriod;

    @Schema(description = "峰值调用")
    private Integer peakCalls;

    @Schema(description = "峰值时间")
    private String peakTime;
  }

}
