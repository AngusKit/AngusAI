package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import java.util.Optional;

public class VectorStoreConverter {

  public static Optional<VectorStoreConfigDefinition> toConfigDefinition(VectorStore store) {
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
