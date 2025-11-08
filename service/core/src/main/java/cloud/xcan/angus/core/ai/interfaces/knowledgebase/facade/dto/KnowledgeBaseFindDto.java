package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
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

  @Schema(description = "知识库名称")
  private String name;

  @Schema(description = "标签筛选")
  private List<String> tags;

  @Schema(description = "可见性筛选")
  private Visibility visibility;

  @Schema(description = "启用状态筛选")
  private Boolean enabled;

  @Schema(description = "文档数")
  private Long documentsCount;

  @Schema(description = "总大小")
  private Long totalSize;

  @Schema(description = "所属租户ID")
  private Long tenantId;

  @Schema(description = "创建人ID")
  private Long createdBy;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改人ID")
  private Long modifiedBy;

  @Schema(description = "最后修改时间")
  private LocalDateTime modifiedDate;

  @Schema(description = "排序字段", example = "modifiedDate", allowableValues = {"createdDate",
      "modifiedDate", "documentsCount", "totalSize", "name"})
  private String orderBy = "modifiedDate";

  @Override
  public String getDefaultOrderBy() {
    return "modifiedDate";
  }
}
