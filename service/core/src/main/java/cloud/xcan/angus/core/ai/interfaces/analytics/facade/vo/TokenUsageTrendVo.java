package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "Token使用趋势")
public class TokenUsageTrendVo {

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

    @Schema(description = "输入Token")
    private Long inputTokens;

    @Schema(description = "输出Token")
    private Long outputTokens;

    @Schema(description = "总Token")
    private Long totalTokens;

    @Schema(description = "费用，单位：美分(cents)；展示请用 costDisplay")
    private Long cost;

    @Schema(description = "费用展示字符串，如 $125.80，后端已格式化，前端直接展示")
    private String costDisplay;
  }

  @Data
  @Schema(description = "汇总统计")
  public static class SummaryVo {

    @Schema(description = "总输入Token")
    private Long totalInput;

    @Schema(description = "总输出Token")
    private Long totalOutput;

    @Schema(description = "总Token")
    private Long totalTokens;

    @Schema(description = "总费用，单位：美分(cents)；展示请用 costDisplay")
    private Long totalCost;

    @Schema(description = "总费用展示字符串，如 $125.80，后端已格式化，前端直接展示")
    private String costDisplay;

    @Schema(description = "平均每次调用Token")
    private Double avgTokensPerCall;
  }

}
