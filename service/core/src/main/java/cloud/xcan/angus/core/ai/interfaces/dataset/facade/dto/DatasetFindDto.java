package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询数据集请求参数")
public class DatasetFindDto extends PageQuery {

  @Schema(description = "数据集ID")
  private Long id;

  @Schema(description = "数据集名称")
  private String name;

  @Schema(description = "数据集类型")
  private DatasetType type;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Schema(description = "标签筛选")
  private String tags;

  @Schema(description = "排序字段", example = "modifiedDate", allowableValues = {"name", "type",
      "status", "createdDate", "modifiedDate"})
  private String orderBy = "modifiedDate";

}
