package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface KnowledgeBaseDocRepo extends BaseRepository<KnowledgeBaseDoc, Long> {

  /**
   * 检查知识库下是否存在同名文件
   */
  boolean existsByKnowledgeBaseIdAndName(Long knowledgeBaseId, String fileName);

  /**
   * 统计总文件数
   */
  @Query("SELECT COUNT(d) FROM KnowledgeBaseDoc d")
  Long countTotalFiles();

  /**
   * 统计活跃（被引用）文件数（在应用中被使用的文档）
   */
  Long countActiveFiles();

  /**
   * 统计总存储空间大小（字节）
   */
  @Query("SELECT COALESCE(SUM(d.size), 0) FROM KnowledgeBaseDoc d")
  Long sumTotalStoreSize();

  /**
   * 根据知识库ID和文档ID列表删除文档
   */
  @Modifying
  @Query("DELETE FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId = :knowledgeBaseId AND d.id IN :documentIds")
  void deleteByKnowledgeBaseIdAndIdIn(@Param("knowledgeBaseId") Long knowledgeBaseId,
      @Param("documentIds") List<Long> documentIds);

  /**
   * 按知识库ID批量统计文档数据 返回格式：List&lt;Object[]&gt; [knowledgeBaseId, documentsCount, activeDocuments,
   * totalSize, totalChunks]
   */
  @Query("SELECT d.knowledgeBaseId, COUNT(d), "
      + "SUM(CASE WHEN d.enabled = true THEN 1 ELSE 0 END), "
      + "COALESCE(SUM(d.size), 0L), COALESCE(SUM(COALESCE(d.chunks, 0)), 0) "
      + "FROM KnowledgeBaseDoc d WHERE d.knowledgeBaseId IN :ids GROUP BY d.knowledgeBaseId")
  List<Object[]> getStatsByKnowledgeBaseIds(@Param("ids") List<Long> ids);

}
