package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface KnowledgeBaseRepo extends BaseRepository<KnowledgeBase, Long> {

  /**
   * 根据名称查找知识库
   */
  KnowledgeBase findByName(String name);

  /**
   * 统计总知识库数
   */
  @Query("SELECT COUNT(kb) FROM KnowledgeBase kb")
  Long countTotalKnowledgeBases();

  /**
   * 统计活跃（被引用）知识库数（在应用中被使用的知识库）
   */
  @Query("SELECT COUNT(DISTINCT kb.id) FROM KnowledgeBase kb " +
      "JOIN Application app ON app.knowledgeBaseId = kb.id")
  Long countActiveKnowledgeBases();
}
