package cloud.xcan.angus.core.ai.application.query.agent.impl;

import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentCountsProjection;
import cloud.xcan.angus.core.ai.domain.agent.AgentRepo;
import cloud.xcan.angus.core.ai.domain.agent.AgentSearchRepo;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentRepo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentCountVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AgentQueryImpl implements AgentQuery {

  @Resource
  private AgentRepo agentRepo;

  @Resource
  private AgentSearchRepo agentSearchRepo;

  @Resource
  private ApplicationAgentRepo applicationAgentBindingRepo;

  @Override
  public Agent findAndCheck(Long id) {
    return new BizTemplate<Agent>() {
      @Override
      protected Agent process() {
        return agentRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("智能体「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Agent findAndCheckValid(Long id) {
    return new BizTemplate<Agent>() {
      @Override
      protected Agent process() {
        Agent agent = agentRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("智能体「{0}」不存在", new Object[]{id}));
        if (!AgentStatus.ACTIVE.equals(agent.getStatus())) {
          throw ResourceNotFound.of("智能体「{0}」未发布", new Object[]{id});
        }
        return agent;
      }
    }.execute();
  }

  @Override
  public Page<Agent> find(GenericSpecification<Agent> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Agent>>() {
      @Override
      protected Page<Agent> process() {
        return fullTextSearch
            ? agentSearchRepo.find(spec.getCriteria(), pageable, Agent.class, match)
            : agentRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public AgentCountVo getCurrentUserCounts() {
    return new BizTemplate<AgentCountVo>() {
      @Override
      protected AgentCountVo process() {
        Long userId = getUserId();
        AgentCountsProjection counts = agentRepo.countByCreatedByGrouped(userId);
        return AgentCountVo.builder()
            .total(counts != null ? counts.getTotal() : 0L)
            .active(counts != null ? counts.getActive() : 0L)
            .inactive(counts != null ? counts.getInactive() : 0L)
            .build();
      }
    }.execute();
  }

  @Override
  public List<Agent> findByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      return List.of();
    }
    return agentRepo.findAllById(ids);
  }

  @Override
  public List<ApplicationAgent> findAgentByApplicationIdIn(List<Long> applicationIds) {
    return applicationAgentBindingRepo.findByApplicationIdIn(applicationIds);
  }

  @Override
  public List<Agent> findByStatus(AgentStatus status) {
    return agentRepo.findByStatus(status);
  }

  @Override
  public boolean existsByName(String name) {
    return agentRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return agentRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public boolean existsByEncoding(String encoding) {
    return agentRepo.existsByEncoding(encoding);
  }

  @Override
  public boolean existsByEncodingAndIdNot(String encoding, Long id) {
    return agentRepo.existsByEncodingAndIdNot(encoding, id);
  }

  @Override
  public boolean isReferencedByApplications(Long agentId) {
    return agentId != null && applicationAgentBindingRepo.existsByAgentId(agentId);
  }

}
