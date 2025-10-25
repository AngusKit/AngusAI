package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "工作流版本响应")
public class WorkflowVersionVo {

  @Schema(description = "版本ID")
  private Long versionId;

  @Schema(description = "版本号")
  private String version;

  @Schema(description = "版本描述")
  private String description;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建者姓名")
  private String createdByName;

  @Schema(description = "是否为当前版本")
  private Boolean isCurrent;

  @Schema(description = "变更摘要")
  private Object changes;

  @Schema(description = "版本配置")
  private Object config;
}
