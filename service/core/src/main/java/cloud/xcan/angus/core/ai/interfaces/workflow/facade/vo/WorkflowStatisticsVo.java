package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "工作流统计响应")
public class WorkflowStatisticsVo {

  @Schema(description = "总工作流数")
  private Object totalWorkflows;

  @Schema(description = "运行中的工作流数")
  private Object runningWorkflows;

  @Schema(description = "今日调用次数")
  private Object todayCalls;

  @Schema(description = "成功率")
  private Object successRate;
}
