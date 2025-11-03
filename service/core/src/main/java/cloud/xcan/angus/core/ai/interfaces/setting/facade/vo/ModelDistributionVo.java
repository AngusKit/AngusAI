package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "模型使用分布")
public class ModelDistributionVo {

  @Schema(description = "分布项列表")
  private List<DistributionItemVo> items;

  @Schema(description = "汇总统计")
  private TotalVo total;

  @Data
  @Schema(description = "分布项")
  public static class DistributionItemVo {

    @Schema(description = "模型ID")
    private Long modelId;

    @Schema(description = "模型名称", example = "GPT-4")
    private String modelName;

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

    @Schema(description = "图表颜色")
    private String color;
  }

  @Data
  @Schema(description = "总计")
  public static class TotalVo {

    @Schema(description = "模型总数")
    private Integer models;

    @Schema(description = "总调用次数")
    private Long calls;

    @Schema(description = "总Token数")
    private Long tokens;

    @Schema(description = "总费用")
    private Long cost;
  }

}
