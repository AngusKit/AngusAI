package cloud.xcan.angus.config;

import static org.springframework.security.crypto.factory.PasswordEncoderFactories.createDelegatingPasswordEncoder;

import cloud.xcan.angus.core.spring.condition.PrivateEditionCondition;
import cloud.xcan.angus.core.spring.filter.VueRouterFilter;
import cloud.xcan.angus.spec.thread.delay.DelayOrderQueueManager;
import feign.Logger;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

  @Bean
  @ConditionalOnMissingBean
  public Logger.Level feignLoggerLevel() {
    return Logger.Level.FULL;
  }

  @Bean
  @ConditionalOnMissingBean
  public PasswordEncoder passwordEncoder() {
    return createDelegatingPasswordEncoder();
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
