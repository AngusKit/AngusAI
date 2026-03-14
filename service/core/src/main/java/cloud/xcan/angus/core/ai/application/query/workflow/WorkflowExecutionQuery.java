package cloud.xcan.angus.core.ai.application.query.workflow;

import cloud.xcan.angus.core.ai.domain.workflow.WorkflowExecution;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.domain.Page;

/**
 * 工作流执行记录查询
 */
public interface WorkflowExecutionQuery {

  /**
   * 分页查询执行日志
   */
  Page<WorkflowExecution> findExecutionLogs(WorkflowExecutionLogFindDto dto);

  /**
   * 根据 executionId 查询
   */
  Optional<WorkflowExecution> findByExecutionId(String executionId);

  /**
   * 统计指定日期当日的执行次数
   */
  long countByDate(LocalDate date);

  /**
   * 统计指定日期当日的成功执行次数
   */
  long countSuccessByDate(LocalDate date);
}
