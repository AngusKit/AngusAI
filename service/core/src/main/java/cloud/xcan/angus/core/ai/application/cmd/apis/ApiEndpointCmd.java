package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;

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
   * 删除接口端点
   */
  void delete(Long id);

  /**
   * 切换启用状态
   */
  ApiEndpoint toggleEnabled(Long id, Boolean enabled);
}

