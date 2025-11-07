package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.ai.domain.Constants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "知识库配置")
public class KnowledgeBaseConfig {

  @NotNull
  @Min(value = Constants.CHUNK_SIZE_MIN_VALUE)
  @Max(value = Constants.CHUNK_SIZE_MAX_VALUE)
  @Schema(description = "分段大小", example = "512")
  private Integer chunkSize = 512;

  @NotNull
  @Min(value = Constants.CHUNK_OVERLAP_MIN_VALUE)
  @Max(value = Constants.CHUNK_OVERLAP_MAX_VALUE)
  @Schema(description = "分段重叠", example = "50")
  private Integer chunkOverlap = 50;

  @NotNull
  @Schema(description = "向量化模型ID")
  private Long embeddingModelId;

}
