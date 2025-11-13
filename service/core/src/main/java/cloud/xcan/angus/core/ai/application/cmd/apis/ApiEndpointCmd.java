package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import java.util.Collection;
import java.util.Map;
import java.util.Set;

/**
 * 接口端点命令服务
 */
public interface ApiEndpointCmd {

  /**
   * 创建接口端点
   */
  ApiEndpoint create(ApiEndpoint apiEndpoint);

  /**
   * 更新接口端点
   */
  ApiEndpoint update(ApiEndpoint apiEndpoint);

  /**
   * 切换启用状态
   */
  ApiEndpoint toggleEnabled(Long id, Boolean enabled);

  /**
   * 删除接口端点
   */
  void delete(Long id);

  /**
   * 批量添加接口端点
   */
  void add(Collection<ApiEndpoint> newApis);

  /**
   * 根据接口集ID删除所有端点
   */
  void deleteByCollectionId(Long id);

  /**
   * 根据端点ID集合批量删除端点
   */
  void deleteByIds(Set<Long> ids);

  /**
   * 同步更新接口端点
   */
  void updateImportApis(Map<String, ApiEndpoint> updatedApisDbMap,
      Map<String, ApiEndpoint> openApisMap);

}

