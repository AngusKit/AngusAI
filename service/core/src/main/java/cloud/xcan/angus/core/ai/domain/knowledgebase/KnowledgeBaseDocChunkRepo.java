package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface KnowledgeBaseDocChunkRepo extends BaseRepository<KnowledgeBaseDocChunk, Long> {

  /**
   * 统计总分段数
   */
  @Query("SELECT COUNT(dc) FROM KnowledgeBaseDocChunk dc")
  Long countTotalChunks();

  /**
   * 计算平均分段大小
   */
  @Query("SELECT AVG(LENGTH(dc.content)) FROM KnowledgeBaseDocChunk dc WHERE dc.content IS NOT NULL")
  Double getAvgChunkSize();
}
