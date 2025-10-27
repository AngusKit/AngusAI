package cloud.xcan.angus.core.ai.infra.ai.model;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring AI 配置类 - 重构后的按需创建模型工厂
 */
@Configuration
@Slf4j
public class SpringAIConfig {

  /**
   * AI模型工厂Bean - 重构后的按需创建工厂
   */
  @Bean
  public ModelFactory modelFactory() {
    return new ModelFactory();
  }
}
