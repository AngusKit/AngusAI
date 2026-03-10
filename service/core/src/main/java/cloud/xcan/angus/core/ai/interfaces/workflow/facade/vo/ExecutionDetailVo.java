package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "执行详情响应")
public class ExecutionDetailVo {

  @Schema(description = "执行ID")
  private String executionId;

  @Schema(description = "工作流ID")
  private Long workflowId;

  @Schema(description = "工作流名称")
  private String workflowName;

  @Schema(description = "执行状态")
  private String status;

  @Schema(description = "开始时间", example = "2024-01-15T10:30:00")
  private LocalDateTime startedAt;

  @Schema(description = "完成时间", example = "2024-01-15T10:30:05")
  private LocalDateTime completedAt;

  @Schema(description = "执行时间（毫秒）")
  private Long executionTime;

  @Schema(description = "输入参数")
  private Object inputs;

  @Schema(description = "输出结果")
  private Object outputs;

  @Schema(description = "节点执行详情")
  private Object nodeExecutions;

  @Schema(description = "错误信息")
  private Object error;
}
