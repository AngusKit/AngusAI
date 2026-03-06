package cloud.xcan.agentx.starter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX Infrastructure 模块 Bean 集中注册。
 * <p>
 * Infrastructure 模块包含 JPA 实体、Repository、Redis 缓存等， 使用 ComponentScan 扫描以便自动发现 @Repository/@Entity
 * 等注解。
 * </p>
 */
@Configuration
@ConditionalOnClass(name = "cloud.xcan.agentx.infrastructure.persistence.AgentDefinitionRepository")
@ComponentScan(basePackages = "cloud.xcan.agentx.infrastructure")
public class InfrastructureBeansConfiguration {

}
