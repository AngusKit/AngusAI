package cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "分析查询参数基类")
public class AnalyticsQueryDto {

  @Schema(description = "应用ID筛选")
  private Long appId;

  @Schema(description = "时间范围", example = "7days",
      allowableValues = {"24hours", "7days", "30days", "90days"})
  private String timeRange = "7days";

  @Schema(description = "数据粒度", allowableValues = {"hour", "day", "week"})
  private String granularity;

}
