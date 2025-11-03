package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;

/**
 * 工作流仓储接口
 */
public interface WorkflowRepo extends BaseRepository<Workflow, Long> {

  /**
   * 根据名称检查工作流是否存在
   */
  boolean existsByName(String name);

  /**
   * 根据名称检查工作流是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);
}
