package cloud.xcan.angus.core.ai.interfaces.settings.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.settings.ApiKeyCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiKeyConverter;
import cloud.xcan.angus.core.ai.application.query.settings.ApiKeyQuery;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKey;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyResource;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.ApiKeyFacade;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyCreateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyFindDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyRevokeDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ApiKeyUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyDetailVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ApiKeyListVo;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
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

  @Override
  public ApiKeyDetailVo create(ApiKeyCreateDto dto, Long userId) {
    // 执行创建命令
    ApiKey apiKey = apiKeyCmd.create(dto, userId);

    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());

    // 转换为VO
    return ApiKeyConverter.toDetailVo(apiKey, resources);
  }

  @Override
  public ApiKeyDetailVo update(Long id, ApiKeyUpdateDto dto, Long userId) {
    // 执行更新命令
    ApiKey apiKey = apiKeyCmd.update(id, dto, userId);

    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());

    // 转换为VO
    return ApiKeyConverter.toDetailVo(apiKey, resources);
  }

  @Override
  public ApiKeyDetailVo toggleStatus(Long id, Long userId) {
    // 执行切换状态命令
    ApiKey apiKey = apiKeyCmd.toggleStatus(id, userId);

    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());

    // 转换为VO
    return ApiKeyConverter.toDetailVo(apiKey, resources);
  }

  @Override
  public void revoke(Long id, ApiKeyRevokeDto dto, Long userId) {
    apiKeyCmd.revoke(id, dto, userId);
  }

  @Override
  public ApiKeyDetailVo refresh(Long id, Long userId) {
    // 执行刷新命令
    ApiKey apiKey = apiKeyCmd.refresh(id, userId);

    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());

    // 转换为VO
    return ApiKeyConverter.toDetailVo(apiKey, resources);
  }

  @Override
  public void delete(Long id, Long userId) {
    apiKeyCmd.delete(id, userId);
  }

  @Override
  public ApiKeyDetailVo getDetail(Long id, Long userId) {
    // 查询密钥详情
    ApiKey apiKey = apiKeyQuery.getDetail(id, userId);

    // 获取授权资源
    List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());

    // 转换为VO
    return ApiKeyConverter.toDetailVo(apiKey, resources);
  }

  @Override
  public Page<ApiKeyListVo> list(ApiKeyFindDto dto, Long userId) {
    // 查询列表
    Page<ApiKey> page = apiKeyQuery.list(dto, userId);

    // 转换为VO
    return page.map(apiKey -> {
      List<ApiKeyResource> resources = apiKeyQuery.getResources(apiKey.getId());
      return ApiKeyConverter.toListVo(apiKey, resources);
    });
  }

  @Override
  public Map<String, Object> validate(String apiKey) {
    return apiKeyQuery.validate(apiKey);
  }
}
