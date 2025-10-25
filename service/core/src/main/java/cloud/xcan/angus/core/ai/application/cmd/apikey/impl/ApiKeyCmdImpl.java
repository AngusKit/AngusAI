package cloud.xcan.angus.core.ai.application.cmd.apikey.impl;

import cloud.xcan.angus.core.ai.application.cmd.apikey.ApiKeyCmd;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyRepo;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResourceRepo;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyStatus;
import cloud.xcan.angus.core.ai.interfaces.settings.apikey.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.apikey.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.settings.apikey.dto.ApiKeyUpdateDto;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;

/**
 * API密钥命令实现
 */
@Component
@Biz
public class ApiKeyCmdImpl extends CommCmd<ApiKey, Long> implements ApiKeyCmd {

  @Resource
  private ApiKeyRepo apiKeyRepo;

  @Resource
  private ApiKeyResourceRepo apiKeyResourceRepo;

  @Resource
  private PasswordEncoder passwordEncoder;

  @Override
  protected BaseRepository<ApiKey, Long> getRepository() {
    return apiKeyRepo;
  }

  @Override
  @Transactional
  public ApiKey create(ApiKeyCreateDto dto, Long userId) {
    return new BizTemplate<ApiKey>() {
      @Override
      protected void checkParams() {
        // 检查密钥数量限制
        long count = apiKeyRepo.countByCreatedBy(userId);
        if (count >= 50) {
          throw new IllegalStateException("API密钥数量已达上限（50个）");
        }
      }

      @Override
      protected ApiKey process() {
        // 生成密钥
        String rawKey = generateApiKey();
        String keyHash = passwordEncoder.encode(rawKey);
        String keyPrefix = rawKey.substring(0, Math.min(15, rawKey.length()));

        // 创建实体
        ApiKey entity = new ApiKey();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setKeyHash(keyHash);
        entity.setKeyPrefix(keyPrefix);
        entity.setStatus(ApiKeyStatus.ACTIVE);
        entity.setPermissions(dto.getPermissions() != null ? dto.getPermissions() : new ArrayList<>());
        entity.setRateLimit(dto.getRateLimit() != null ? dto.getRateLimit() : 60);
        entity.setUsageCount(0L);

        // 设置过期时间
        if (dto.getExpiresInDays() != null && dto.getExpiresInDays() > 0) {
          entity.setExpiresAt(LocalDateTime.now().plusDays(dto.getExpiresInDays()));
        }

        // 保存密钥
        ApiKey saved = insert0(entity);

        // 保存授权资源
        if (dto.getAuthorizedResources() != null) {
          for (ApiKeyCreateDto.AuthorizedResourceDto resource : dto.getAuthorizedResources()) {
            if (resource.getIds() == null || resource.getIds().isEmpty()) {
              // 空数组表示全部资源
              ApiKeyResource keyResource = new ApiKeyResource();
              keyResource.setApiKeyId(saved.getId());
              keyResource.setResourceType(resource.getType());
              keyResource.setResourceId(0L);
              apiKeyResourceRepo.save(keyResource);
            } else {
              // 保存指定资源
              for (Long resourceId : resource.getIds()) {
                ApiKeyResource keyResource = new ApiKeyResource();
                keyResource.setApiKeyId(saved.getId());
                keyResource.setResourceType(resource.getType());
                keyResource.setResourceId(resourceId);
                apiKeyResourceRepo.save(keyResource);
              }
            }
          }
        }

        return saved;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ApiKey update(Long id, ApiKeyUpdateDto dto, Long userId) {
    return new BizTemplate<ApiKey>() {
      ApiKey entity;

      @Override
      protected void checkParams() {
        entity = findById(id).orElseThrow(() -> 
            ResourceNotFound.of("API密钥不存在", new Object[]{}));
        
        // 权限检查
        if (!entity.getCreatedBy().equals(userId)) {
          throw new IllegalStateException("无权限操作此API密钥");
        }
      }

      @Override
      protected ApiKey process() {
        // 更新基本信息
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPermissions(dto.getPermissions());
        entity.setRateLimit(dto.getRateLimit());

        // 更新授权资源
        if (dto.getAuthorizedResources() != null) {
          apiKeyResourceRepo.deleteByApiKeyId(id);
          
          for (ApiKeyUpdateDto.AuthorizedResourceDto resource : dto.getAuthorizedResources()) {
            if (resource.getIds() == null || resource.getIds().isEmpty()) {
              ApiKeyResource keyResource = new ApiKeyResource();
              keyResource.setApiKeyId(id);
              keyResource.setResourceType(resource.getType());
              keyResource.setResourceId(0L);
              apiKeyResourceRepo.save(keyResource);
            } else {
              for (Long resourceId : resource.getIds()) {
                ApiKeyResource keyResource = new ApiKeyResource();
                keyResource.setApiKeyId(id);
                keyResource.setResourceType(resource.getType());
                keyResource.setResourceId(resourceId);
                apiKeyResourceRepo.save(keyResource);
              }
            }
          }
        }

        return update0(entity);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id, Long userId) {
    new BizTemplate<Void>() {
      ApiKey entity;

      @Override
      protected void checkParams() {
        entity = findById(id).orElseThrow(() -> 
            ResourceNotFound.of("API密钥不存在", new Object[]{}));
        
        if (!entity.getCreatedBy().equals(userId)) {
          throw new IllegalStateException("无权限操作此API密钥");
        }
      }

      @Override
      protected Void process() {
        // 删除授权资源
        apiKeyResourceRepo.deleteByApiKeyId(id);
        
        // 删除密钥
        deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ApiKey toggleStatus(Long id, Long userId) {
    return new BizTemplate<ApiKey>() {
      ApiKey entity;

      @Override
      protected void checkParams() {
        entity = findById(id).orElseThrow(() -> 
            ResourceNotFound.of("API密钥不存在", new Object[]{}));
        
        if (!entity.getCreatedBy().equals(userId)) {
          throw new IllegalStateException("无权限操作此API密钥");
        }
      }

      @Override
      protected ApiKey process() {
        ApiKeyStatus newStatus = entity.getStatus() == ApiKeyStatus.ACTIVE 
            ? ApiKeyStatus.INACTIVE 
            : ApiKeyStatus.ACTIVE;
        entity.setStatus(newStatus);
        
        return update0(entity);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void revoke(Long id, ApiKeyRevokeDto dto, Long userId) {
    new BizTemplate<Void>() {
      ApiKey entity;

      @Override
      protected void checkParams() {
        entity = findById(id).orElseThrow(() -> 
            ResourceNotFound.of("API密钥不存在", new Object[]{}));
        
        if (!entity.getCreatedBy().equals(userId)) {
          throw new IllegalStateException("无权限操作此API密钥");
        }
      }

      @Override
      protected Void process() {
        entity.setStatus(ApiKeyStatus.REVOKED);
        entity.setRevokedAt(LocalDateTime.now());
        entity.setRevokeReason(dto.getReason());
        
        update0(entity);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ApiKey refresh(Long id, Long userId) {
    return new BizTemplate<ApiKey>() {
      ApiKey entity;

      @Override
      protected void checkParams() {
        entity = findById(id).orElseThrow(() -> 
            ResourceNotFound.of("API密钥不存在", new Object[]{}));
        
        if (!entity.getCreatedBy().equals(userId)) {
          throw new IllegalStateException("无权限操作此API密钥");
        }
      }

      @Override
      protected ApiKey process() {
        // 生成新密钥
        String rawKey = generateApiKey();
        String keyHash = passwordEncoder.encode(rawKey);
        String keyPrefix = rawKey.substring(0, Math.min(15, rawKey.length()));

        entity.setKeyHash(keyHash);
        entity.setKeyPrefix(keyPrefix);
        entity.setRefreshedAt(LocalDateTime.now());

        return update0(entity);
      }
    }.execute();
  }

  /**
   * 生成API密钥
   */
  private String generateApiKey() {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[30];
    random.nextBytes(bytes);
    return "sk-" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}
