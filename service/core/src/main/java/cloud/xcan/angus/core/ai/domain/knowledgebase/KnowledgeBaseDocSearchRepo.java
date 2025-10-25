package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface KnowledgeBaseDocSearchRepo extends CustomBaseRepository<KnowledgeBaseDoc> {

}
