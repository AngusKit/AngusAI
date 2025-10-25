package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "知识库配置信息")
public class KnowledgeBaseConfigVo {

  @Schema(description = "分段大小", example = "512")
  private Integer chunkSize;

  @Schema(description = "分段重叠", example = "50")
  private Integer chunkOverlap;

  @Schema(description = "向量化模型", example = "text-embedding-ada-002")
  private String embeddingModel;
}
