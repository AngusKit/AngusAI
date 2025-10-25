package cloud.xcan.angus.core.ai.application.query.apikey;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.interfaces.settings.apikey.facade.dto.ApiKeyFindDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 * API密钥查询服务接口
 */
public interface ApiKeyQuery {

  /**
   * 根据ID查找密钥
   *
   * @param id 密钥ID
   * @return API密钥实体
   */
  ApiKey findById(Long id);

  /**
   * 获取密钥详情
   *
   * @param id     密钥ID
   * @param userId 用户ID
   * @return API密钥实体
   */
  ApiKey getDetail(Long id, Long userId);

  /**
   * 分页查询密钥列表
   *
   * @param dto    查询DTO
   * @param userId 用户ID
   * @return 分页结果
   */
  Page<ApiKey> list(ApiKeyFindDto dto, Long userId);

  /**
   * 获取密钥的授权资源
   *
   * @param apiKeyId 密钥ID
   * @return 授权资源列表
   */
  List<ApiKeyResource> getResources(Long apiKeyId);

  /**
   * 验证API密钥
   *
   * @param apiKey 密钥字符串
   * @return 验证结果（包含valid、keyId、permissions等信息）
   */
  Map<String, Object> validate(String apiKey);

  /**
   * 检查是否有权限访问指定资源
   *
   * @param apiKeyId     密钥ID
   * @param resourceType 资源类型
   * @param resourceId   资源ID
   * @return 是否有权限
   */
  boolean hasResourceAccess(Long apiKeyId, String resourceType, Long resourceId);
}
