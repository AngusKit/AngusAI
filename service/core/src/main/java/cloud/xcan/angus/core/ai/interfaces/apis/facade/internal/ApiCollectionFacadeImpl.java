package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiCollectionCmd;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiCollectionFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler.ApiCollectionAssembler;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * 接口集门面服务实现
 */
@Component
public class ApiCollectionFacadeImpl implements ApiCollectionFacade {

  @Resource
  private ApiCollectionCmd apiCollectionCmd;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @NameJoin
  @Override
  public ApiCollectionDetailVo create(ApiCollectionCreateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toCreateDomain(dto);
    ApiCollection saved = apiCollectionCmd.create(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @NameJoin
  @Override
  public ApiCollectionDetailVo update(Long id, ApiCollectionUpdateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toUpdateDomain(id, dto);
    ApiCollection saved = apiCollectionCmd.update(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @Override
  public void delete(Long id, Boolean force) {
    apiCollectionCmd.delete(id, force != null ? force : false);
  }

  @NameJoin
  @Override
  public ApiCollectionDetailVo getDetail(Long id) {
    ApiCollection collection = apiCollectionQuery.findAndCheck(id);

    // 设置统计信息
    Long endpointsCount = apiEndpointQuery.countEndpointsByCollectionId(id);
    Long enabledCount = apiEndpointQuery.countEnabledEndpointsByCollectionId(id);
    collection.setEndpointsCount(endpointsCount);
    collection.setEnabledEndpointsCount(enabledCount);
    return ApiCollectionAssembler.toVo(collection);
  }

  @NameJoin
  @Override
  public PageResult<ApiCollectionListVo> list(ApiCollectionFindDto dto) {
    GenericSpecification<ApiCollection> spec = ApiCollectionAssembler.getSpecification(dto);
    Page<ApiCollection> page = apiCollectionQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));

    // 批量查询统计信息
    List<ApiCollection> collections = page.getContent();
    if (!collections.isEmpty()) {
      List<Long> collectionIds = collections.stream()
          .map(ApiCollection::getId)
          .collect(Collectors.toList());
      
      Map<Long, Long> endpointsCountMap = apiEndpointQuery.countEndpointsByCollectionIds(collectionIds);
      Map<Long, Long> enabledEndpointsCountMap = apiEndpointQuery.countEnabledEndpointsByCollectionIds(collectionIds);
      
      collections.forEach(collection -> {
        Long endpointsCount = endpointsCountMap.getOrDefault(collection.getId(), 0L);
        Long enabledCount = enabledEndpointsCountMap.getOrDefault(collection.getId(), 0L);
        collection.setEndpointsCount(endpointsCount);
        collection.setEnabledEndpointsCount(enabledCount);
      });
    }
    return buildVoPageResult(page, ApiCollectionAssembler::toListVo);
  }

  @Override
  public ApiCollectionImportVo importCollection(ApiCollectionImportDto dto) {
    ApiCollection collection = apiCollectionCmd.importCollection(dto);
    // TODO
    ApiCollectionImportVo vo = new ApiCollectionImportVo();
    return vo;
  }

  @Override
  public ResponseEntity<org.springframework.core.io.Resource> exportOpenApi(Long id,
      String format, Boolean includeDisabled, HttpServletResponse response) {
    return null; // TODO
  }
}

