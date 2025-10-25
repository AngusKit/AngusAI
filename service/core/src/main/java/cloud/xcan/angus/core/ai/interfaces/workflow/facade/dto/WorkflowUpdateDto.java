package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新工作流请求参数")
public class WorkflowUpdateDto {

  @Length(max = 50)
  @Schema(description = "工作流名称", example = "用户注册流程")
  private String name;

  @Length(max = 500)
  @Schema(description = "工作流描述", example = "处理用户注册的完整流程")
  private String description;

  @Schema(description = "图标emoji", example = "🔄")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Schema(description = "图标颜色", example = "text-white")
  private String iconColor;

  @Schema(description = "工作流类型")
  private WorkflowType type;
}
