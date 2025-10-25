package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepo extends BaseRepository<KnowledgeBaseDoc, Long> {

  /**
   * 根据知识库ID查找文档
   */
  List<KnowledgeBaseDoc> findByKnowledgeBaseId(Long knowledgeBaseId);

  /**
   * 根据知识库ID和状态查找文档
   */
  List<KnowledgeBaseDoc> findByKnowledgeBaseIdAndStatus(Long knowledgeBaseId,
      DocumentStatus status);

  /**
   * 根据知识库ID和启用状态查找文档
   */
  List<KnowledgeBaseDoc> findByKnowledgeBaseIdAndEnabled(Long knowledgeBaseId, Boolean enabled);

  /**
   * 根据知识库ID和文档类型查找文档
   */
  List<KnowledgeBaseDoc> findByKnowledgeBaseIdAndType(Long knowledgeBaseId, DocumentType type);

  /**
   * 根据知识库ID和名称查找文档
   */
  KnowledgeBaseDoc findByKnowledgeBaseIdAndName(Long knowledgeBaseId, String name);

  /**
   * 统计知识库的文档数量
   */
  @Query("SELECT COUNT(d) FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId")
  Long countByKnowledgeBaseId(@Param("knowledgeBaseId") Long knowledgeBaseId);

  /**
   * 统计知识库的启用文档数量
   */
  @Query("SELECT COUNT(d) FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId AND d.enabled = true")
  Long countByKnowledgeBaseIdAndEnabled(@Param("knowledgeBaseId") Long knowledgeBaseId);

  /**
   * 统计知识库的总大小
   */
  @Query("SELECT COALESCE(SUM(d.size), 0) FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId")
  Long sumSizeByKnowledgeBaseId(@Param("knowledgeBaseId") Long knowledgeBaseId);

  /**
   * 根据知识库ID删除文档
   */
  void deleteByKnowledgeBaseId(Long knowledgeBaseId);

  /**
   * 根据知识库ID和文档ID列表删除文档
   */
  @Query("DELETE FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId AND d.id IN :documentIds")
  void deleteByKnowledgeBaseIdAndIdIn(@Param("knowledgeBaseId") Long knowledgeBaseId,
      @Param("documentIds") List<Long> documentIds);
}
