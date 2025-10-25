package cloud.xcan.angus.core.ai.domain.knowledgebase;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "知识库配置")
public class KnowledgeBaseConfig {

  @Min(value = 100, message = "分段大小不能小于100")
  @Max(value = 2000, message = "分段大小不能大于2000")
  @Schema(description = "分段大小", example = "512")
  private Integer chunkSize = 512;

  @Min(value = 0, message = "分段重叠不能小于0")
  @Max(value = 200, message = "分段重叠不能大于200")
  @Schema(description = "分段重叠", example = "50")
  private Integer chunkOverlap = 50;

  @Schema(description = "向量化模型", example = "text-embedding-ada-002")
  private String embeddingModel = "text-embedding-ada-002";
}
