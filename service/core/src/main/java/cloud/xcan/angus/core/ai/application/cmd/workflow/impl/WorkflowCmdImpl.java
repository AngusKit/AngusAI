package cloud.xcan.angus.core.ai.application.cmd.workflow.impl;

import cloud.xcan.angus.core.ai.application.cmd.workflow.WorkflowCmd;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowRepo;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Service
public class WorkflowCmdImpl extends CommCmd<Workflow, Long> implements WorkflowCmd {

  @Resource
  private WorkflowRepo workflowRepo;

  @Resource
  private WorkflowQuery workflowQuery;

  @Override
  @Transactional
  public Workflow create(Workflow workflow) {
    return new BizTemplate<Workflow>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (workflowQuery.existsByName(workflow.getName())) {
          throw ResourceExisted.of("工作流名称「{0}」已存在", new Object[]{workflow.getName()});
        }
      }

      @Override
      protected Workflow process() {
        insert0(workflow);
        return workflow;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Workflow update(Workflow workflow) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(workflow.getId());

        // 检查名称是否已存在（排除当前工作流）
        if (workflowQuery.existsByNameAndIdNot(workflow.getName(), workflow.getId())) {
          throw ResourceExisted.of("工作流名称「{0}」已存在", new Object[]{workflow.getName()});
        }
      }

      @Override
      protected Workflow process() {
        update(workflow, workflowDb);
        return workflowDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Workflow updateConfig(Long id, WorkflowConfig config) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        workflowDb.setConfig(config);

        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Workflow modifyVisibility(Long id, Visibility visibility) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        workflowDb.setVisibility(visibility);
        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  public Workflow execute(Long id, WorkflowExecuteDto dto) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流执行逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow start(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        workflowDb.setStatus(WorkflowStatus.RUNNING);
        workflowRepo.save(workflowDb);
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow stop(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        workflowDb.setStatus(WorkflowStatus.STOPPED);
        workflowRepo.save(workflowDb);
        return workflowDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        workflowRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Workflow clone(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow source;

      @Override
      protected void checkParams() {
        source = workflowQuery.findAndCheck(id);
      }

      @Override
      protected Workflow process() {
        String cloneName = (source.getName() == null ? "工作流" : source.getName()) + " (副本)";
        int suffix = 1;
        String uniqueName = cloneName;
        while (workflowQuery.existsByName(uniqueName)) {
          uniqueName = cloneName.replaceFirst("\\(副本\\)$", "") + " (副本" + (++suffix) + ")";
        }
        Workflow cloned = new Workflow();
        cloned.setName(uniqueName);
        cloned.setDescription(source.getDescription());
        cloned.setIcon(source.getIcon());
        cloned.setIconBg(source.getIconBg());
        cloned.setType(source.getType());
        cloned.setStatus(WorkflowStatus.DRAFT);
        cloned.setVersion("1.0.0");
        cloned.setVisibility(source.getVisibility());
        cloned.setConfig(source.getConfig());
        cloned.setTags(source.getTags());
        cloned.setTotalExecutions(0L);
        cloned.setSuccessfulExecutions(0L);
        cloned.setFailedExecutions(0L);
        cloned.setAvgExecutionTime(null);
        cloned.setLastExecutionTime(null);
        cloned.setLastExecutionStatus(null);
        insert0(cloned);
        return cloned;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Workflow, Long> getRepository() {
    return workflowRepo;
  }

}
