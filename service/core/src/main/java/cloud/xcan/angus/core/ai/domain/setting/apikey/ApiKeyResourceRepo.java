package cloud.xcan.angus.core.ai.domain.setting.apikey;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * API密钥资源仓储接口
 */
@NoRepositoryBean
public interface ApiKeyResourceRepo extends BaseRepository<ApiKeyResource, Long> {

  // ==================== 查询方法 ====================

  /**
   * 根据API密钥ID查找所有授权资源
   */
  List<ApiKeyResource> findByApiKeyId(Long apiKeyId);

  /**
   * 根据API密钥ID和资源类型查找
   */
  List<ApiKeyResource> findByApiKeyIdAndResourceType(Long apiKeyId, ResourceType resourceType);

  // ==================== 修改方法 ====================

  /**
   * 检查是否有权限访问特定资源
   */
  boolean existsByApiKeyIdAndResourceTypeAndResourceIdIn(Long apiKeyId, ResourceType resourceType,
      List<Long> resourceIds);

  // ==================== 删除方法 ====================

  /**
   * 删除API密钥的所有授权资源
   */
  void deleteByApiKeyId(Long apiKeyId);
}
