package cloud.xcan.angus.core.ai.application.cmd.workflow.impl;

import cloud.xcan.angus.core.ai.application.cmd.workflow.WorkflowCmd;
import cloud.xcan.angus.core.ai.application.query.workflow.WorkflowQuery;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowRepo;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecuteDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowStopDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowToggleDto;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Component
@Biz
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
        workflowDb = workflowQuery.findById(workflow.getId());
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }

        // 检查名称是否已存在（排除当前工作流）
        if (ObjectUtils.isNotEmpty(workflow.getName())
            && workflowQuery.existsByNameAndIdNot(workflow.getName(), workflowDb.getId())) {
          throw ResourceExisted.of("工作流名称「{0}」已存在", new Object[]{workflow.getName()});
        }
      }

      @Override
      protected Workflow process() {
        CoreUtils.copyPropertiesIgnoreNull(workflow, workflowDb);
        return workflowRepo.save(workflowDb);
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
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        workflowDb.setConfig(config);
        // 更新节点和连线数量
        if (config.getNodes() != null) {
          workflowDb.setNodesCount(config.getNodes().size());
        }
        if (config.getEdges() != null) {
          workflowDb.setEdgesCount(config.getEdges().size());
        }
        return workflowRepo.save(workflowDb);
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
  public Workflow duplicate(Long id, String name) {
    return new BizTemplate<Workflow>() {
      Workflow sourceWorkflow;

      @Override
      protected void checkParams() {
        // 获取源工作流并检查是否存在
        sourceWorkflow = workflowQuery.findById(id);
        if (sourceWorkflow == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流复制逻辑
        return sourceWorkflow;
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
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流执行逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow stop(Long id, WorkflowStopDto dto) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流停止逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow toggle(Long id, WorkflowToggleDto dto) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        workflowDb.setEnabled(dto.getEnabled());
        if (dto.getEnabled()) {
          workflowDb.setStatus(WorkflowStatus.ACTIVE);
        } else {
          workflowDb.setStatus(WorkflowStatus.PAUSED);
        }
        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  public Workflow createVersion(Long id, String description) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现版本创建逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow restoreVersion(Long id, Long versionId) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现版本恢复逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public boolean validateConfig(WorkflowConfig config) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现配置验证逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public boolean checkDependencies(Long id) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现依赖检查逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public void cleanupResources(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现资源清理逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public Workflow updateStatus(Long id, String status) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        workflowDb.setStatus(WorkflowStatus.valueOf(status));
        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  public void recordExecution(Long id, String executionId, String status, Long executionTime) {
    new BizTemplate<Void>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        workflowDb.setTotalExecutions(workflowDb.getTotalExecutions() + 1);
        workflowDb.setLastExecutionTime(System.currentTimeMillis());
        workflowDb.setLastExecutionStatus(status);
        
        if ("success".equals(status)) {
          workflowDb.setSuccessfulExecutions(workflowDb.getSuccessfulExecutions() + 1);
          workflowDb.setConsecutiveFailures(0);
        } else if ("failed".equals(status)) {
          workflowDb.setFailedExecutions(workflowDb.getFailedExecutions() + 1);
          workflowDb.setConsecutiveFailures(workflowDb.getConsecutiveFailures() + 1);
        }
        
        // 更新平均执行时间
        if (executionTime != null) {
          Long totalTime = workflowDb.getTotalExecutions() * workflowDb.getAvgExecutionTime().longValue();
          workflowDb.setAvgExecutionTime((double) (totalTime + executionTime) / workflowDb.getTotalExecutions());
        }
        
        workflowRepo.save(workflowDb);
        return null;
      }
    }.execute();
  }

  @Override
  public void updateStatistics(Long id, Long totalExecutions, Long successfulExecutions, 
      Long failedExecutions, Double avgExecutionTime) {
    new BizTemplate<Void>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        workflowDb.setTotalExecutions(totalExecutions);
        workflowDb.setSuccessfulExecutions(successfulExecutions);
        workflowDb.setFailedExecutions(failedExecutions);
        workflowDb.setAvgExecutionTime(avgExecutionTime);
        workflowRepo.save(workflowDb);
        return null;
      }
    }.execute();
  }

  @Override
  public Workflow backupWorkflow(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流备份逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow restoreWorkflow(Long id, String backupId) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现工作流恢复逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public void batchOperation(Long[] ids, String operation) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现批量操作逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public Workflow archiveWorkflow(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        workflowDb.setArchived(true);
        workflowDb.setArchivedAt(System.currentTimeMillis());
        workflowDb.setStatus(WorkflowStatus.ARCHIVED);
        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  public Workflow unarchiveWorkflow(Long id) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        workflowDb.setArchived(false);
        workflowDb.setArchivedAt(null);
        workflowDb.setStatus(WorkflowStatus.ACTIVE);
        return workflowRepo.save(workflowDb);
      }
    }.execute();
  }

  @Override
  public boolean validateNodeConnections(WorkflowConfig config) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现节点连接验证逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public boolean checkCircularDependencies(WorkflowConfig config) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现循环依赖检查逻辑
        return false;
      }
    }.execute();
  }

  @Override
  public boolean checkRequiredNodes(WorkflowConfig config) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现必需节点检查逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public String generateVersionNumber(Long id) {
    return new BizTemplate<String>() {
      @Override
      protected String process() {
        // TODO: 实现版本号生成逻辑
        return "1.0.0";
      }
    }.execute();
  }

  @Override
  public void cleanupExpiredVersions(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现过期版本清理逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public void cleanupExpiredExecutions(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现过期执行日志清理逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public Workflow pauseExecution(Long id, String executionId) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现执行暂停逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public Workflow resumeExecution(Long id, String executionId) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现执行恢复逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  public String getExecutionStatus(Long id, String executionId) {
    return new BizTemplate<String>() {
      @Override
      protected String process() {
        // TODO: 实现执行状态获取逻辑
        return "running";
      }
    }.execute();
  }

  @Override
  public Workflow cancelExecution(Long id, String executionId) {
    return new BizTemplate<Workflow>() {
      Workflow workflowDb;

      @Override
      protected void checkParams() {
        // 获取工作流并验证是否存在
        workflowDb = workflowQuery.findById(id);
        if (workflowDb == null) {
          throw ResourceNotFound.of("工作流不存在", new Object[]{});
        }
      }

      @Override
      protected Workflow process() {
        // TODO: 实现执行取消逻辑
        return workflowDb;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Workflow, Long> getRepository() {
    return workflowRepo;
  }
}
