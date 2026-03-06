package cloud.xcan.core.model;

import java.util.List;
import java.util.Optional;

/**
 * 模型配置提供者 SPI — 由集成应用实现，从数据库等外部源加载模型配置。
 * <p>
 * 框架不再从 application.yml 中直接读取 API Key 等敏感信息， 而是通过此接口由宿主应用决定配置的加载方式（数据库、配置中心、密钥管理服务等）。
 * </p>
 */
public interface ModelConfigProvider {

  /**
   * 加载所有可用的模型配置
   */
  List<ModelConfigDefinition> loadAll();

  /**
   * 根据 ID 加载指定模型配置
   */
  Optional<ModelConfigDefinition> loadById(String configId);

  /**
   * 加载指定提供商的默认模型配置
   */
  Optional<ModelConfigDefinition> loadDefault(String provider);

  /**
   * 加载指定租户的模型配置
   */
  List<ModelConfigDefinition> loadByTenant(String tenantId);
}
