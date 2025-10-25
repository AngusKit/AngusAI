package cloud.xcan.angus.core.ai.application.query.apikey.impl;

import cloud.xcan.angus.core.ai.application.query.apikey.ApiKeyQuery;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyRepo;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResourceRepo;
import cloud.xcan.angus.core.ai.interfaces.settings.apikey.facade.dto.ApiKeyFindDto;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * API密钥查询服务实现
 */
@Service
public class ApiKeyQueryImpl implements ApiKeyQuery {

  @Resource
  private ApiKeyRepo apiKeyRepo;

  @Resource
  private ApiKeyResourceRepo apiKeyResourceRepo;

  @Resource
  private PasswordEncoder passwordEncoder;

  @Override
  @Transactional(readOnly = true)
  public ApiKey findById(Long id) {
    return apiKeyRepo.findById(id).orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public ApiKey getDetail(Long id, Long userId) {
    return apiKeyRepo.findById(id)
        .filter(key -> key.getCreatedBy().equals(userId))
        .orElseThrow(() -> new IllegalArgumentException("API密钥不存在或无权限访问"));
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ApiKey> list(ApiKeyFindDto dto, Long userId) {
    // 构建分页参数
    Sort sort = Sort.by(
        "desc".equalsIgnoreCase(dto.getOrderSort()) ? Sort.Direction.DESC : Sort.Direction.ASC,
        dto.getOrderBy() != null ? dto.getOrderBy() : "createdAt"
    );
    Pageable pageable = PageRequest.of(dto.getPageNum() - 1, dto.getPageSize(), sort);

    // 查询
    if (dto.getKeyword() != null && !dto.getKeyword().trim().isEmpty()) {
      return apiKeyRepo.findByCreatedByAndNameContainingOrDescriptionContaining(
          userId, dto.getKeyword(), dto.getKeyword(), pageable);
    } else if (dto.getStatus() != null) {
      return apiKeyRepo.findByCreatedByAndStatus(userId, dto.getStatus(), pageable);
    } else {
      return apiKeyRepo.findByCreatedBy(userId, pageable);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public List<ApiKeyResource> getResources(Long apiKeyId) {
    return apiKeyResourceRepo.findByApiKeyId(apiKeyId);
  }

  @Override
  @Transactional
  public Map<String, Object> validate(String apiKey) {
    Map<String, Object> result = new HashMap<>();

    // 提取前缀查找
    String prefix = apiKey.substring(0, Math.min(9, apiKey.length()));
    Optional<ApiKey> keyOpt = apiKeyRepo.findByKeyPrefix(prefix);

    if (keyOpt.isEmpty()) {
      result.put("valid", false);
      result.put("message", "密钥不存在");
      return result;
    }

    ApiKey key = keyOpt.get();

    // 验证哈希值
    if (!passwordEncoder.matches(apiKey, key.getKeyHash())) {
      result.put("valid", false);
      result.put("message", "密钥无效");
      return result;
    }

    // 检查状态
    if (!key.isActive()) {
      result.put("valid", false);
      result.put("message", "密钥已禁用或已过期");
      return result;
    }

    // 更新使用统计
    apiKeyRepo.updateUsageStats(key.getId());

    result.put("valid", true);
    result.put("keyId", key.getId());
    result.put("permissions", key.getPermissions());
    result.put("rateLimit", key.getRateLimit());
    result.put("dailyLimit", key.getDailyLimit());
    result.put("ipWhitelist", key.getIpWhitelist());

    return result;
  }

  @Override
  @Transactional(readOnly = true)
  public boolean hasResourceAccess(Long apiKeyId, String resourceType, Long resourceId) {
    List<ApiKeyResource> resources = apiKeyResourceRepo.findByApiKeyIdAndResourceType(apiKeyId, resourceType);

    if (resources.isEmpty()) {
      // 没有配置授权资源，默认无权限
      return false;
    }

    // 检查是否有全部资源权限（resourceId=0）
    if (resources.stream().anyMatch(r -> r.getResourceId() == 0L)) {
      return true;
    }

    // 检查是否有指定资源权限
    return resources.stream().anyMatch(r -> r.getResourceId().equals(resourceId));
  }
}
