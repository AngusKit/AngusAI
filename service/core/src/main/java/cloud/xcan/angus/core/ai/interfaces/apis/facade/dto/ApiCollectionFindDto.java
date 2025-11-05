package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.Length;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询接口集请求参数")
public class ApiCollectionFindDto extends PageQuery {

  @Schema(description = "关键词搜索（名称、描述）")
  @Length(max = 100)
  private String keyword;

  @Schema(description = "来源筛选")
  private ApiCollectionSource source;

  @Schema(description = "可见性筛选")
  private Visibility visibility;

  @Schema(description = "排序字段", allowableValues = {"id", "name", "createdDate", "modifiedDate"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}

