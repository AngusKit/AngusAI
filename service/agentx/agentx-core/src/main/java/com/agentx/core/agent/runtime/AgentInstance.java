package com.agentx.core.agent.runtime;

import com.agentx.core.agent.definition.AgentDefinition;
import com.agentx.core.agent.enums.AgentStatus;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Data;

/**
 * Agent 运行时实例 — 持有 AiServices 代理和运行时状态
 */
@Data
public class AgentInstance {

  private final String agentId;
  private final AgentDefinition definition;
  private AgentStatus status;
  private Object aiServiceProxy;
  private final Instant createdAt;
  private Instant lastInvokedAt;
  private final Map<String, Object> runtimeContext = new ConcurrentHashMap<>();

  public AgentInstance(AgentDefinition definition) {
    this.agentId = definition.getId();
    this.definition = definition;
    this.status = AgentStatus.CONFIGURED;
    this.createdAt = Instant.now();
  }

  public void activate() {
    this.status = AgentStatus.RUNNING;
  }

  public void pause() {
    this.status = AgentStatus.PAUSED;
  }

  public void archive() {
    this.status = AgentStatus.ARCHIVED;
  }

  public void recordInvocation() {
    this.lastInvokedAt = Instant.now();
  }

  public void putContext(String key, Object value) {
    runtimeContext.put(key, value);
  }

  @SuppressWarnings("unchecked")
  public <T> T getContext(String key) {
    return (T) runtimeContext.get(key);
  }
}
