package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "错误分析")
public class ErrorAnalysisVo {

  @Schema(description = "按状态码统计")
  private List<ErrorByStatusCodeVo> byStatusCode;

  @Schema(description = "按接口统计错误")
  private List<ErrorByEndpointVo> byEndpoint;

  @Schema(description = "错误趋势")
  private List<ErrorTrendItemVo> errorTrend;

  @Schema(description = "汇总统计")
  private SummaryVo summary;

  @Data
  @Schema(description = "按状态码统计")
  public static class ErrorByStatusCodeVo {
    @Schema(description = "HTTP状态码", example = "429")
    private Integer statusCode;

    @Schema(description = "错误名称", example = "Rate Limit")
    private String name;

    @Schema(description = "错误次数")
    private Long count;

    @Schema(description = "占比(显示)", example = "45%")
    private String percentage;

    @Schema(description = "占比(数值)")
    private Double percentageValue;

    @Schema(description = "趋势", allowableValues = {"up", "down"})
    private String trend;

    @Schema(description = "变化", example = "+12%")
    private String change;
  }

  @Data
  @Schema(description = "按接口统计错误")
  public static class ErrorByEndpointVo {
    @Schema(description = "接口路径")
    private String endpoint;

    @Schema(description = "错误次数")
    private Long errors;

    @Schema(description = "错误率")
    private Double errorRate;

    @Schema(description = "最常见错误码")
    private Integer topErrorCode;
  }

  @Data
  @Schema(description = "错误趋势数据点")
  public static class ErrorTrendItemVo {
    @Schema(description = "时间戳")
    private Long datetime;

    @Schema(description = "日期显示")
    private String date;

    @Schema(description = "总错误数")
    private Integer total;

    @Schema(description = "4xx错误数")
    private Integer code4xx;

    @Schema(description = "5xx错误数")
    private Integer code5xx;
  }

  @Data
  @Schema(description = "汇总统计")
  public static class SummaryVo {
    @Schema(description = "总错误次数")
    private Long totalErrors;

    @Schema(description = "总体错误率")
    private Double errorRate;

    @Schema(description = "最常见错误")
    private MostCommonErrorVo mostCommonError;
  }

  @Data
  @Schema(description = "最常见错误")
  public static class MostCommonErrorVo {
    @Schema(description = "状态码")
    private Integer code;

    @Schema(description = "错误名称")
    private String name;

    @Schema(description = "错误次数")
    private Long count;
  }

}
