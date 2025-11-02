package cloud.xcan.angus.core.ai.interfaces.setting.facade;

import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyFindDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyListVo;
import java.util.Map;
import org.springframework.data.domain.Page;

/**
 * API密钥门面接口
 */
public interface ApiKeyFacade {

  /**
   * 创建API密钥
   */
  ApiKeyDetailVo create(ApiKeyCreateDto dto, Long userId);

  /**
   * 更新API密钥
   */
  ApiKeyDetailVo update(Long id, ApiKeyUpdateDto dto, Long userId);

  /**
   * 切换密钥状态
   */
  ApiKeyDetailVo toggleStatus(Long id, Long userId);

  /**
   * 撤销密钥
   */
  void revoke(Long id, ApiKeyRevokeDto dto, Long userId);

  /**
   * 刷新密钥
   */
  ApiKeyDetailVo refresh(Long id, Long userId);

  /**
   * 删除API密钥
   */
  void delete(Long id, Long userId);

  /**
   * 获取API密钥详情
   */
  ApiKeyDetailVo getDetail(Long id, Long userId);

  /**
   * 获取API密钥列表
   */
  Page<ApiKeyListVo> list(ApiKeyFindDto dto, Long userId);

  /**
   * 验证密钥
   */
  Map<String, Object> validate(String apiKey);
}
