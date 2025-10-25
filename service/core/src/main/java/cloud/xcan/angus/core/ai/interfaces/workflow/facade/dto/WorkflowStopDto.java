package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "停止工作流执行请求参数")
public class WorkflowStopDto {

  @Schema(description = "特定执行ID，不传则停止所有")
  private String executionId;
}
