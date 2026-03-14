package cloud.xcan.angus.core.ai.application.query.workflow.impl;

import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowExecutionQuery;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowExecution;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowExecutionRepo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler.WorkflowAssembler;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class WorkflowExecutionQueryImpl implements WorkflowExecutionQuery {

  @Resource
  private WorkflowExecutionRepo workflowExecutionRepo;

  @Override
  public Page<WorkflowExecution> findExecutionLogs(WorkflowExecutionLogFindDto dto) {
    return new BizTemplate<Page<WorkflowExecution>>() {
      @Override
      protected Page<WorkflowExecution> process() {
        var spec = WorkflowAssembler.getExecutionLogSpecification(dto);
        return workflowExecutionRepo.findAll(spec, dto.tranPage());
      }
    }.execute();
  }

  @Override
  public Optional<WorkflowExecution> findByExecutionId(String executionId) {
    return new BizTemplate<Optional<WorkflowExecution>>() {
      @Override
      protected Optional<WorkflowExecution> process() {
        return workflowExecutionRepo.findByExecutionId(executionId);
      }
    }.execute();
  }

  @Override
  public long countByDate(LocalDate date) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return workflowExecutionRepo.countByCreatedDateBetween(start, end);
      }
    }.execute();
  }

  @Override
  public long countSuccessByDate(LocalDate date) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return workflowExecutionRepo.countByStatusAndCreatedDateBetween("SUCCESS", start, end);
      }
    }.execute();
  }
}
