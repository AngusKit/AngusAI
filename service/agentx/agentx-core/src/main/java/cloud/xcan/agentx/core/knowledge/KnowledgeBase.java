package cloud.xcan.agentx.core.knowledge;

import java.time.Instant;
import lombok.Builder;
import lombok.Data;

/**
 * 知识库定义
 */
@Data
@Builder
public class KnowledgeBase {

  private String id;
  private String name;
  private String description;
  private String tenantId;
  private String embeddingModelProvider;
  private String embeddingModelName;
  private String vectorStoreType;
  private RetrievalConfig retrievalConfig;
  private Instant createdAt;
  private Instant updatedAt;

  @Data
  @Builder
  public static class RetrievalConfig {

    /**
     * VECTOR | BM25 | HYBRID
     */
    @Builder.Default
    private String strategy = "HYBRID";
    @Builder.Default
    private int topK = 5;
    @Builder.Default
    private double similarityThreshold = 0.7;
    private boolean rerankerEnabled;
    private String rerankerModel;
  }
}
