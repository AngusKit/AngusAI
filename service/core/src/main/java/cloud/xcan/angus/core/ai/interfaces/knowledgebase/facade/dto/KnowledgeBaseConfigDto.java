package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "知识库配置")
public class KnowledgeBaseConfigDto {

  @Min(value = Constants.CHUNK_SIZE_MIN_VALUE)
  @Max(value = Constants.CHUNK_SIZE_MAX_VALUE)
  @Schema(description = "分段大小", example = "512")
  private Integer chunkSize;

  @Min(value = Constants.CHUNK_OVERLAP_MIN_VALUE)
  @Max(value = Constants.CHUNK_OVERLAP_MAX_VALUE)
  @Schema(description = "分段重叠", example = "50")
  private Integer chunkOverlap;

  @Schema(description = "向量化模型", example = "text-embedding-ada-002")
  private String embeddingModel;
}
