package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "文档查询请求参数")
public class KnowledgeBaseDocFindDto extends PageQuery {

  @Schema(description = "搜索关键词")
  private String keyword;

  @Schema(description = "文档类型筛选")
  private DocumentType type;

  @Schema(description = "状态筛选")
  private DocumentStatus status;

  @Schema(description = "启用状态筛选")
  private Boolean enabled;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "排序字段", allowableValues = {"id", "createdDate", "name", "size"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}
