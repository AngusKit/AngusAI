package cloud.xcan.angus.core.ai.infra.persistence.mysql.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseRepoMysql extends KnowledgeBaseRepo {

  /**
   * 统计活跃（被引用）知识库数（在应用中被使用的知识库）
   */
  @Query(value = "SELECT COUNT(DISTINCT kb.id) FROM knowledge_base kb " +
      "JOIN application app ON JSON_CONTAINS(app.knowledge_base_ids, CAST(kb.id AS CHAR))", nativeQuery = true)
  Long countActiveKnowledgeBases();

}
