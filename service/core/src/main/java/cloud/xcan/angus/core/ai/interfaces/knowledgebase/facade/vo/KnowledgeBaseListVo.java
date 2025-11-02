package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "知识库列表视图对象")
public class KnowledgeBaseListVo extends TenantAuditingVo {

  @Schema(description = "知识库ID", example = "1")
  private Long id;

  @Schema(description = "知识库名称", example = "产品文档库")
  private String name;

  @Schema(description = "图标", example = "📚")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-100")
  private String iconBg;

  @Schema(description = "描述", example = "存储产品相关文档和资料")
  private String description;

  @Schema(description = "文档数量", example = "15")
  private Integer documentsCount;

  @Schema(description = "总大小", example = "2.5 MB")
  private String totalSize;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled;

  @Schema(description = "标签", example = "[\"产品\", \"文档\"]")
  private List<String> tags;

  @Schema(description = "可见性", example = "PRIVATE")
  private Visibility visibility;
}
