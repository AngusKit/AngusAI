package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "工作流执行结果响应")
public class WorkflowExecuteResultVo {

  @Schema(description = "执行ID")
  private String executionId;

  @Schema(description = "执行状态")
  private String status;

  @Schema(description = "执行结果")
  private Object result;

  @Schema(description = "执行时间（毫秒）")
  private Long executionTime;

  @Schema(description = "开始时间", example = "2024-01-15T10:30:00")
  private LocalDateTime startedAt;

  @Schema(description = "完成时间", example = "2024-01-15T10:30:05")
  private LocalDateTime completedAt;
}
