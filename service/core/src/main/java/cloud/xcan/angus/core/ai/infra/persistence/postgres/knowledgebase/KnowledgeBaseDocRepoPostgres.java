package cloud.xcan.angus.core.ai.infra.persistence.postgres.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepoPostgres extends KnowledgeBaseDocRepo {

  @Query(value = "SELECT COUNT(DISTINCT d.id) FROM knowledge_base_document d " +
      "JOIN knowledge_base kb ON d.knowledge_base_id = kb.id " +
      "JOIN application app ON CAST(kb.id AS string) = ANY(CAST(app.knowledge_base_ids AS text[]))", nativeQuery = true)
  Long countActiveFiles();

}
