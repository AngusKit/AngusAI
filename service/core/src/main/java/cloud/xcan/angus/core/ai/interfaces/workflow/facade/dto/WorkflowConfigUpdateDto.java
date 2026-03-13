package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新工作流配置请求参数")
public class WorkflowConfigUpdateDto {

  @NotNull(message = "节点列表不能为空")
  @Schema(description = "节点列表", requiredMode = RequiredMode.REQUIRED)
  private List<Object> nodes;

  @NotNull(message = "连线列表不能为空")
  @Schema(description = "连线列表", requiredMode = RequiredMode.REQUIRED)
  private List<Object> edges;

  @Schema(description = "变量定义")
  private List<Object> variables;

  @Schema(description = "运行配置")
  private Object config;
}
