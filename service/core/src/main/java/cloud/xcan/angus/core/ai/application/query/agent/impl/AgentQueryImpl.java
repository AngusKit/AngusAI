package cloud.xcan.angus.core.ai.application.query.agent.impl;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentRepo;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentBindingRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentQueryImpl implements AgentQuery {

  @Resource
  private AgentRepo agentRepo;

  @Resource
  private ApplicationAgentBindingRepo applicationAgentBindingRepo;

  @Override
  public Agent findAndCheck(Long id) {
    return new BizTemplate<Agent>() {
      @Override
      protected Agent process() {
        return agentRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("智能体不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<Agent> find(String keyword, AgentStatus status, InteractionMode interactionMode,
      Pageable pageable) {
    return agentRepo.find(keyword, status, interactionMode, pageable);
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
  public boolean isReferencedByApplications(Long agentId) {
    return agentId != null && applicationAgentBindingRepo.existsByAgentId(agentId);
  }

}
