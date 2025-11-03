package cloud.xcan.angus.core.ai.application.query.setting.impl;

import cloud.xcan.angus.core.ai.application.query.setting.ApiKeyQuery;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * API密钥查询服务实现
 */
@Service
public class ApiKeyQueryImpl implements ApiKeyQuery {

  @Resource
  private ApiKeyRepo apiKeyRepo;

  @Override
  @Transactional(readOnly = true)
  public ApiKey findAndCheck(Long id) {
    return apiKeyRepo.findById(id)
        .orElseThrow(() -> ResourceNotFound.of("API密钥不存在", new Object[]{}));
  }

  @Override
  public List<ApiKey> list() {
    return new BizTemplate<List<ApiKey>>() {
      @Override
      protected List<ApiKey> process() {
        return apiKeyRepo.findAll();
      }
    }.execute();
  }

}
