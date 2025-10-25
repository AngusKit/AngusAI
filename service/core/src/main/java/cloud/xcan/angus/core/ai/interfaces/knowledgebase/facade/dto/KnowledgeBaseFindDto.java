package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentVisibility;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "知识库查询请求参数")
public class KnowledgeBaseFindDto extends PageQuery {

  @Schema(description = "搜索关键词", example = "产品文档")
  private String keyword;

  @Schema(description = "知识库名称", example = "产品文档库")
  private String name;

  @Schema(description = "标签筛选", example = "[\"产品\", \"文档\"]")
  private List<String> tags;

  @Schema(description = "可见性筛选", example = "PRIVATE")
  private DocumentVisibility visibility;

  @Schema(description = "启用状态筛选", example = "true")
  private Boolean enabled;

  @Schema(description = "文档数", example = "10")
  private Long documentsCount;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改人ID", example = "1")
  private Long lastModifiedBy;

  @Schema(description = "最后修改时间", example = "2024-10-12 00:00:00")
  private LocalDateTime lastModifiedDate;

  @Schema(description = "排序字段", example = "lastModifiedDate", allowableValues = {"createdDate",
      "lastModifiedDate", "documentsCount", "name"})
  private String orderBy = "lastModifiedDate";

  @Override
  public String getDefaultOrderBy() {
    return "lastModifiedDate";
  }
}
