package cloud.xcan.angus.core.ai.infra.persistence.mysql.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepoMysql extends KnowledgeBaseDocRepo {

  /**
   * 统计活跃（被引用）文件数（在应用中被使用的文档）
   */
  @Query("SELECT COUNT(DISTINCT d.id) FROM KnowledgeBaseDoc d " +
      "JOIN KnowledgeBase kb ON d.knowledgeBaseId = kb.id " +
      "JOIN Application app ON JSON_CONTAINS(app.knowledgeBaseIds, CAST(kb.id AS CHAR))")
  Long countActiveFiles();

}
