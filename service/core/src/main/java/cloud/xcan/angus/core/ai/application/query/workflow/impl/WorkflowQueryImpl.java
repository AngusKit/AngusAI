package cloud.xcan.angus.core.ai.application.query.workflow.impl;

import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowRepo;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class WorkflowQueryImpl implements WorkflowQuery {

  @Resource
  private WorkflowRepo workflowRepo;

  @Resource
  private WorkflowSearchRepo workflowSearchRepo;

  @Override
  public Workflow findAndCheck(Long id) {
    return new BizTemplate<Workflow>() {
      @Override
      protected Workflow process() {
        return workflowRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("工作流「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Page<Workflow> find(GenericSpecification<Workflow> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Workflow>>() {
      @Override
      protected Page<Workflow> process() {
        return fullTextSearch
            ? workflowSearchRepo.find(spec.getCriteria(), pageable, Workflow.class, match)
            : workflowRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Workflow findById(Long workflowId) {
    return workflowRepo.findById(workflowId).orElse(null);
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
  public long count() {
    return workflowRepo.count();
  }

  @Override
  public long countByStatus(cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus status) {
    return workflowRepo.countByStatus(status);
  }
}
