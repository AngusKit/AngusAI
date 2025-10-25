package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "执行工作流请求参数")
public class WorkflowExecuteDto {

  @Schema(description = "输入变量")
  private Object inputs;

  @Schema(description = "执行模式", example = "async")
  private String mode = "async";
}
