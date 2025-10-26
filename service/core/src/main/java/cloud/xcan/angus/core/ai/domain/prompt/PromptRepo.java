package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

@Repository
public interface PromptRepo extends BaseRepository<Prompt, Long> {

  // ==================== 查询方法 ====================
  
  Page<Prompt> findByStatus(PromptStatus status, PageRequest pageable);

  Page<Prompt> findByCategoryId(Long categoryId, PageRequest pageable);

  Page<Prompt> findByIsPublic(Boolean isPublic, PageRequest pageable);

  Page<Prompt> findByCreatedBy(Long createdBy, PageRequest pageable);

  Page<Prompt> findByIsFavoriteAndCreatedBy(Boolean isFavorite, Long createdBy, PageRequest pageable);

  Page<Prompt> findRecentPrompts(PageRequest pageable);

  Page<Prompt> findTrendingPrompts(PageRequest pageable);

  Page<Prompt> findByArchivedAndCreatedBy(Boolean archived, Long createdBy, PageRequest pageable);

  // ==================== 统计方法 ====================
  
  long countByCreatedBy(Long createdBy);

  long countByStatus(PromptStatus status);

  long countByCategoryId(Long categoryId);

  long countByIsPublic(Boolean isPublic);

  // ==================== 修改方法 ====================
  
  boolean existsByTitle(String title);

  boolean existsByTitleAndIdNot(String title, Long id);

}
