package cloud.xcan.angus.core.ai.application.cmd.setting;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;

/**
 * API密钥命令接口
 */
public interface ApiKeyCmd {

  /**
   * 创建API密钥
   */
  ApiKey create(ApiKey dto);

  /**
   * 吊销密钥
   */
  void revoke(Long id, String reason);

  /**
   * 删除API密钥
   */
  void delete(Long id);
}
