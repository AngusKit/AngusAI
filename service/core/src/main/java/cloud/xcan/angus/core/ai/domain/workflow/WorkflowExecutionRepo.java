package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 工作流执行记录仓储
 */
public interface WorkflowExecutionRepo extends BaseRepository<WorkflowExecution, Long> {

  /**
   * 根据 executionId 查询
   */
  java.util.Optional<WorkflowExecution> findByExecutionId(String executionId);

  /**
   * 分页查询：按工作流ID、状态、创建时间筛选
   */
  Page<WorkflowExecution> findByWorkflowIdAndStatusAndCreatedDateBetween(
      Long workflowId, String status, LocalDateTime start, LocalDateTime end, Pageable pageable);

  /**
   * 分页查询：按工作流ID
   */
  Page<WorkflowExecution> findByWorkflowId(Long workflowId, Pageable pageable);

  /**
   * 分页查询：按状态
   */
  Page<WorkflowExecution> findByStatus(String status, Pageable pageable);

  /**
   * 分页查询：按工作流ID和状态
   */
  Page<WorkflowExecution> findByWorkflowIdAndStatus(Long workflowId, String status,
      Pageable pageable);

  /**
   * 统计今日执行次数（指定租户）
   */
  long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 统计今日成功执行次数
   */
  long countByStatusAndCreatedDateBetween(String status, LocalDateTime start, LocalDateTime end);
}
