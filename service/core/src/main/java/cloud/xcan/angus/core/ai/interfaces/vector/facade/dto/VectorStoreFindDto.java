package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询向量存储源请求参数")
public class VectorStoreFindDto extends PageQuery {

  @Schema(description = "数据库类型筛选")
  private VectorStoreType type;

  @Schema(description = "状态筛选")
  private ConnectionStatus status;

  @Schema(description = "启用状态筛选")
  private Boolean enabled;

  @Schema(description = "排序字段", allowableValues = {"id", "name", "createdDate", "type",
      "status"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}

