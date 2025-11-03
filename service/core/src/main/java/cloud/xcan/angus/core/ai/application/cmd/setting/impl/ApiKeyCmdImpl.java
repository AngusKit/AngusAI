package cloud.xcan.angus.core.ai.application.cmd.setting.impl;

import cloud.xcan.angus.core.ai.application.cmd.setting.ApiKeyCmd;
import cloud.xcan.angus.core.ai.application.cmd.setting.ApiKeyResourceCmd;
import cloud.xcan.angus.core.ai.application.query.setting.ApiKeyQuery;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyRepo;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResourceRepo;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * API密钥命令实现
 */
@Service
public class ApiKeyCmdImpl extends CommCmd<ApiKey, Long> implements ApiKeyCmd {

  @Resource
  private ApiKeyRepo apiKeyRepo;

  @Resource
  private ApiKeyResourceRepo apiKeyResourceRepo;

  @Resource
  private ApiKeyResourceCmd apiKeyResourceCmd;

  @Resource
  private ApiKeyQuery apiKeyQuery;

  @Resource
  private PasswordEncoder passwordEncoder;

  @Override
  protected BaseRepository<ApiKey, Long> getRepository() {
    return apiKeyRepo;
  }

  @Override
  @Transactional
  public ApiKey create(ApiKey apiKey) {
    return new BizTemplate<ApiKey>() {
      @Override
      protected void checkParams() {
        // TODO 检查密钥配额不超过200个
      }

      @Override
      protected ApiKey process() {
        // 生成密钥
        String rawKey = generateApiKey();
        String keyHash = passwordEncoder.encode(rawKey);
        String keyPrefix = rawKey.substring(0, Math.min(15, rawKey.length()));
        apiKey.setKeyHash(keyHash);
        apiKey.setKeyPrefix(keyPrefix);
        apiKey.setStatus(ApiKeyStatus.ACTIVE);

        // 保存密钥
        insert0(apiKey);

        // 保存授权资源
        apiKeyResourceCmd.addAuthorizedResources(apiKey);
        return apiKey;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void revoke(Long id, String reason) {
    new BizTemplate<Void>() {
      ApiKey apiKeyDb;

      @Override
      protected void checkParams() {
        // 查询密钥并检查是否存在
        apiKeyDb = apiKeyQuery.findAndCheck(id);
      }

      @Override
      protected Void process() {
        apiKeyDb.setStatus(ApiKeyStatus.REVOKED);
        apiKeyDb.setRevokedAt(LocalDateTime.now());
        apiKeyDb.setRevokeReason(reason);
        apiKeyRepo.save(apiKeyDb);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // 删除授权资源
        apiKeyResourceRepo.deleteByApiKeyId(id);
        // 删除密钥
        apiKeyRepo.deleteById(id);
        return null;
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
