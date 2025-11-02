package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PromptCategoryRepo extends BaseRepository<PromptCategory, Long> {

  List<PromptCategory> findByParentIdOrderByOrderNum(Long parentId);

  @Query(value = "SELECT * FROM ai_prompt_category WHERE is_system = true or created_by = ?1 ORDER BY order_num ", nativeQuery = true)
  List<PromptCategory> findAllSystemAndCreatedBy(Long userId);

  long countByParentId(Long parentId);

  Integer findMaxOrderByParentId(Long parentId);

  boolean existsByNameAndParentId(String name, Long parentId);

  boolean existsByNameAndParentIdAndIdNot(String name, Long parentId, Long id);
}
