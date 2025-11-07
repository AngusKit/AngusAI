package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface PromptFavoritesRepo extends BaseRepository<PromptFavorites, Long> {

  @Query("SELECT pf.promptId FROM PromptFavorites pf WHERE pf.createdBy = ?1")
  Set<Long> findAllIdByCreatedBy(Long userId);

  @Modifying
  void deleteByPromptIdAndCreatedBy(Long id, Long userId);

  @Modifying
  void deleteByPromptId(Long id);

  /**
   * 批量查询提示词的收藏数量。返回 list of Object[] where [0]=promptId (Long), [1]=count (Long)
   */
  @Query("select pf.promptId, count(pf) from PromptFavorites pf where pf.promptId in :ids group by pf.promptId")
  List<Object[]> countByPromptIds(@Param("ids") List<Long> ids);
}
