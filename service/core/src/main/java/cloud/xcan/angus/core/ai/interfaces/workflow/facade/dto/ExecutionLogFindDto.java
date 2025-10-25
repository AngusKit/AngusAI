package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.jpa.criteria.SearchCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询执行日志请求参数")
public class ExecutionLogFindDto extends SearchCriteria {

  @Schema(description = "工作流ID")
  private Long workflowId;

  @Schema(description = "工作流名称")
  private String workflowName;

  @Schema(description = "状态筛选")
  private String status;

  @Schema(description = "搜索关键词")
  private String keyword;

  @Schema(description = "开始日期")
  private Long startDate;

  @Schema(description = "结束日期")
  private Long endDate;
}
