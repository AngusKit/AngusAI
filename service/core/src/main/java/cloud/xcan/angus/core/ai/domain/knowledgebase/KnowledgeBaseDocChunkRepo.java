package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@NoRepositoryBean
public interface KnowledgeBaseDocChunkRepo extends BaseRepository<KnowledgeBaseDocChunk, Long> {

  /**
   * 根据文档ID查找分段
   */
  List<KnowledgeBaseDocChunk> findByDocumentId(Long documentId);

  /**
   * 根据文档ID和分段索引查找分段
   */
  KnowledgeBaseDocChunk findByDocumentIdAndChunkIndex(Long documentId, Integer chunkIndex);

  /**
   * 根据文档ID删除分段
   */
  void deleteByDocumentId(Long documentId);

  /**
   * 统计文档的分段数量
   */
  @Query("SELECT COUNT(dc) FROM KnowledgeBaseDocChunk dc WHERE dc.documentId = :documentId")
  Long countByDocumentId(@Param("documentId") Long documentId);

  /**
   * 根据知识库ID查找所有分段
   */
  @Query("SELECT dc FROM KnowledgeBaseDocChunk dc JOIN KnowledgeBaseDoc d ON dc.documentId = d.id WHERE d.knowledgeBaseId = :knowledgeBaseId")
  List<KnowledgeBaseDocChunk> findByKnowledgeBaseId(@Param("knowledgeBaseId") Long knowledgeBaseId);

  /**
   * 根据知识库ID统计总分段数
   */
  @Query("SELECT COUNT(dc) FROM KnowledgeBaseDocChunk dc JOIN KnowledgeBaseDoc d ON dc.documentId = d.id WHERE d.knowledgeBaseId = :knowledgeBaseId")
  Long countByKnowledgeBaseId(@Param("knowledgeBaseId") Long knowledgeBaseId);
}
