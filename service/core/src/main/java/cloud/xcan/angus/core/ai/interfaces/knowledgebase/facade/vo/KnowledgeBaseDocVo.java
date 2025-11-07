package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentType;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "文档列表视图对象")
public class KnowledgeBaseDocVo extends TenantAuditingVo {

  @Schema(description = "文档ID", example = "1")
  private Long id;

  @Schema(description = "文档名称", example = "产品手册.pdf")
  private String name;

  @Schema(description = "文档类型", example = "PDF")
  private DocumentType type;

  @Schema(description = "文件大小", example = "2.5 MB")
  private String size;

  @Schema(description = "处理状态", example = "COMPLETED")
  private DocumentStatus status;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled;

  @Schema(description = "分段数量", example = "8")
  private Integer chunks;

  @Schema(description = "处理进度", example = "100")
  private Double processingProgress = 0D;

  @Schema(description = "错误信息")
  private String errorMessage;
}
