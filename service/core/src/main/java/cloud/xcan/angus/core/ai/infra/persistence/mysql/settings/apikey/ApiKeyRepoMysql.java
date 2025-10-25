package cloud.xcan.angus.core.ai.infra.persistence.mysql.settings.apikey;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyRepo;
import org.springframework.stereotype.Repository;

@Repository("apiKeyRepo")
public interface ApiKeyRepoMysql extends ApiKeyRepo {

}
