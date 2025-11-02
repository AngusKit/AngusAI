package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询执行日志请求参数")
public class WorkflowExecutionLogFindDto extends PageQuery {

  @Schema(description = "工作流ID")
  private Long workflowId;

  @Schema(description = "工作流名称")
  private String workflowName;

  @Schema(description = "状态筛选")
  private String status;

}
