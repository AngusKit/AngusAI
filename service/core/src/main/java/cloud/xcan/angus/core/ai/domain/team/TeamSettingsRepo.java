package cloud.xcan.angus.core.ai.domain.team;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface TeamSettingsRepo extends BaseRepository<TeamSettings, Long> {

}
