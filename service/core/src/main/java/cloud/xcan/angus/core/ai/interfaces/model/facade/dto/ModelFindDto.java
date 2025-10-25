package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.angus.core.ai.domain.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.ModelType;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询模型请求参数")
public class ModelFindDto extends SearchCriteria {

  @Schema(description = "搜索关键词")
  private String keyword;

  @Schema(description = "模型类型筛选")
  private ModelType type;

  @Schema(description = "提供商筛选")
  private ModelProvider provider;

  @Schema(description = "状态筛选")
  private ModelStatus status;

  @Schema(description = "排序字段", example = "createdDate")
  private String orderBy = "createdDate";

  @Schema(description = "排序方向", example = "desc")
  private String orderSort = "desc";
}
