package cloud.xcan.angus.core.ai.infra.agent;

import cloud.xcan.agentx.core.model.ModelConfigProvider;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.infra.agent.provider.ModelConfigProviderImpl;
import cloud.xcan.angus.core.ai.infra.agent.provider.VectorStoreConfigProviderImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgentXConfiguration {

  @Bean
  public ModelConfigProvider modelConfigProvider(ModelQuery modelQuery) {
    return new ModelConfigProviderImpl(modelQuery);
  }

  public VectorStoreConfigProvider vectorStoreConfigProvider(VectorStoreQuery vectorStoreQuery){
    return new VectorStoreConfigProviderImpl(vectorStoreQuery);
  }
}
