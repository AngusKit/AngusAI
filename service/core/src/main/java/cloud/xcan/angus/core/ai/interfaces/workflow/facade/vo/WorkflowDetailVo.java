package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "工作流详情响应")
public class WorkflowDetailVo {

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

  @Schema(description = "图标颜色")
  private String iconColor;

  @Schema(description = "工作流类型")
  private WorkflowType type;

  @Schema(description = "工作流状态")
  private WorkflowStatus status;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "版本号")
  private String version;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改时间")
  private LocalDateTime modifiedDate;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "工作流配置")
  private Object config;

  @Schema(description = "统计数据")
  private Object stats;
}
