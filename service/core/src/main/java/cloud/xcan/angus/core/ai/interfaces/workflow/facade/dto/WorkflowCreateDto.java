package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建工作流请求参数")
public class WorkflowCreateDto {

  @NotBlank(message = "工作流名称不能为空")
  @Length(max = 50)
  @Schema(description = "工作流名称", example = "用户注册流程", required = true)
  private String name;

  @NotBlank(message = "工作流描述不能为空")
  @Length(max = 500)
  @Schema(description = "工作流描述", example = "处理用户注册的完整流程", required = true)
  private String description;

  @Schema(description = "图标emoji", example = "🔄")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Schema(description = "图标颜色", example = "text-white")
  private String iconColor;

  @NotNull(message = "工作流类型不能为空")
  @Schema(description = "工作流类型", required = true)
  private WorkflowType type;

  @Schema(description = "模板ID", example = "1")
  private Long templateId;

  @Schema(description = "初始配置")
  private Object config;
}
