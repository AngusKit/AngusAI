package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "更新工作流配置请求参数")
public class WorkflowConfigUpdateDto {

  @NotNull(message = "节点列表不能为空")
  @Schema(description = "节点列表", required = true)
  private List<Object> nodes;

  @NotNull(message = "连线列表不能为空")
  @Schema(description = "连线列表", required = true)
  private List<Object> edges;

  @Schema(description = "变量定义")
  private List<Object> variables;

  @Schema(description = "运行配置")
  private Object config;
}
