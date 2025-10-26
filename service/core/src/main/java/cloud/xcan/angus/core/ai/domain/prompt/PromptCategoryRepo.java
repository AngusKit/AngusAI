package cloud.xcan.angus.core.ai.domain.prompt;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromptCategoryRepo extends BaseRepository<PromptCategory, Long> {

  // ==================== 查询方法 ====================
  
  List<PromptCategory> findAllByOrderByOrderNumAsc();

  Page<PromptCategory> findByCreatedBy(Long createdBy, PageRequest pageable);

  Page<PromptCategory> findByIsSystem(Boolean isSystem, PageRequest pageable);

  List<PromptCategory> findByParentIdOrderByOrderNum(Long parentId);

  List<PromptCategory> findAllOrderByOrderNum();

  // ==================== 统计方法 ====================
  
  long countByCreatedBy(Long createdBy);

  long countByIsSystem(Boolean isSystem);

  long countByParentId(Long parentId);

  Integer findMaxOrderByParentId(Long parentId);

  // ==================== 修改方法 ====================
  
  boolean existsByName(String name);

  boolean existsByNameAndIdNot(String name, Long id);

  boolean existsByNameAndParentId(String name, Long parentId);

  boolean existsByNameAndParentIdAndIdNot(String name, Long parentId, Long id);

}
