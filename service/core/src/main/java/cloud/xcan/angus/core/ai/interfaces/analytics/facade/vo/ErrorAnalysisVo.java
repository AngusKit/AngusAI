package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "错误分析")
public class ErrorAnalysisVo {

  @Schema(description = "按状态码统计")
  private List<ErrorByStatusCodeVo> byStatusCode;

  @Schema(description = "最近10次接口错误")
  private List<RecentErrorItemVo> recentErrors;

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
  @Schema(description = "最近接口错误记录")
  public static class RecentErrorItemVo {

    @Schema(description = "接口路径")
    private String endpoint;

    @Schema(description = "HTTP方法")
    private String method;

    @Schema(description = "状态码")
    private Integer statusCode;

    @Schema(description = "错误信息")
    private String errorMessage;

    @Schema(description = "请求时间")
    private java.time.LocalDateTime requestTime;

    @Schema(description = "响应时间(ms)")
    private Integer responseTimeMs;
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
