package cloud.xcan.angus.core.ai.application.cmd.setting;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyUpdateDto;

/**
 * API密钥命令接口
 */
public interface ApiKeyCmd {

  /**
   * 创建API密钥
   *
   * @param dto    创建DTO
   * @param userId 用户ID
   * @return 创建的API密钥实体（keyPrefix字段包含完整密钥）
   */
  ApiKey create(ApiKeyCreateDto dto, Long userId);

  /**
   * 更新API密钥
   *
   * @param id     密钥ID
   * @param dto    更新DTO
   * @param userId 用户ID
   * @return 更新后的API密钥实体
   */
  ApiKey update(Long id, ApiKeyUpdateDto dto, Long userId);

  /**
   * 切换密钥状态（启用/禁用）
   *
   * @param id     密钥ID
   * @param userId 用户ID
   * @return 更新后的API密钥实体
   */
  ApiKey toggleStatus(Long id, Long userId);

  /**
   * 吊销密钥
   *
   * @param id     密钥ID
   * @param dto    吊销DTO
   * @param userId 用户ID
   */
  void revoke(Long id, ApiKeyRevokeDto dto, Long userId);

  /**
   * 刷新密钥
   *
   * @param id     密钥ID
   * @param userId 用户ID
   * @return 刷新后的API密钥实体（keyPrefix字段包含新密钥）
   */
  ApiKey refresh(Long id, Long userId);

  /**
   * 删除API密钥
   *
   * @param id     密钥ID
   * @param userId 用户ID
   */
  void delete(Long id, Long userId);
}
