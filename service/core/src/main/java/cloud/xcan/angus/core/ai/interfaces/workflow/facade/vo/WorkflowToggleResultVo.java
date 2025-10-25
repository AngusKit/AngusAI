package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "工作流状态切换结果响应")
public class WorkflowToggleResultVo {

  @Schema(description = "工作流ID")
  private Long id;

  @Schema(description = "启用状态")
  private Boolean enabled;

  @Schema(description = "工作流状态")
  private WorkflowStatus status;
}
