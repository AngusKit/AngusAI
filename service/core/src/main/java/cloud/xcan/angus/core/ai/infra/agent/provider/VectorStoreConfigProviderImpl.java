package cloud.xcan.angus.core.ai.infra.agent.provider;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
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
        .map(this::toConfigDefinition)
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
      return vectorStoreQuery.findById(id).flatMap(this::toConfigDefinition);
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
        .map(this::toConfigDefinition)
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
  }

  private Optional<VectorStoreConfigDefinition> toConfigDefinition(VectorStore store) {
    if (store == null || store.getConfig() == null) {
      return Optional.empty();
    }
    VectorStoreConfigDefinition src = store.getConfig();
    VectorStoreType type = store.getType() != null ? store.getType() : src.getType();
    if (type == null) {
      return Optional.empty();
    }
    VectorStoreConfigDefinition config = VectorStoreConfigDefinition.builder()
        .id(String.valueOf(store.getId()))
        .type(type)
        .url(src.getUrl())
        .endpoint(src.getEndpoint())
        .apiKey(src.getApiKey())
        .host(src.getHost())
        .port(src.getPort())
        .database(src.getDatabase())
        .collectionName(src.getCollectionName())
        .username(src.getUsername())
        .password(src.getPassword())
        .dimension(src.getDimension())
        .timeout(src.getTimeout())
        .sslEnabled(src.getSslEnabled())
        .maxConnections(src.getMaxConnections())
        .namespace(src.getNamespace())
        .defaultConfig(src.isDefaultConfig())
        .tenantId(
            store.getTenantId() != null ? String.valueOf(store.getTenantId()) : src.getTenantId())
        .extraProperties(src.getExtraProperties())
        .build();
    return Optional.of(config);
  }
}
