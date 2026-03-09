package cloud.xcan.angus.core.ai.infra.agent.provider;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.application.converter.VectorStoreConverter;
import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 基于 VectorStoreQuery 的向量存储配置提供者实现，供 AgentX 框架从平台向量库加载配置。
 */
public class VectorStoreConfigProviderImpl implements VectorStoreConfigProvider {

  private final VectorStoreQuery vectorStoreQuery;

  public VectorStoreConfigProviderImpl(VectorStoreQuery vectorStoreQuery) {
    this.vectorStoreQuery = vectorStoreQuery;
  }

  @Override
  public List<VectorStoreConfigDefinition> loadAll() {
    return vectorStoreQuery.findVectorStoresForConfig(null).stream()
        .map(VectorStoreConverter::toConfigDefinition)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

  @Override
  public Optional<VectorStoreConfigDefinition> loadById(String configId) {
    if (configId == null || configId.isBlank()) {
      return Optional.empty();
    }
    try {
      Long id = Long.parseLong(configId.trim());
      return vectorStoreQuery.findById(id)
          .flatMap(VectorStoreConverter::toConfigDefinition);
    } catch (NumberFormatException e) {
      return Optional.empty();
    }
  }

  @Override
  public Optional<VectorStoreConfigDefinition> loadDefault(String type) {
    List<VectorStoreConfigDefinition> all = loadAll();
    if (all.isEmpty()) {
      return Optional.empty();
    }
    VectorStoreType filterType = VectorStoreType.fromKey(type);
    List<VectorStoreConfigDefinition> filtered = filterType == null ? all
        : all.stream().filter(c -> c.getType() != null && c.getType().equals(filterType))
            .collect(Collectors.toList());
    if (filtered.isEmpty()) {
      return Optional.empty();
    }
    Optional<VectorStoreConfigDefinition> defaultConfig = filtered.stream()
        .filter(VectorStoreConfigDefinition::isDefaultConfig)
        .findFirst();
    if (defaultConfig.isPresent()) {
      return defaultConfig;
    }
    return filtered.stream().findFirst();
  }

  @Override
  public List<VectorStoreConfigDefinition> loadByTenant(String tenantId) {
    return vectorStoreQuery.findVectorStoresForConfig(tenantId).stream()
        .map(VectorStoreConverter::toConfigDefinition)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

}
