package com.agentx.starter;

import com.agentx.observability.metrics.AgentMetrics;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX Observability 模块 Bean 集中注册
 */
@Configuration
public class AgentXObservabilityBeansConfiguration {

  @Bean
  public AgentMetrics agentMetrics(MeterRegistry meterRegistry) {
    return new AgentMetrics(meterRegistry);
  }

}
