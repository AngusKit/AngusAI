package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.repository.CustomBaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PluginSearchRepo extends CustomBaseRepository<Plugin> {

}
