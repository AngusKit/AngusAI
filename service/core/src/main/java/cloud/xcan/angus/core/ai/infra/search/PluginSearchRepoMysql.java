package cloud.xcan.angus.core.ai.infra.search;

import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginSearchRepo;
import cloud.xcan.angus.core.jpa.repository.SimpleSearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public class PluginSearchRepoMysql extends SimpleSearchRepository<Plugin>
    implements PluginSearchRepo {

}
