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
   * 统计知识库数量
   */
  @Query("SELECT COUNT(kb) FROM KnowledgeBase kb WHERE kb.enabled = :enabled")
  Long countByEnabled(@Param("enabled") Boolean enabled);

}
