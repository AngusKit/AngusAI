package cloud.xcan.angus.config;

import cloud.xcan.angus.core.jpa.repository.BaseRepositoryImpl;
import cloud.xcan.angus.core.spring.condition.MySqlEnvCondition;
import cloud.xcan.angus.core.spring.condition.PostgresEnvCondition;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
public class JpaConfig {

  @EnableJpaAuditing
  @EnableTransactionManagement
  @EnableJpaRepositories(
      repositoryBaseClass = BaseRepositoryImpl.class,
      basePackages = {
          "cloud.xcan.angus.idgen.dao",
          "cloud.xcan.angus.core.ai.infra.persistence.mysql"
      })
  @Conditional(MySqlEnvCondition.class)
  protected static class JpaEnableMysqlConfiguration {

  }

  @EnableJpaAuditing
  @EnableTransactionManagement
  @EnableJpaRepositories(
      repositoryBaseClass = BaseRepositoryImpl.class,
      basePackages = {
          "cloud.xcan.angus.idgen.dao",
          "cloud.xcan.angus.core.ai.infra.persistence.postgres"
      })
  @Conditional(PostgresEnvCondition.class)
  protected static class JpaEnablePostgresConfiguration {

  }

}
