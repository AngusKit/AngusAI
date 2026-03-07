package cloud.xcan.agentx.core.model;

import dev.langchain4j.model.catalog.ModelType;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * 模型配置提供者 SPI — 由集成应用实现，从数据库等外部源加载模型配置。
 * <p>
 * 框架不再从 application.yml 中直接读取 API Key 等敏感信息， 而是通过此接口由宿主应用决定配置的加载方式（数据库、配置中心、密钥管理服务等）。
 * </p>
 * <p>
 * 模型选取规则（多个配置时）：优先选择 {@link ModelConfigDefinition#isDefaultConfig()} 为 true 的；若无默认模型，则选择
 * {@link ModelConfigDefinition#getPriority()} 最高的。
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
   * 加载默认/首选模型配置
   * <p>
   * 选取规则：若有 defaultConfig=true 则返回该配置；否则返回 priority 最高的配置。 实现类可自行实现，或调用
   * {@link #selectPreferred(List, ModelProvider)} 使用框架提供的选取逻辑。
   * </p>
   */
  Optional<ModelConfigDefinition> loadDefault();

  /**
   * 加载指定提供商的默认/首选模型配置。
   * <p>
   * 选取规则：若有 defaultConfig=true 则返回该配置；否则返回 priority 最高的配置。 实现类可自行实现，或调用
   * {@link #selectPreferred(List, ModelProvider)} 使用框架提供的选取逻辑。
   * </p>
   */
  Optional<ModelConfigDefinition> loadDefault(ModelProvider provider);

  /**
   * 加载指定提供商、指定类型的默认/首选模型配置。
   * <p>
   * 按 type 过滤：仅返回 type 匹配或为 null 的配置（null 表示兼容未设置 type 的旧数据）。 实现类可调用
   * {@link #selectPreferred(List, ModelProvider, ModelType)}。
   * </p>
   */
  default Optional<ModelConfigDefinition> loadDefault(ModelProvider provider, ModelType type) {
    return selectPreferred(loadAll(), provider, type);
  }

  /**
   * 加载指定租户的模型配置
   */
  List<ModelConfigDefinition> loadByTenant(String tenantId);

  /**
   * 从配置列表中选取指定提供商的首选模型：优先默认，其次按优先级降序。
   *
   * @param configs  候选配置列表
   * @param provider 提供商
   * @return 首选配置，若无匹配则 empty
   */
  static Optional<ModelConfigDefinition> selectPreferred(List<ModelConfigDefinition> configs,
      ModelProvider provider) {
    if (configs == null || configs.isEmpty() || provider == null) {
      return Optional.empty();
    }
    List<ModelConfigDefinition> filtered = configs.stream()
        .filter(c -> provider.equals(c.getProvider()))
        .toList();
    if (filtered.isEmpty()) {
      return Optional.empty();
    }
    // 1) 优先默认模型
    Optional<ModelConfigDefinition> defaultConfig = filtered.stream()
        .filter(ModelConfigDefinition::isDefaultConfig)
        .findFirst();
    if (defaultConfig.isPresent()) {
      return defaultConfig;
    }
    // 2) 无默认时选优先级最高的
    return filtered.stream()
        .max(Comparator.comparing(ModelConfigDefinition::getPriority,
            Comparator.nullsFirst(Comparator.naturalOrder())));
  }

  /**
   * 从配置列表中选取指定提供商、指定类型的首选模型。
   *
   * @param configs  候选配置列表
   * @param provider 提供商
   * @param type     模型类型（null 表示不过滤）
   * @return 首选配置，若无匹配则 empty
   */
  static Optional<ModelConfigDefinition> selectPreferred(List<ModelConfigDefinition> configs,
      ModelProvider provider, ModelType type) {
    if (configs == null || configs.isEmpty() || provider == null) {
      return Optional.empty();
    }
    List<ModelConfigDefinition> byProvider = configs.stream()
        .filter(c -> provider.equals(c.getProvider()))
        .toList();
    List<ModelConfigDefinition> filtered = type == null ? byProvider
        : byProvider.stream()
            .filter(c -> c.getType() == null || type.equals(c.getType()))
            .toList();
    return selectPreferred(filtered, provider);
  }
}
