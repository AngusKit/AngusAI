package cloud.xcan.angus.core.ai.infra.persistence.postgres.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepoPostgres extends KnowledgeBaseDocRepo {

  @Query(value = "SELECT COUNT(DISTINCT d.id) FROM ai_knowledge_base_document d " +
      "JOIN ai_knowledge_base kb ON d.knowledge_base_id = kb.id " +
      "JOIN JOIN ai_agent agent ON CAST(kb.id AS string) = ANY(CAST(agent.knowledge_base_id AS text[]))", nativeQuery = true)
  Long countActiveFiles();

}
