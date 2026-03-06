package cloud.xcan.agentx.infrastructure.memory;

import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * JdbcChatMemoryStore 自动配置 — 当 DataSource 存在且启用时注册 ChatMemoryStore Bean。
 * <p>
 * 配置示例：agentx.memory.jdbc.enabled=true
 * </p>
 */
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnProperty(name = "agentx.memory.jdbc.enabled", havingValue = "true")
public class JdbcChatMemoryStoreConfiguration {

  @Bean
  public ChatMemoryStore chatMemoryStore(DataSource dataSource) {
    return new JdbcChatMemoryStore(dataSource);
  }
}
