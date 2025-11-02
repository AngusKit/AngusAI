package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "执行日志响应")
public class ExecutionLogVo {

  @Schema(description = "日志ID")
  private Long id;

  @Schema(description = "执行ID")
  private String executionId;

  @Schema(description = "工作流ID")
  private Long workflowId;

  @Schema(description = "工作流名称")
  private String workflowName;

  @Schema(description = "活动描述")
  private String activity;

  @Schema(description = "执行状态")
  private String status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "操作人")
  private String operator;

  @Schema(description = "执行时间（毫秒）")
  private Long executionTime;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "输入参数")
  private Object inputs;

  @Schema(description = "输出结果")
  private Object outputs;

  @Schema(description = "错误信息")
  private String error;

  @Schema(description = "节点执行详情")
  private Object nodeExecutions;
}
