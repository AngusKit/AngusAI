package cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.workflow.ExecutionStats;
import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowExecution;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowExecutionLogFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.ExecutionLogVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import cloud.xcan.angus.spec.utils.JsonUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Set;

public class WorkflowAssembler {

  public static Workflow toDomain(WorkflowCreateDto dto) {
    Workflow workflow = new Workflow();
    workflow.setName(dto.getName());
    workflow.setDescription(dto.getDescription());
    workflow.setType(dto.getType());
    workflow.setIcon(dto.getIcon());
    workflow.setIconBg(dto.getIconBg());

    // 设置默认状态
    workflow.setStatus(WorkflowStatus.DRAFT);
    workflow.setVersion("1.0.0");
    workflow.setVisibility(Visibility.PRIVATE);

    // 创建配置对象
    if (dto.getConfig() != null) {
      WorkflowConfig config = new WorkflowConfig();
      workflow.setConfig(config);
    }
    return workflow;
  }

  public static Workflow updateDomain(Long id, WorkflowUpdateDto dto) {
    Workflow workflow = new Workflow();
    workflow.setId(id);
    workflow.setName(dto.getName());
    workflow.setDescription(dto.getDescription());
    workflow.setIcon(dto.getIcon());
    workflow.setIconBg(dto.getIconBg());
    workflow.setType(dto.getType());
    return workflow;
  }

  public static WorkflowConfig toConfig(WorkflowConfigUpdateDto dto) {
    WorkflowConfig config = new WorkflowConfig();
    if (dto.getNodes() != null && !dto.getNodes().isEmpty()) {
      config.setNodes(JsonUtils.fromJsonObject(dto.getNodes(),
          new TypeReference<List<WorkflowConfig.WorkflowNode>>() {
          }));
    }
    if (dto.getEdges() != null && !dto.getEdges().isEmpty()) {
      config.setEdges(JsonUtils.fromJsonObject(dto.getEdges(),
          new TypeReference<List<WorkflowConfig.WorkflowEdge>>() {
          }));
    }
    if (dto.getVariables() != null && !dto.getVariables().isEmpty()) {
      config.setVariables(JsonUtils.fromJsonObject(dto.getVariables(),
          new TypeReference<List<WorkflowConfig.VariableConfig>>() {
          }));
    }
    return config;
  }

  public static WorkflowDetailVo toDetailVo(Workflow workflow) {
    WorkflowDetailVo vo = new WorkflowDetailVo();
    vo.setId(workflow.getId());
    vo.setName(workflow.getName());
    vo.setDescription(workflow.getDescription());
    vo.setIcon(workflow.getIcon());
    vo.setIconBg(workflow.getIconBg());
    vo.setType(workflow.getType());
    vo.setStatus(workflow.getStatus());
    vo.setVersion(workflow.getVersion());
    vo.setCreatedDate(workflow.getCreatedDate());
    vo.setModifiedDate(workflow.getModifiedDate());
    vo.setCreatedBy(workflow.getCreatedBy());
    vo.setConfig(workflow.getConfig());

    // 设置审计信息
    vo.setTenantId(workflow.getTenantId());
    vo.setCreatedBy(workflow.getCreatedBy());
    vo.setCreatedDate(workflow.getCreatedDate());
    vo.setModifiedBy(workflow.getModifiedBy());
    vo.setModifiedDate(workflow.getModifiedDate());

    // 设置统计信息
    vo.setExecutionStats(toExecutionStats(workflow));
    return vo;
  }

  public static WorkflowListVo toListVo(Workflow workflow) {
    WorkflowListVo vo = new WorkflowListVo();
    vo.setId(workflow.getId());
    vo.setName(workflow.getName());
    vo.setDescription(workflow.getDescription());
    vo.setIcon(workflow.getIcon());
    vo.setIconBg(workflow.getIconBg());
    vo.setType(workflow.getType());
    vo.setStatus(workflow.getStatus());
    vo.setVersion(workflow.getVersion());

    // 设置审计信息
    vo.setTenantId(workflow.getTenantId());
    vo.setCreatedBy(workflow.getCreatedBy());
    vo.setCreatedDate(workflow.getCreatedDate());
    vo.setModifiedBy(workflow.getModifiedBy());
    vo.setModifiedDate(workflow.getModifiedDate());

    // 设置统计信息
    vo.setStats(toExecutionStats(workflow));
    return vo;
  }

  public static ExecutionStats toExecutionStats(Workflow workflow) {
    ExecutionStats stats = new ExecutionStats();
    stats.setTotalExecutions(workflow.getTotalExecutions());
    stats.setSuccessfulExecutions(workflow.getSuccessfulExecutions());
    stats.setFailedExecutions(workflow.getFailedExecutions());
    stats.setAvgExecutionTime(workflow.getAvgExecutionTime());
    stats.setLastExecutionTime(workflow.getLastExecutionTime());
    stats.setLastExecutionStatus(workflow.getLastExecutionStatus());
    return stats;
  }

  public static GenericSpecification<Workflow> getSpecification(WorkflowFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate")
        .orderByFields("id", "createdDate", "name", "type", "status")
        .matchSearchFields("name", "description", "tags")
        .inAndNotFields("type")
        .build();
    return new GenericSpecification<>(filters);
  }

  public static ExecutionLogVo toExecutionLogVo(WorkflowExecution ex) {
    ExecutionLogVo vo = new ExecutionLogVo();
    vo.setId(ex.getId());
    vo.setExecutionId(ex.getExecutionId());
    vo.setWorkflowId(ex.getWorkflowId());
    vo.setWorkflowName(ex.getWorkflowName());
    vo.setActivity(ex.getActivity() != null ? ex.getActivity() : "执行工作流");
    vo.setStatus(ex.getStatus());
    vo.setOperator(ex.getCreatedBy() != null ? String.valueOf(ex.getCreatedBy()) : null);
    vo.setExecutionTime(ex.getExecutionTime());
    vo.setCreatedDate(ex.getCreatedDate());
    vo.setInputs(ex.getInputs());
    vo.setOutputs(ex.getOutputs());
    vo.setError(ex.getErrorMessage());
    vo.setNodeExecutions(ex.getNodeExecutions());
    return vo;
  }

  public static ExecutionDetailVo toExecutionDetailVo(WorkflowExecution ex) {
    ExecutionDetailVo vo = new ExecutionDetailVo();
    vo.setExecutionId(ex.getExecutionId());
    vo.setWorkflowId(ex.getWorkflowId());
    vo.setWorkflowName(ex.getWorkflowName());
    vo.setStatus(ex.getStatus());
    vo.setStartedAt(ex.getStartedAt());
    vo.setCompletedAt(ex.getCompletedAt());
    vo.setExecutionTime(ex.getExecutionTime());
    vo.setInputs(ex.getInputs());
    vo.setOutputs(ex.getOutputs());
    vo.setNodeExecutions(ex.getNodeExecutions());
    vo.setError(ex.getErrorMessage());
    return vo;
  }

  public static GenericSpecification<WorkflowExecution> getExecutionLogSpecification(
      WorkflowExecutionLogFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "workflowId", "createdDate")
        .orderByFields("id", "createdDate", "startedAt")
        .matchSearchFields("workflowName", "status")
        .build();
    return new GenericSpecification<>(filters);
  }

}
