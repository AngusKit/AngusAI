package com.agentx.starter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

/**
 * AgentX 自动装配配置 —— 集中管理所有模块的 Bean 实例化。
 * <p>
 * 各子模块不再使用 @Component / @Configuration 注解， 所有 Spring Bean 的创建统一由 Starter 模块控制。
 * </p>
 */
@AutoConfiguration
@EnableConfigurationProperties(AgentXProperties.class)
@Import({
    AgentXCoreBeansConfiguration.class,
    AgentXInfrastructureBeansConfiguration.class,
    AgentXObservabilityBeansConfiguration.class,
    AgentXModelProvidersConfiguration.class,
    AgentXToolsConfiguration.class,
    AgentXVectorStoreConfiguration.class
})
public class AgentXAutoConfiguration {

}
