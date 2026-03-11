package cloud.xcan.angus.core.ai.application.query.apikey.impl;

import cloud.xcan.angus.core.ai.application.query.apikey.ApiKeyQuery;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyRepo;
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
        .orElseThrow(() -> ResourceNotFound.of("API密钥「{0}」不存在", new Object[]{id}));
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
