package cloud.xcan.angus.core.ai.application.query.workflow.impl;

import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowRepo;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class WorkflowQueryImpl implements WorkflowQuery {

  @Resource
  private WorkflowRepo workflowRepo;

  @Override
  public Page<Workflow> find(GenericSpecification<Workflow> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return workflowRepo.find(spec, pageable, fullTextSearch, match);
  }

  @Override
  public Workflow findById(Long id) {
    return workflowRepo.findById(id);
  }

  @Override
  public boolean existsByName(String name) {
    return workflowRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return workflowRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return workflowRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByStatus(WorkflowStatus status) {
    return workflowRepo.countByStatus(status);
  }

  @Override
  public long countByType(WorkflowType type) {
    return workflowRepo.countByType(type);
  }

  @Override
  public long countByEnabled(Boolean enabled) {
    return workflowRepo.countByEnabled(enabled);
  }

  @Override
  public Page<Workflow> findActiveWorkflows(PageRequest pageable) {
    return workflowRepo.findByStatus(WorkflowStatus.ACTIVE, pageable);
  }

  @Override
  public Page<Workflow> findDraftWorkflows(PageRequest pageable) {
    return workflowRepo.findByStatus(WorkflowStatus.DRAFT, pageable);
  }

  @Override
  public Page<Workflow> findArchivedWorkflows(PageRequest pageable) {
    return workflowRepo.findByStatus(WorkflowStatus.ARCHIVED, pageable);
  }

  @Override
  public Page<Workflow> findEnabledWorkflows(PageRequest pageable) {
    return workflowRepo.findByEnabled(true, pageable);
  }

  @Override
  public Page<Workflow> findDisabledWorkflows(PageRequest pageable) {
    return workflowRepo.findByEnabled(false, pageable);
  }

  @Override
  public Page<Workflow> findByType(WorkflowType type, PageRequest pageable) {
    return workflowRepo.findByType(type, pageable);
  }

  @Override
  public Page<Workflow> findRecentWorkflows(PageRequest pageable) {
    return workflowRepo.findRecentWorkflows(pageable);
  }

  @Override
  public Page<Workflow> findRecentlyModifiedWorkflows(PageRequest pageable) {
    return workflowRepo.findRecentlyModifiedWorkflows(pageable);
  }

  @Override
  public Page<Workflow> findMostCalledWorkflows(PageRequest pageable) {
    return workflowRepo.findMostCalledWorkflows(pageable);
  }

  @Override
  public Page<Workflow> findHighestSuccessRateWorkflows(PageRequest pageable) {
    return workflowRepo.findHighestSuccessRateWorkflows(pageable);
  }

  @Override
  public Page<Workflow> findRunningWorkflows(PageRequest pageable) {
    return workflowRepo.findByStatus(WorkflowStatus.RUNNING, pageable);
  }

  @Override
  public Page<Workflow> findFailedWorkflows(PageRequest pageable) {
    return workflowRepo.findByStatus(WorkflowStatus.FAILED, pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsNeedingCleanup(PageRequest pageable) {
    return workflowRepo.findWorkflowsNeedingCleanup(pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsWithExecutions(PageRequest pageable) {
    return workflowRepo.findWorkflowsWithExecutions(pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsWithoutExecutions(PageRequest pageable) {
    return workflowRepo.findWorkflowsWithoutExecutions(pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsNeedingBackup(PageRequest pageable) {
    return workflowRepo.findWorkflowsNeedingBackup(pageable);
  }

  @Override
  public Page<Workflow> findByCreatedBy(Long createdBy, PageRequest pageable) {
    return workflowRepo.findByCreatedBy(createdBy, pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsWithVersions(PageRequest pageable) {
    return workflowRepo.findWorkflowsWithVersions(pageable);
  }

  @Override
  public Page<Workflow> findWorkflowsNeedingVersionCleanup(PageRequest pageable) {
    return workflowRepo.findWorkflowsNeedingVersionCleanup(pageable);
  }

  @Override
  public Page<Workflow> findLongestExecutionTimeWorkflows(PageRequest pageable) {
    return workflowRepo.findLongestExecutionTimeWorkflows(pageable);
  }

  @Override
  public Page<Workflow> findShortestExecutionTimeWorkflows(PageRequest pageable) {
    return workflowRepo.findShortestExecutionTimeWorkflows(pageable);
  }
}
