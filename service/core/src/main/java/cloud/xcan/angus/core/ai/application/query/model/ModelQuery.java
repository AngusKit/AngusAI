package cloud.xcan.angus.core.ai.application.query.model;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ModelQuery {

  /**
   * 根据ID查找模型
   */
  Model findById(Long id);

  /**
   * 查询模型并检查是否存在
   */
  Model findAndCheck(Long id);

  /**
   * 查询模型列表
   */
  Page<Model> find(GenericSpecification<Model> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);


  /**
   * 检查模型名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查模型名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计模型数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的模型数量
   */
  long countByStatus(ModelStatus status);

  /**
   * 统计指定类型的模型数量
   */
  long countByType(ModelType type);

  /**
   * 统计指定提供商的模型数量
   */
  long countByProvider(ModelProvider provider);

  /**
   * 查询运行中的模型列表
   */
  Page<Model> findRunningModels(PageRequest pageable);

  /**
   * 查询停止的模型列表
   */
  Page<Model> findStoppedModels(PageRequest pageable);

  /**
   * 查询部署中的模型列表
   */
  Page<Model> findDeployingModels(PageRequest pageable);

  /**
   * 根据提供商查询模型列表
   */
  Page<Model> findByProvider(ModelProvider provider, PageRequest pageable);

  /**
   * 根据类型查询模型列表
   */
  Page<Model> findByType(ModelType type, PageRequest pageable);

  /**
   * 查询最近创建的模型
   */
  Page<Model> findRecentModels(PageRequest pageable);

  /**
   * 查询调用次数最多的模型
   */
  Page<Model> findMostCalledModels(PageRequest pageable);

  /**
   * 查询成本最高的模型
   */
  Page<Model> findHighestCostModels(PageRequest pageable);

  /**
   * 根据API端点查询模型
   */
  Model findByApiEndpoint(String apiEndpoint);

  /**
   * 查询需要清理的过期模型
   */
  Page<Model> findExpiredModels(PageRequest pageable);

  /**
   * 查询配置不完整的模型
   */
  Page<Model> findIncompleteConfigModels(PageRequest pageable);

  /**
   * 查询错误状态的模型
   */
  Page<Model> findErrorModels(PageRequest pageable);

  /**
   * 根据版本查询模型列表
   */
  Page<Model> findByVersion(String version, PageRequest pageable);

  /**
   * 查询需要监控的模型
   */
  Page<Model> findModelsNeedingMonitoring(PageRequest pageable);

}
