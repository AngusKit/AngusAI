package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询数据集请求参数")
public class DatasetFindDto extends SearchCriteria {

  @Schema(description = "搜索关键词")
  private String keyword;

  @Schema(description = "数据类型筛选")
  private String type;

  @Schema(description = "状态筛选")
  private String status;

  @Schema(description = "可见性筛选")
  private Visibility visibility;

  @Schema(description = "排序字段", example = "createdDate")
  private String orderBy = "createdDate";

  @Schema(description = "排序方向", example = "desc")
  private String orderSort = "desc";

  @Schema(description = "标签筛选")
  private List<String> tags;
}
