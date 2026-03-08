package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;


import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentAssembler;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AgentFacadeImpl implements AgentFacade {

  @Resource
  private AgentCmd agentCmd;

  @Resource
  private AgentQuery agentQuery;

  @NameJoin
  @Override
  public AgentDetailVo create(AgentCreateDto dto) {
    Agent agent = AgentAssembler.toDomain(dto);
    Agent saved = agentCmd.create(agent);
    return AgentAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public AgentDetailVo update(Long id, AgentUpdateDto dto) {
    Agent existing = agentQuery.findAndCheck(id);
    AgentAssembler.mergeUpdate(existing, dto);
    Agent saved = agentCmd.update(existing);
    return AgentAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public AgentDetailVo updateStatus(Long id, AgentStatus status) {
    Agent updated = agentCmd.updateStatus(id, status);
    return AgentAssembler.toDetailVo(updated);
  }

  @Override
  public void delete(Long id) {
    agentCmd.delete(id);
  }

  @NameJoin
  @Override
  public AgentDetailVo getDetail(Long id) {
    Agent agent = agentQuery.findAndCheck(id);
    return AgentAssembler.toDetailVo(agent);
  }

  @NameJoin
  @Override
  public PageResult<AgentListVo> list(AgentFindDto dto) {
    GenericSpecification<Agent> spec = AgentAssembler.getSpecification(dto);
    Page<Agent> page = agentQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, AgentAssembler::toListVo);
  }
}
