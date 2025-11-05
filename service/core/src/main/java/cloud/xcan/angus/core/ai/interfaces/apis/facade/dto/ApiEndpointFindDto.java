package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint.HttpMethod;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.Length;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询接口端点请求参数")
public class ApiEndpointFindDto extends PageQuery {

  @Schema(description = "关键词搜索（名称、路径）")
  @Length(max = 100)
  private String keyword;

  @Schema(description = "HTTP方法筛选")
  private HttpMethod method;

  @Schema(description = "分类筛选")
  private String category;

  @Schema(description = "标签筛选")
  private String tag;

  @Schema(description = "启用状态筛选")
  private Boolean enabled;

  @Schema(description = "排序字段", allowableValues = {"id", "name", "method", "lastUsedAt"})
  private String orderBy = "name";

  @Override
  public String getDefaultOrderBy() {
    return "name";
  }
}

