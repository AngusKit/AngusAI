package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Dashboard 查询参数")
public class DashboardQueryDto {

  @Schema(description = "应用ID筛选")
  private Long appId;

  @Schema(description = "时间范围", example = "7days",
      allowableValues = {"24hours", "7days", "30days", "90days"})
  private String timeRange = "7days";

  @Schema(description = "TOP N 数量，默认 5", defaultValue = "5")
  private Integer limit = 5;

  @Schema(description = "分页偏移量，默认 0", defaultValue = "0")
  private Integer offset = 0;
}
