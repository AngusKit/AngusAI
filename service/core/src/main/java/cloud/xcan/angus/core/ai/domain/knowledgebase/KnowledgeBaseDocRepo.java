package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
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
   * 统计总文件数
   */
  @Query("SELECT COUNT(d) FROM KnowledgeBaseDoc d")
  Long countTotalFiles();

  /**
   * 统计活跃（被引用）文件数（在应用中被使用的文档）
   */
  @Query("SELECT COUNT(DISTINCT d.id) FROM KnowledgeBaseDoc d " +
      "JOIN KnowledgeBase kb ON d.knowledgeBaseId = kb.id " +
      "JOIN Application app ON app.knowledgeBaseId = kb.id")
  Long countActiveFiles();

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

  /**
   * 统计总存储空间大小（字节）
   */
  @Query("SELECT COALESCE(SUM(d.size), 0) FROM KnowledgeBaseDoc d")
  Long sumTotalStoreSize();

  /**
   * 根据知识库ID和文档ID列表删除文档
   */
  @Query("DELETE FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId AND d.id IN :documentIds")
  void deleteByKnowledgeBaseIdAndIdIn(@Param("knowledgeBaseId") Long knowledgeBaseId,
      @Param("documentIds") List<Long> documentIds);

  /**
   * 批量统计知识库的文档数量 返回 List<Object[]>，其中 [0]=knowledgeBaseId (Long), [1]=count (Long)
   */
  @Query("SELECT d.knowledgeBaseId, COUNT(d) FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId IN :knowledgeBaseIds GROUP BY d.knowledgeBaseId")
  List<Object[]> countByKnowledgeBaseIds(@Param("knowledgeBaseIds") List<Long> knowledgeBaseIds);
}
