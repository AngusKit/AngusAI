package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "复制工作流请求参数")
public class WorkflowDuplicateDto {

  @Length(max = 50)
  @Schema(description = "新工作流名称", example = "用户注册流程的副本")
  private String name;
}
