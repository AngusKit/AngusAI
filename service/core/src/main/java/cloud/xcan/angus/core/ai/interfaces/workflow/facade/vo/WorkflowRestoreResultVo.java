package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "工作流版本恢复结果响应")
public class WorkflowRestoreResultVo {

  @Schema(description = "新版本ID")
  private Long newVersionId;

  @Schema(description = "新版本号")
  private String newVersion;
}
