package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig.VariableConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新工作流配置请求参数")
public class WorkflowConfigUpdateDto {

  @NotNull
  @Schema(description = "节点列表", requiredMode = RequiredMode.REQUIRED)
  private List<WorkflowConfig.WorkflowNode> nodes;

  @NotNull
  @Schema(description = "连线列表", requiredMode = RequiredMode.REQUIRED)
  private List<WorkflowConfig.WorkflowEdge> edges;

  @Schema(description = "变量定义")
  private List<VariableConfig> variables;

  @Schema(description = "运行配置")
  private Object config;
}
