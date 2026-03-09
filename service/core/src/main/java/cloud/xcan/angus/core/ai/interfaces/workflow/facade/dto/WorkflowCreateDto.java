package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建工作流请求参数")
public class WorkflowCreateDto {

  @NotBlank
  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "工作流名称", example = "用户注册流程", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "工作流描述", example = "处理用户注册的完整流程", requiredMode = RequiredMode.REQUIRED)
  private String description;

  @Schema(description = "图标emoji", example = "🔄")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @NotNull
  @Schema(description = "工作流类型", requiredMode = RequiredMode.REQUIRED)
  private WorkflowType type;

  @Schema(description = "初始配置")
  private Object config;
}
