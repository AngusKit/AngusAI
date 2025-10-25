package cloud.xcan.angus.core.ai.infra.persistence.mysql.settings.apikey;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResourceRepo;
import org.springframework.stereotype.Repository;

@Repository("apiKeyResourceRepo")
public interface ApiKeyResourceRepoMysql extends ApiKeyResourceRepo {

}
