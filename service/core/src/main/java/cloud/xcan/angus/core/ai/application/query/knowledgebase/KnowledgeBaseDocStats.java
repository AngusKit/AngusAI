package cloud.xcan.angus.core.ai.application.query.knowledgebase;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 知识库文档统计
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeBaseDocStats {

  private Long knowledgeBaseId;
  private int documentsCount;
  private int activeDocuments;
  private long totalSize;
  private int totalChunks;
}
