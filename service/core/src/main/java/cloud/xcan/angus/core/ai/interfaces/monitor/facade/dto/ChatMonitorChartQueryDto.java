package cloud.xcan.angus.core.ai.interfaces.monitor.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 对话监控折线图查询 DTO
 */
@Data
@Schema(description = "对话监控折线图查询参数")
public class ChatMonitorChartQueryDto {

  @Schema(description = "时间范围：year/month/day", allowableValues = {"year", "month", "day"})
  private String range = "day";

  @Schema(description = "年份（range=year 或 range=month 时使用）")
  private String year;

  @Schema(description = "月份（range=month 时使用，1-12）")
  private String month;

  @Schema(description = "日期（range=day 时使用，1-31）")
  private String day;
}
