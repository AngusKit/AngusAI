package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptCategoryRepo extends BaseRepository<PromptCategory, Long> {

  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

  long countByCreatedBy(Long createdBy);

  long countByIsSystem(Boolean isSystem);

  List<PromptCategory> findAllByOrderByOrderNumAsc();

  Page<PromptCategory> findByCreatedBy(Long createdBy, PageRequest pageable);

  Page<PromptCategory> findByIsSystem(Boolean isSystem, PageRequest pageable);

  // 新增方法
  boolean existsByNameAndParentId(String name, Long parentId);

  boolean existsByNameAndParentIdAndIdNot(String name, Long parentId, Long id);

  Integer findMaxOrderByParentId(Long parentId);

  long countByParentId(Long parentId);

  List<PromptCategory> findByParentIdOrderByOrderNum(Long parentId);

  List<PromptCategory> findAllOrderByOrderNum();

}
