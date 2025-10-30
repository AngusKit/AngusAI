package cloud.xcan.angus.core.ai.interfaces.workflow.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowConfig;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowStatus;
import cloud.xcan.angus.core.ai.domain.workflow.WorkflowType;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowCreateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowFindDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.dto.WorkflowConfigUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowDetailVo;
import cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo.WorkflowListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.stereotype.Component;

@Component
public class WorkflowAssembler {

  /**
   * 创建DTO转领域对象
   */
  public static Workflow toDomain(WorkflowCreateDto dto) {
    Workflow workflow = new Workflow();
    workflow.setName(dto.getName());
    workflow.setDescription(dto.getDescription());
    workflow.setType(dto.getType());
    workflow.setIcon(dto.getIcon());
    workflow.setIconBg(dto.getIconBg());
    workflow.setIconColor(dto.getIconColor());

    // 设置默认状态
    workflow.setStatus(WorkflowStatus.DRAFT);
    workflow.setEnabled(true);
    workflow.setVersion("1.0.0");

    // 创建配置对象
    if (dto.getConfig() != null) {
      WorkflowConfig config = new WorkflowConfig();
      // TODO: 根据dto.getConfig()设置配置
      workflow.setConfig(config);
    }

    return workflow;
  }

  /**
   * 更新DTO转领域对象
   */
  public static Workflow updateDomain(Long id, WorkflowUpdateDto dto) {
    Workflow workflow = new Workflow();
    workflow.setId(id);
    workflow.setName(dto.getName());
    workflow.setDescription(dto.getDescription());
    workflow.setIcon(dto.getIcon());
    workflow.setIconBg(dto.getIconBg());
    workflow.setIconColor(dto.getIconColor());
    workflow.setType(dto.getType());

    return workflow;
  }

  /**
   * 配置DTO转配置对象
   */
  public static WorkflowConfig toConfig(WorkflowConfigUpdateDto dto) {
    WorkflowConfig config = new WorkflowConfig();
    // TODO: 根据dto设置配置
    return config;
  }

  /**
   * 领域对象转详情VO
   */
  public static WorkflowDetailVo toDetailVo(Workflow workflow) {
    WorkflowDetailVo vo = new WorkflowDetailVo();
    vo.setId(workflow.getId());
    vo.setName(workflow.getName());
    vo.setDescription(workflow.getDescription());
    vo.setIcon(workflow.getIcon());
    vo.setIconBg(workflow.getIconBg());
    vo.setIconColor(workflow.getIconColor());
    vo.setType(workflow.getType());
    vo.setStatus(workflow.getStatus());
    vo.setEnabled(workflow.getEnabled());
    vo.setVersion(workflow.getVersion());
    vo.setCreatedDate(workflow.getCreatedDate());
    vo.setModifiedDate(workflow.getModifiedDate());
    vo.setCreatedBy(workflow.getCreatedBy());
    vo.setConfig(workflow.getConfig());

    // 设置统计信息
    vo.setStats(buildStats(workflow));

    return vo;
  }

  /**
   * 领域对象转列表VO
   */
  public static WorkflowListVo toListVo(Workflow workflow) {
    WorkflowListVo vo = new WorkflowListVo();
    vo.setId(workflow.getId());
    vo.setName(workflow.getName());
    vo.setDescription(workflow.getDescription());
    vo.setIcon(workflow.getIcon());
    vo.setIconBg(workflow.getIconBg());
    vo.setIconColor(workflow.getIconColor());
    vo.setType(workflow.getType());
    vo.setStatus(workflow.getStatus());
    vo.setEnabled(workflow.getEnabled());
    vo.setNodesCount(workflow.getNodesCount());
    vo.setVersion(workflow.getVersion());
    vo.setCreatedDate(workflow.getCreatedDate());
    vo.setModifiedDate(workflow.getModifiedDate());

    // 设置统计信息
    vo.setStats(buildStats(workflow));

    return vo;
  }

  /**
   * 构建查询条件
   */
  public static GenericSpecification<Workflow> getSpecification(WorkflowFindDto dto) {
    GenericSpecification<Workflow> spec = new GenericSpecification<>();

    if (dto.getType() != null) {
      spec.addEqual("type", WorkflowType.valueOf(dto.getType()));
    }

    if (dto.getStatus() != null) {
      spec.addEqual("status", WorkflowStatus.valueOf(dto.getStatus()));
    }

    return spec;
  }

  /**
   * 构建统计信息
   */
  private static Object buildStats(Workflow workflow) {
    return new Object() {
      public Long totalExecutions = workflow.getTotalExecutions();
      public Long successfulExecutions = workflow.getSuccessfulExecutions();
      public Long failedExecutions = workflow.getFailedExecutions();
      public Double avgExecutionTime = workflow.getAvgExecutionTime();
      public Long lastExecutionTime = workflow.getLastExecutionTime();
      public String lastExecutionStatus = workflow.getLastExecutionStatus();
    };
  }
}
