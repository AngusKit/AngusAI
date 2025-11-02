package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface PromptRepo extends BaseRepository<Prompt, Long> {

  long countByCreatedBy(Long createdBy);

  long countByCategoryId(Long categoryId);

  /**
   * Batch count prompts grouped by category id to avoid N queries. Returns list of Object[] where
   * [0]=categoryId (Long), [1]=count (Long)
   */
  @Query("select p.categoryId, count(p) from Prompt p where p.categoryId in :ids group by p.categoryId")
  List<Object[]> countByCategoryIds(@Param("ids") List<Long> ids);

  boolean existsByTitle(String title);

  boolean existsByTitleAndIdNot(String title, Long id);

}
