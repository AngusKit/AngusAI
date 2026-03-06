package com.agentx.observability.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AgentX 指标收集器 —— 对 Agent 调用、Workflow 执行、Token 使用等进行度量
 */
public class AgentMetrics {

  private final MeterRegistry registry;
  private final ConcurrentHashMap<String, Counter> counters = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Timer> timers = new ConcurrentHashMap<>();

  public AgentMetrics(MeterRegistry registry) {
    this.registry = registry;
  }

  public void incrementAgentChatCount(String agentId) {
    getCounter("agentx.agent.chat.count", "agentId", agentId).increment();
  }

  public void recordAgentChatLatency(String agentId, Duration duration) {
    getTimer("agentx.agent.chat.latency", "agentId", agentId).record(duration);
  }

  public void incrementWorkflowExecutionCount(String workflowId, String status) {
    getCounter("agentx.workflow.execution.count", "workflowId", workflowId, "status",
        status).increment();
  }

  public void recordWorkflowLatency(String workflowId, Duration duration) {
    getTimer("agentx.workflow.execution.latency", "workflowId", workflowId).record(duration);
  }

  public void incrementTokenUsage(String model, long inputTokens, long outputTokens) {
    Counter inputCounter = getCounter("agentx.llm.tokens.input", "model", model);
    Counter outputCounter = getCounter("agentx.llm.tokens.output", "model", model);
    inputCounter.increment(inputTokens);
    outputCounter.increment(outputTokens);
  }

  public void incrementToolInvocation(String toolId, boolean success) {
    getCounter("agentx.tool.invocation.count", "toolId", toolId, "success",
        String.valueOf(success)).increment();
  }

  public void incrementGuardrailBlock(String guardrailId) {
    getCounter("agentx.guardrail.block.count", "guardrailId", guardrailId).increment();
  }

  private Counter getCounter(String name, String... tags) {
    String key = name + String.join(",", tags);
    return counters.computeIfAbsent(key, k -> Counter.builder(name).tags(tags).register(registry));
  }

  private Timer getTimer(String name, String... tags) {
    String key = name + String.join(",", tags);
    return timers.computeIfAbsent(key, k -> Timer.builder(name).tags(tags).register(registry));
  }
}
