package cloud.xcan.angus.core.ai.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "模型调用统计汇总")
public class ModelStats {

  @Schema(description = "总模型数")
  private Long totalModels;

  @Schema(description = "激活的模型数")
  private Long activeModels;

  @Schema(description = "总调用次数")
  private Long totalCalls = 0L;

  @Schema(description = "成功调用次数")
  private Long successfulCalls = 0L;

  @Schema(description = "失败调用次数")
  private Long failedCalls = 0L;

  @Schema(description = "总Token消耗数")
  private Long totalTokens = 0L;

  @Schema(description = "总成本（货币单位由业务侧定义）")
  private Double totalCost = 0.0;

  @Schema(description = "成功率（0-100%），可由 successfulCalls/totalCalls 计算")
  private Double successRate = 0.0;

  @Schema(description = "累计消耗的 tokens 数量")
  private Long totalTokensConsumed;

  @Schema(description = "平均延迟（毫秒）")
  private Double averageLatencyMs;

  @Schema(description = "近一月增长趋势")
  private LastMonthGrowthTrend lastMonthGrowthTrend;

  @Schema(description = "今天增长趋势")
  private TodayGrowthTrend todayGrowthTrend;

}
