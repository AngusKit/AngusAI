package cloud.xcan.angus.core.ai.infra.persistence.postgres.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeBaseDocRepoPostgres extends KnowledgeBaseDocRepo {

  @Query("SELECT COUNT(DISTINCT d.id) FROM KnowledgeBaseDoc d " +
      "JOIN KnowledgeBase kb ON d.knowledgeBaseId = kb.id " +
      "JOIN Application app ON CAST(kb.id AS string) = ANY(CAST(app.knowledgeBaseIds AS text[]))")
  Long countActiveFiles();

}
