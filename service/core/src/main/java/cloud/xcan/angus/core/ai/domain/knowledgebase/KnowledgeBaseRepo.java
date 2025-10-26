package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@NoRepositoryBean
public interface KnowledgeBaseRepo extends BaseRepository<KnowledgeBase, Long> {

  /**
   * 根据名称查找知识库
   */
  KnowledgeBase findByName(String name);

  /**
   * 根据可见性查找知识库
   */
  List<KnowledgeBase> findByVisibility(DocumentVisibility visibility);

  /**
   * 根据启用状态查找知识库
   */
  List<KnowledgeBase> findByEnabled(Boolean enabled);

  /**
   * 统计知识库数量
   */
  @Query("SELECT COUNT(kb) FROM KnowledgeBase kb WHERE kb.enabled = :enabled")
  Long countByEnabled(@Param("enabled") Boolean enabled);

  /**
   * 获取用户的知识库列表（按创建时间倒序）
   */
  @Query("SELECT kb FROM KnowledgeBase kb ORDER BY kb.createdDate DESC")
  List<KnowledgeBase> findAllOrderByCreatedDateDesc();

  /**
   * 根据标签查找知识库
   */
  @Query("SELECT kb FROM KnowledgeBase kb WHERE JSON_CONTAINS(kb.tags, :tag)")
  List<KnowledgeBase> findByTag(@Param("tag") String tag);
}
