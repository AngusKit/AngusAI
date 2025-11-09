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
  @Query("SELECT COUNT(DISTINCT d.id) FROM KnowledgeBaseDoc d " +
      "JOIN KnowledgeBase kb ON d.knowledgeBaseId = kb.id " +
      "JOIN Application app ON app.knowledgeBaseId = kb.id")
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

}
