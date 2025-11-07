package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "文档状态视图对象")
public class KnowledgeBaseDocStatusVo {

  @Schema(description = "文档ID", example = "1")
  private Long id;

  @Schema(description = "处理状态", example = "PROCESSING")
  private DocumentStatus status;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled;

  @Schema(description = "处理进度", example = "75")
  private Double processingProgress;

  @Schema(description = "分段数量", example = "8")
  private Integer chunks;

  @Schema(description = "错误信息")
  private String errorMessage;
}
