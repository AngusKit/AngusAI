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

  @Schema(description = "关键词搜索（名称、描述）")
  private String keyword;

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

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改人ID")
  protected Long lastModifiedBy;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;

  @Override
  public String getDefaultOrderBy() {
    return "lastModifiedDate";
  }
}
