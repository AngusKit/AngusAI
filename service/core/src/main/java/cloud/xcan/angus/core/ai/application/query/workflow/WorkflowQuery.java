package cloud.xcan.angus.core.ai.application.query.workflow;

import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface WorkflowQuery {

  /**
   * 查询工作流列表
   */
  Page<Workflow> find(GenericSpecification<Workflow> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据ID查询工作流
   */
  Workflow findById(Long id);

  /**
   * 检查工作流名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查工作流名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计工作流数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的工作流数量
   */
  long countByStatus(WorkflowStatus status);

  /**
   * 统计指定类型的工作流数量
   */
  long countByType(WorkflowType type);

  /**
   * 统计启用的工作流数量
   */
  long countByEnabled(Boolean enabled);

  /**
   * 查询活跃的工作流列表
   */
  Page<Workflow> findActiveWorkflows(PageRequest pageable);

  /**
   * 查询草稿状态的工作流列表
   */
  Page<Workflow> findDraftWorkflows(PageRequest pageable);

  /**
   * 查询归档的工作流列表
   */
  Page<Workflow> findArchivedWorkflows(PageRequest pageable);

  /**
   * 查询启用的工作流列表
   */
  Page<Workflow> findEnabledWorkflows(PageRequest pageable);

  /**
   * 查询禁用的工作流列表
   */
  Page<Workflow> findDisabledWorkflows(PageRequest pageable);

  /**
   * 根据类型查询工作流列表
   */
  Page<Workflow> findByType(WorkflowType type, PageRequest pageable);

  /**
   * 查询最近创建的工作流
   */
  Page<Workflow> findRecentWorkflows(PageRequest pageable);

  /**
   * 查询最近修改的工作流
   */
  Page<Workflow> findRecentlyModifiedWorkflows(PageRequest pageable);

  /**
   * 查询调用次数最多的工作流
   */
  Page<Workflow> findMostCalledWorkflows(PageRequest pageable);

  /**
   * 查询成功率最高的工作流
   */
  Page<Workflow> findHighestSuccessRateWorkflows(PageRequest pageable);

  /**
   * 查询运行中的工作流
   */
  Page<Workflow> findRunningWorkflows(PageRequest pageable);

  /**
   * 查询失败的工作流
   */
  Page<Workflow> findFailedWorkflows(PageRequest pageable);

  /**
   * 查询需要清理的工作流
   */
  Page<Workflow> findWorkflowsNeedingCleanup(PageRequest pageable);

  /**
   * 查询有执行历史的工作流
   */
  Page<Workflow> findWorkflowsWithExecutions(PageRequest pageable);

  /**
   * 查询无执行历史的工作流
   */
  Page<Workflow> findWorkflowsWithoutExecutions(PageRequest pageable);

  /**
   * 查询需要备份的工作流
   */
  Page<Workflow> findWorkflowsNeedingBackup(PageRequest pageable);

  /**
   * 根据创建者查询工作流列表
   */
  Page<Workflow> findByCreatedBy(Long createdBy, PageRequest pageable);

  /**
   * 查询有版本历史的工作流
   */
  Page<Workflow> findWorkflowsWithVersions(PageRequest pageable);

  /**
   * 查询需要版本清理的工作流
   */
  Page<Workflow> findWorkflowsNeedingVersionCleanup(PageRequest pageable);

  /**
   * 查询执行时间最长的工作流
   */
  Page<Workflow> findLongestExecutionTimeWorkflows(PageRequest pageable);

  /**
   * 查询执行时间最短的工作流
   */
  Page<Workflow> findShortestExecutionTimeWorkflows(PageRequest pageable);

}
