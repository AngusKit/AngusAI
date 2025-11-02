package cloud.xcan.angus.core.ai.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "近一月增长趋势")
public class LastMonthGrowthTrend {

  @Schema(description = "本月新增模型数量")
  private Long addedModels;

  @Schema(description = "本月新增成本，单位货币")
  private Double addedCost;

  @Schema(description = "本月新增Tokens")
  private Long addedTokens;

  @Schema(description = "本月新增调用次数")
  private Long addedCalls;

  @Schema(description = "本月平均延迟（毫秒）")
  private Double averageLatencyMs;

  @Schema(description = "较上月延迟降低（毫秒），正值表示延迟降低的毫秒数")
  private Long latencyDecreaseFromLastMonthMs;
}
