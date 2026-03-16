package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "工作流列表项响应")
public class WorkflowListVo extends TenantAuditingVo {

  @Schema(description = "工作流ID")
  private Long id;

  @Schema(description = "工作流名称")
  private String name;

  @Schema(description = "工作流描述")
  private String description;

  @Schema(description = "图标emoji")
  private String icon;

  @Schema(description = "背景色")
  private String iconBg;

  @Schema(description = "工作流类型")
  private WorkflowType type;

  @Schema(description = "工作流状态")
  private WorkflowStatus status;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "节点数量")
  private Integer nodesCount;

  @Schema(description = "版本号")
  private String version;

  @Schema(description = "统计信息")
  private Object stats;
}
