package cloud.xcan.angus.core.ai.interfaces.model.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "模型统计响应")
public class ModelStatisticsVo {

  @Schema(description = "总览统计")
  private Object overview;

  @Schema(description = "调用趋势")
  private Object callsTrend;

  @Schema(description = "Token使用")
  private Object tokenUsage;

  @Schema(description = "成本趋势")
  private Object costTrend;

  @Schema(description = "Top调用应用")
  private Object topApplications;

  @Schema(description = "错误分析")
  private Object errorAnalysis;

  @Schema(description = "模型列表统计")
  private Object listStatistics;

  @Schema(description = "提供商列表")
  private Object providers;

  @Schema(description = "批量操作结果")
  private Object batchResult;

  @Schema(description = "导入结果")
  private Object importResult;
}
