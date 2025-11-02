package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "应用使用分布")
public class AppDistributionVo {

  @Schema(description = "分布项列表")
  private List<DistributionItemVo> items;

  @Schema(description = "汇总统计")
  private TotalVo total;

  @Data
  @Schema(description = "分布项")
  public static class DistributionItemVo {

    @Schema(description = "应用ID")
    private Long appId;

    @Schema(description = "应用名称")
    private String appName;

    @Schema(description = "调用次数")
    private Long calls;

    @Schema(description = "占比百分比")
    private Double percentage;

    @Schema(description = "Token数")
    private Long tokens;

    @Schema(description = "费用")
    private Long cost;

    @Schema(description = "平均响应时间(毫秒)")
    private Double avgResponseTime;
  }

  @Data
  @Schema(description = "总计")
  public static class TotalVo {

    @Schema(description = "应用总数")
    private Integer apps;

    @Schema(description = "总调用次数")
    private Long calls;

    @Schema(description = "总Token数")
    private Long tokens;
  }

}
