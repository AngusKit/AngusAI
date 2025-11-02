package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询工作流请求参数")
public class WorkflowFindDto extends PageQuery {

  @Schema(description = "工作流名称", example = "用户注册流程")
  private String name;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Schema(description = "工作流类型")
  private WorkflowType type;

  @Schema(description = "工作流状态")
  private WorkflowStatus status;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "排序字段", allowableValues = {"id", "createdDate", "name", "type",
      "status"})
  private String orderBy = "createdDate";
}
