package cloud.xcan.angus.core.ai.interfaces.agent.facade;

import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 智能体门面
 */
public interface AgentFacade {

  /**
   * 创建智能体
   */
  AgentDetailVo create(AgentCreateDto dto);

  /**
   * 更新智能体（部分更新）
   */
  AgentDetailVo update(Long id, AgentUpdateDto dto);

  /**
   * 发布/下线智能体
   */
  AgentDetailVo updateStatus(Long id, AgentStatus status);

  /**
   * 删除智能体
   */
  void delete(Long id);

  /**
   * 获取智能体详情
   */
  AgentDetailVo getDetail(Long id);

  /**
   * 分页查询智能体列表
   */
  PageResult<AgentListVo> list(AgentFindDto dto);

}
