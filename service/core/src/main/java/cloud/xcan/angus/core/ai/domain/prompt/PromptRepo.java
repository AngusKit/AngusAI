package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptRepo extends BaseRepository<Prompt, Long> {

  Page<Prompt> findByStatus(PromptStatus status, PageRequest pageable);

  Page<Prompt> findByCategoryId(Long categoryId, PageRequest pageable);

  Page<Prompt> findByIsPublic(Boolean isPublic, PageRequest pageable);

  Page<Prompt> findByCreatedBy(Long createdBy, PageRequest pageable);

  Page<Prompt> findByIsFavoriteAndCreatedBy(Boolean isFavorite, Long createdBy, PageRequest pageable);

  Page<Prompt> findRecentPrompts(PageRequest pageable);

  Page<Prompt> findTrendingPrompts(PageRequest pageable);

  Page<Prompt> findByArchivedAndCreatedBy(Boolean archived, Long createdBy, PageRequest pageable);

  long countByCreatedBy(Long createdBy);

  long countByStatus(PromptStatus status);

  long countByCategoryId(Long categoryId);

  long countByIsPublic(Boolean isPublic);

  /**
   * Batch count prompts grouped by category id to avoid N queries.
   * Returns list of Object[] where [0]=categoryId (Long), [1]=count (Long)
   */
  @Query("select p.categoryId, count(p) from Prompt p where p.categoryId in :ids group by p.categoryId")
  List<Object[]> countByCategoryIds(@Param("ids") List<Long> ids);

  boolean existsByTitle(String title);

  boolean existsByTitleAndIdNot(String title, Long id);

}
