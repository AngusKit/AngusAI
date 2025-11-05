package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询接口端点请求参数")
public class ApiEndpointFindDto extends PageQuery {

  @Schema(description = "端点ID")
  private Long id;

  @Schema(description = "端点名称，支持模糊查询")
  private String name;

  @Schema(description = "操作标识符，用于OpenAPI规范解析的唯一标识")
  private String operationId;

  @Schema(description = "HTTP方法筛选：GET、POST、PUT、DELETE、PATCH等")
  private HttpMethod method;

  @Schema(description = "标签筛选，支持按标签名称过滤")
  private String tag;

  @Schema(description = "启用状态筛选：true-仅查询启用的接口，false-仅查询禁用的接口，null-查询所有")
  private Boolean enabled;

  @Schema(description = "排序字段", allowableValues = {"id", "name", "method", "createdDate"})
  private String orderBy = "name";

  @Override
  public String getDefaultOrderBy() {
    return "name";
  }
}

