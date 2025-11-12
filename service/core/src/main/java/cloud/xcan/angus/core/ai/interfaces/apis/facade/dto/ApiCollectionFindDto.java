package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询接口集请求参数")
public class ApiCollectionFindDto extends PageQuery {

  @Schema(description = "接口集ID")
  private Long id;

  @Schema(description = "接口集名称")
  private String name;

  @Schema(description = "来源筛选：OPENAPI-OpenAPI 3.0，SWAGGER-Swagger 2.0，POSTMAN-Postman Collection，MANUAL-手动创建")
  private ApiCollectionSource source;

  @Schema(description = "可见性筛选：PRIVATE-私有，TEAM-团队，PUBLIC-公开")
  private Visibility visibility;

  @Schema(description = "排序字段", allowableValues = {"id", "name", "createdDate", "source",
      "visibility"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}

