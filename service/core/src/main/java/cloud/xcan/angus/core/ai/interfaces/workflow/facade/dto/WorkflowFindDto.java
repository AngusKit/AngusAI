package cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteria;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询工作流请求参数")
public class WorkflowFindDto extends PageQuery {

  @Schema(description = "工作流类型筛选")
  private String type;

  @Schema(description = "状态筛选")
  private String status;

  @Schema(description = "排序字段", example = "createdDate")
  private String orderBy = "createdDate";

  @Schema(description = "排序方向", example = "desc")
  private String orderSort = "desc";
}
