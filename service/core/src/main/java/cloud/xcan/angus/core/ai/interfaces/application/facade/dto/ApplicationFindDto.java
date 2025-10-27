package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "应用查询参数")
public class ApplicationFindDto extends PageQuery {

  @Schema(description = "分类筛选")
  private ApplicationCategory category;

  @Schema(description = "状态筛选")
  private ApplicationStatus status;

  @Schema(description = "是否公开访问")
  private Boolean publicAccess;

  @Schema(description = "是否启用嵌入")
  private Boolean embedEnabled;

  @Schema(description = "是否启用API")
  private Boolean apiEnabled;

  @Schema(description = "是否模板")
  private Boolean isTemplate;

  @Schema(description = "排序字段", example = "lastModifiedDate", allowableValues = {"createdDate",
      "lastModifiedDate", "status", "category", "name"})
  private String orderBy = "lastModifiedDate";

}
