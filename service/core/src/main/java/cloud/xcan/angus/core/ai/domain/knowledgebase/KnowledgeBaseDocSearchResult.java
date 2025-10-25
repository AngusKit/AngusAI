package cloud.xcan.angus.core.ai.domain.knowledgebase;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "文档检索结果")
public class KnowledgeBaseDocSearchResult {

  @Schema(description = "文档ID", example = "1")
  private Long documentId;

  @Schema(description = "文档名称", example = "产品手册.pdf")
  private String documentName;

  @Schema(description = "分段ID", example = "chunk_001")
  private String chunkId;

  @Schema(description = "分段内容", example = "产品功能介绍...")
  private String content;

  @Schema(description = "相似度分数", example = "0.85")
  private Double score;

  @Schema(description = "元数据", example = "{\"pageNo\": 1, \"position\": \"header\"}")
  private Map<String, Object> metadata;
}
