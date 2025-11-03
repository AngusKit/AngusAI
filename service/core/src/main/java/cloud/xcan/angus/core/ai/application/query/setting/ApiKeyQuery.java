package cloud.xcan.angus.core.ai.application.query.setting;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import java.util.List;

/**
 * API密钥查询服务接口
 */
public interface ApiKeyQuery {

  /**
   * 获取密钥详情
   */
  ApiKey findAndCheck(Long id);

  /**
   * 分页查询密钥列表
   */
  List<ApiKey> list();

}
