package cloud.xcan.angus.core.ai.infra.persistence.mysql.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepoMysql extends KnowledgeBaseDocRepo {

  /**
   * 统计活跃（被引用）文件数（在应用中被使用的文档）
   */
  @Query(value = "SELECT COUNT(DISTINCT d.id) FROM ai_knowledge_base_document d " +
      "JOIN ai_knowledge_base kb ON d.knowledge_base_id = kb.id " +
      "JOIN ai_application app ON JSON_CONTAINS(app.knowledge_base_ids, CAST(kb.id AS CHAR))", nativeQuery = true)
  Long countActiveFiles();

}
