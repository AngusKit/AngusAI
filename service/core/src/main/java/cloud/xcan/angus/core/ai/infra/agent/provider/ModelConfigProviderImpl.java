package cloud.xcan.angus.core.ai.infra.agent.provider;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelConfigProvider;
import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 基于 ModelQuery 的模型配置提供者实现，供 AgentX 框架从平台模型库加载配置。
 */
public class ModelConfigProviderImpl implements ModelConfigProvider {

  private final ModelQuery modelQuery;

  public ModelConfigProviderImpl(ModelQuery modelQuery) {
    this.modelQuery = modelQuery;
  }

  @Override
  public List<ModelConfigDefinition> loadAll() {
    return modelQuery.findModelsForConfig(null).stream()
        .map(this::toConfigDefinition)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

  @Override
  public Optional<ModelConfigDefinition> loadById(String configId) {
    if (configId == null || configId.isBlank()) {
      return Optional.empty();
    }
    try {
      Long id = Long.parseLong(configId.trim());
      return modelQuery.findById(id).flatMap(this::toConfigDefinition);
    } catch (NumberFormatException e) {
      return Optional.empty();
    }
  }

  @Override
  public Optional<ModelConfigDefinition> loadDefault() {
    List<ModelConfigDefinition> all = loadAll();
    if (all.isEmpty()) {
      return Optional.empty();
    }
    Optional<ModelConfigDefinition> defaultConfig = all.stream()
        .filter(ModelConfigDefinition::isDefaultConfig)
        .findFirst();
    if (defaultConfig.isPresent()) {
      return defaultConfig;
    }
    return all.stream()
        .max(Comparator.comparing(ModelConfigDefinition::getPriority,
            Comparator.nullsFirst(Comparator.naturalOrder())));
  }

  @Override
  public Optional<ModelConfigDefinition> loadDefault(ModelProvider provider) {
    return ModelConfigProvider.selectPreferred(loadAll(), provider);
  }

  @Override
  public List<ModelConfigDefinition> loadByTenant(String tenantId) {
    return modelQuery.findModelsForConfig(tenantId).stream()
        .map(this::toConfigDefinition)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

  private Optional<ModelConfigDefinition> toConfigDefinition(Model model) {
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
