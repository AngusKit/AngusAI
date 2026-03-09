package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "应用查询参数")
public class ApplicationFindDto extends PageQuery {

  @Schema(description = "标签筛选（包含指定标签的应用）")
  private String tag;

  @Schema(description = "状态筛选")
  private ApplicationStatus status;

  @Schema(description = "是否公开访问")
  private Boolean publicAccess;

  @Schema(description = "是否启用嵌入")
  private Boolean embedEnabled;

  @Schema(description = "是否启用API")
  private Boolean apiEnabled;

  @Schema(description = "排序字段", example = "modifiedDate", allowableValues = {"createdDate",
      "modifiedDate", "status", "name"})
  private String orderBy = "modifiedDate";

}
