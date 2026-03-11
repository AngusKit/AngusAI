package cloud.xcan.angus.core.ai.interfaces.apikey.facade.impl;

import cloud.xcan.angus.core.ai.application.cmd.apikey.ApiKeyCmd;
import cloud.xcan.angus.core.ai.application.query.apikey.ApiKeyQuery;
import cloud.xcan.angus.core.ai.application.query.apikey.ApiKeyResourceQuery;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.interfaces.apikey.facade.ApiKeyFacade;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.apikey.facade.impl.assembler.ApiKeyAssembler;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo.ApiKeyListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * API密钥Facade实现类
 */
@Service
public class ApiKeyFacadeImpl implements ApiKeyFacade {

  @Resource
  private ApiKeyCmd apiKeyCmd;

  @Resource
  private ApiKeyQuery apiKeyQuery;

  @Resource
  private ApiKeyResourceQuery apiKeyResourceQuery;

  @NameJoin
  @Override
  public ApiKeyDetailVo create(ApiKeyCreateDto dto) {
    ApiKey apiKey = apiKeyCmd.create(ApiKeyAssembler.toDomain(dto));
    List<ApiKeyResource> resources = apiKeyResourceQuery.getResources(apiKey.getId());
    return ApiKeyAssembler.toDetailVo(apiKey, resources);
  }

  @Override
  public void revoke(Long id, ApiKeyRevokeDto dto) {
    apiKeyCmd.revoke(id, dto.getReason());
  }

  @Override
  public void delete(Long id) {
    apiKeyCmd.delete(id);
  }

  @NameJoin
  @Override
  public ApiKeyDetailVo getDetail(Long id) {
    ApiKey apiKey = apiKeyQuery.findAndCheck(id);
    List<ApiKeyResource> resources = apiKeyResourceQuery.getResources(apiKey.getId());
    return ApiKeyAssembler.toDetailVo(apiKey, resources);
  }

  @NameJoin
  @Override
  public List<ApiKeyListVo> list() {
    List<ApiKey> apiKeys = apiKeyQuery.list();
    Map<Long, List<ApiKeyResource>> resourceMap = apiKeyResourceQuery.getResourceMap();
    return apiKeys.stream().map(apiKey -> {
      List<ApiKeyResource> resources = resourceMap.get(apiKey.getId());
      return ApiKeyAssembler.toListVo(apiKey, resources);
    }).toList();
  }
}
