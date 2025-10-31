package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PluginReviewRepo extends BaseRepository<PluginReview, Long> {

  List<PluginReview> findByPluginId(Long pluginId);

  @Query("select avg(r.rating) from PluginReview r where r.pluginId = ?1")
  Double findAverageRatingByPluginId(Long pluginId);

  @Query("select count(r) from PluginReview r where r.pluginId = ?1")
  Long countByPluginId(Long pluginId);

  @Query("select count(r) from PluginReview r where r.createdDate between ?1 and ?2")
  Long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);
}
