package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.remote.PageQuery;
import dev.langchain4j.model.catalog.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询模型请求参数")
public class ModelFindDto extends PageQuery {

  @Schema(description = "模型ID")
  private Long id;

  @Schema(description = "模型名称")
  private String name;

  @Schema(description = "模型类型")
  private ModelType type;

  @Schema(description = "模型提供商")
  private ModelProvider provider;

  @Schema(description = "状态筛选")
  private ModelStatus status;

  @Schema(description = "排序字段", allowableValues = {"id", "createdDate", "name", "type",
      "provider", "status"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}
