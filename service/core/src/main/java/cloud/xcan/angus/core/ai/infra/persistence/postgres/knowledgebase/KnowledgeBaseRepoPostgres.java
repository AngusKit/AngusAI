package cloud.xcan.angus.core.ai.infra.persistence.postgres.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseRepoPostgres extends KnowledgeBaseRepo {

  /**
   * 统计活跃（被引用）知识库数（在应用中被使用的知识库）
   */
  @Query(value = "SELECT COUNT(DISTINCT kb.id) FROM ai_knowledge_base kb " +
      "JOIN ai_agent agent ON CAST(kb.id AS string) = ANY(CAST(agent.knowledge_base_id AS text[]))", nativeQuery = true)
  Long countActiveKnowledgeBases();

}
