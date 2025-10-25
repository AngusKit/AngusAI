package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "启用/禁用工作流请求参数")
public class WorkflowToggleDto {

  @NotNull(message = "启用状态不能为空")
  @Schema(description = "启用状态", example = "true", required = true)
  private Boolean enabled;
}
