package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Set;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PromptFavoritesRepo extends BaseRepository<PromptFavorites, Long> {

  @Query("SELECT pf.promptId FROM PromptFavorites pf WHERE pf.createdBy = ?1")
  Set<Long> findAllIdByCreatedBy(Long userId);

  @Modifying
  void deleteByPromptIdAndCreatedBy(Long id, Long userId);

  @Modifying
  void deleteByPromptId(Long id);
}
