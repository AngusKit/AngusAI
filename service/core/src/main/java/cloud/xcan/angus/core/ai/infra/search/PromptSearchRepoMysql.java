package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class PromptSearchRepoMysql extends SimpleSearchRepository<Prompt>
    implements PromptSearchRepo {

}
