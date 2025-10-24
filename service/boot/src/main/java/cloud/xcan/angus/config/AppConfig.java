package cloud.xcan.angus.config;

import cloud.xcan.angus.core.spring.condition.PrivateEditionCondition;
import cloud.xcan.angus.core.spring.filter.VueRouterFilter;
import cloud.xcan.angus.spec.thread.delay.DelayOrderQueueManager;
import feign.Logger;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

  @Bean
  @ConditionalOnMissingBean
  public Logger.Level feignLoggerLevel() {
    return Logger.Level.FULL;
  }

  @Bean
  public DelayOrderQueueManager delayOrderQueueManager() {
    return new DelayOrderQueueManager();
  }

  @Bean
  @Conditional(value = PrivateEditionCondition.class)
  public VueRouterFilter vueRouterFilter() {
    return new VueRouterFilter();
  }
}
