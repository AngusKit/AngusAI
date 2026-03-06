package com.agentx.starter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX Observability 模块 Bean 集中注册
 */
@Configuration
@ConditionalOnClass(name = "com.agentx.observability.metrics.AgentMetrics")
@ComponentScan(basePackages = "com.agentx.observability")
public class AgentXObservabilityBeansConfiguration {

}
