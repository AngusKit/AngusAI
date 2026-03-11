package cloud.xcan.angus.core.ai.domain.apikey;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * API密钥资源仓储接口
 */
@NoRepositoryBean
public interface ApiKeyResourceRepo extends BaseRepository<ApiKeyResource, Long> {

  /**
   * 根据API密钥ID查找所有授权资源
   */
  List<ApiKeyResource> findByApiKeyId(Long apiKeyId);

  /**
   * 根据API密钥ID和资源类型查找
   */
  List<ApiKeyResource> findByApiKeyIdAndResourceType(Long apiKeyId, ResourceType resourceType);

  /**
   * 删除API密钥的所有授权资源
   */
  void deleteByApiKeyId(Long apiKeyId);
}
