package cloud.xcan.angus.core.ai.infra.agent;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import jakarta.annotation.Resource;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * 应用启动时，将 ACTIVE 状态的智能体批量注册到 AgentRegistry
 */
@Slf4j
@Component
public class AgentStartupListener {

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentFacade agentFacade;

  @EventListener(ApplicationReadyEvent.class)
  public void onApplicationReady() {
    try {
      List<Agent> activeAgents = agentQuery.findByStatus(AgentStatus.ACTIVE);
      for (Agent agent : activeAgents) {
        try {
          agentFacade.updateStatus(agent.getId(), AgentStatus.ACTIVE);
          log.info("Agent registered on startup: {} ({})", agent.getName(), agent.getId());
        } catch (Exception e) {
          log.warn("Failed to register agent {} on startup: {}", agent.getId(), e.getMessage());
        }
      }
    } catch (Exception e) {
      log.warn("Agent startup registration failed: {}", e.getMessage());
    }
  }
}
