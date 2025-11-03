package cloud.xcan.angus.core.ai.interfaces.setting.facade;

import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyListVo;
import java.util.List;

/**
 * API密钥门面接口
 */
public interface ApiKeyFacade {

  /**
   * 创建API密钥
   */
  ApiKeyDetailVo create(ApiKeyCreateDto dto);

  /**
   * 撤销密钥
   */
  void revoke(Long id, ApiKeyRevokeDto dto);

  /**
   * 删除API密钥
   */
  void delete(Long id);

  /**
   * 获取API密钥详情
   */
  ApiKeyDetailVo getDetail(Long id);

  /**
   * 获取API密钥列表
   */
  List<ApiKeyListVo> list();

}
