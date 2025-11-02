package cloud.xcan.angus.core.ai.interfaces.setting.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.setting.ApiKeyCmd;
import cloud.xcan.angus.core.ai.application.query.setting.ApiKeyQuery;
import cloud.xcan.angus.core.ai.application.query.setting.ApiKeyResourceQuery;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.internal.assembler.ApiKeyAssembler;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.ApiKeyFacade;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.setting.facade.vo.ApiKeyListVo;
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
    // 查询密钥详情
    ApiKey apiKey = apiKeyQuery.findAndCheck(id);
    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyResourceQuery.getResources(apiKey.getId());
    // 转换为VO
    return ApiKeyAssembler.toDetailVo(apiKey, resources);
  }

  @NameJoin
  @Override
  public List<ApiKeyListVo> list() {
    // 查询列表
    List<ApiKey> apiKeys = apiKeyQuery.list();
    // 转换为VO
    Map<Long, List<ApiKeyResource>> resourceMap = apiKeyResourceQuery.getResourceMap();
    return apiKeys.stream().map(apiKey -> {
      List<ApiKeyResource> resources = resourceMap.get(apiKey.getId());
      return ApiKeyAssembler.toListVo(apiKey, resources);
    }).toList();
  }
}
