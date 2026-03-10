package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.angus.core.ai.domain.model.Model;
import java.util.Optional;

public class ModelConverter {

  public static Optional<ModelConfigDefinition> toConfigDefinition(Model model) {
    if (model == null || model.getConfig() == null) {
      return Optional.empty();
    }
    ModelConfigDefinition src = model.getConfig();
    ModelConfigDefinition config = ModelConfigDefinition.builder()
        .id(String.valueOf(model.getId()))
        .provider(src.getProvider())
        .type(src.getType())
        .modelName(src.getModelName())
        .apiKey(src.getApiKey())
        .baseUrl(src.getBaseUrl())
        .temperature(src.getTemperature())
        .maxTokens(src.getMaxTokens())
        .timeoutSeconds(src.getTimeoutSeconds())
        .embeddingModelName(src.getEmbeddingModelName())
        .defaultConfig(src.isDefaultConfig())
        .priority(src.getPriority())
        .tenantId(
            model.getTenantId() != null ? String.valueOf(model.getTenantId()) : src.getTenantId())
        .extraProperties(src.getExtraProperties())
        .build();
    return Optional.of(config);
  }
}
