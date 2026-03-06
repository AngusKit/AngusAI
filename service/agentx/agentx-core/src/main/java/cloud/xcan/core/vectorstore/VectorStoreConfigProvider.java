package cloud.xcan.core.vectorstore;

import java.util.List;
import java.util.Optional;

/**
 * 向量存储配置提供者 SPI — 由集成应用实现，从数据库等外部源加载配置。
 * <p>
 * 框架不再从 application.yml 中读取向量存储连接信息， 而是通过此接口由宿主应用决定配置的加载方式。
 * </p>
 */
public interface VectorStoreConfigProvider {

  /**
   * 加载所有可用的向量存储配置
   */
  List<VectorStoreConfigDefinition> loadAll();

  /**
   * 根据 ID 加载指定配置
   */
  Optional<VectorStoreConfigDefinition> loadById(String configId);

  /**
   * 加载指定类型的默认配置
   */
  Optional<VectorStoreConfigDefinition> loadDefault(String type);

  /**
   * 加载指定租户的向量存储配置
   */
  List<VectorStoreConfigDefinition> loadByTenant(String tenantId);
}
