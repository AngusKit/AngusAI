package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiEndpointCmd;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiEndpointFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointTestDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler.ApiEndpointAssembler;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointTestVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * 接口集门面服务实现
 */
@Component
public class ApiEndpointFacadeImpl implements ApiEndpointFacade {

  @Resource
  private ApiEndpointCmd apiEndpointCmd;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @NameJoin
  @Override
  public ApiEndpointVo createEndpoint(Long collectionId, ApiEndpointCreateDto dto) {
    ApiEndpoint endpoint = ApiEndpointAssembler.toCreateDomain(collectionId, dto);
    ApiEndpoint saved = apiEndpointCmd.create(endpoint);
    return ApiEndpointAssembler.toVo(saved);
  }

  @NameJoin
  @Override
  public ApiEndpointVo updateEndpoint(Long collectionId, Long endpointId,
      ApiEndpointUpdateDto dto) {
    ApiEndpoint endpoint = ApiEndpointAssembler.toUpdateDomain(endpointId, dto);
    ApiEndpoint saved = apiEndpointCmd.update(endpoint);
    return ApiEndpointAssembler.toVo(saved);
  }

  @NameJoin
  @Override
  public ApiEndpointVo toggleEndpoint(Long collectionId, Long endpointId, Boolean enabled) {
    ApiEndpoint saved = apiEndpointCmd.toggleEnabled(endpointId, enabled);
    return ApiEndpointAssembler.toVo(saved);
  }

  @Override
  public ApiEndpointTestVo testEndpoint(Long collectionId, Long endpointId,
      ApiEndpointTestDto dto) {
    // TODO: 实际测试接口端点
    ApiEndpointTestVo vo = new ApiEndpointTestVo();
    return vo;
  }

  @Override
  public void deleteEndpoint(Long collectionId, Long endpointId) {
    apiEndpointCmd.delete(endpointId);
  }

  @NameJoin
  @Override
  public ApiEndpointDetailVo getDetail(Long collectionId, Long endpointId) {
    ApiEndpoint saved = apiEndpointQuery.findAndCheck(collectionId, endpointId);
    return ApiEndpointAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public PageResult<ApiEndpointVo> listEndpoints(Long collectionId, ApiEndpointFindDto dto) {
    GenericSpecification<ApiEndpoint> spec = ApiEndpointAssembler.getSpecification(dto);
    spec.getCriteria().add(SearchCriteria.equal("collectionId", collectionId));
    Page<ApiEndpoint> page = apiEndpointQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ApiEndpointAssembler::toVo);
  }
}

