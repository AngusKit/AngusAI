package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiCollectionCmd;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiCollectionFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.SecurityConfigDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler.ApiCollectionAssembler;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.OpenApiExportVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
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

  @Resource
  private ApiCollectionRepo apiCollectionRepo;

  @Override
  public ApiCollectionVo create(ApiCollectionCreateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toCreateDomain(dto);
    ApiCollection saved = apiCollectionCmd.create(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @Override
  public ApiCollectionVo update(Long id, ApiCollectionUpdateDto dto) {
    ApiCollection collection = ApiCollectionAssembler.toUpdateDomain(id, dto);
    ApiCollection saved = apiCollectionCmd.update(collection);
    return ApiCollectionAssembler.toVo(saved);
  }

  @Override
  public ApiCollectionVo updateSecurity(Long id, SecurityConfigDto dto) {
    ApiCollection saved = apiCollectionCmd.updateSecurity(id, dto);
    return ApiCollectionAssembler.toVo(saved);
  }

  @Override
  public void delete(Long id, Boolean force) {
    apiCollectionCmd.delete(id, force != null ? force : false);
  }

  @Override
  public ApiCollectionVo getDetail(Long id) {
    ApiCollection collection = apiCollectionQuery.findAndCheck(id);

    // 设置统计信息
    Long endpointsCount = apiCollectionRepo.countEndpointsByCollectionId(id);
    Long enabledCount = apiCollectionRepo.countEnabledEndpointsByCollectionId(id);
    collection.setEndpointsCount(endpointsCount);
    collection.setEnabledCount(enabledCount);

    // 获取端点列表
    List<ApiEndpoint> endpoints = apiEndpointQuery.findByCollectionId(id);
    ApiCollectionVo vo = ApiCollectionAssembler.toVo(collection);
    vo.setEndpoints(ApiCollectionAssembler.toEndpointVoList(endpoints));

    return vo;
  }

  @Override
  public PageResult<ApiCollectionListVo> list(ApiCollectionFindDto dto) {
    GenericSpecification<ApiCollection> spec = ApiCollectionAssembler.getSpecification(dto);
    Page<ApiCollection> page = apiCollectionQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));

    // 设置统计信息
    page.getContent().forEach(collection -> {
      Long endpointsCount = apiCollectionRepo.countEndpointsByCollectionId(collection.getId());
      Long enabledCount = apiCollectionRepo.countEnabledEndpointsByCollectionId(collection.getId());
      collection.setEndpointsCount(endpointsCount);
      collection.setEnabledCount(enabledCount);
    });

    return buildVoPageResult(page, ApiCollectionAssembler::toListVo);
  }

  @Override
  public ApiCollectionImportVo importCollection(ApiCollectionImportDto dto) {
    ApiCollection collection = apiCollectionCmd.importCollection(dto);

    // TODO: 实际解析文件并导入端点
    ApiCollectionImportVo vo = new ApiCollectionImportVo();
    vo.setCollectionId(collection.getId());
    vo.setName(collection.getName());
    vo.setSource(collection.getSource());

    ApiCollectionImportVo.ImportStats stats = new ApiCollectionImportVo.ImportStats();
    stats.setTotalEndpoints(0L);
    stats.setImportedEndpoints(0L);
    stats.setSkippedEndpoints(0L);
    stats.setErrors(0L);
    vo.setImportStats(stats);
    return vo;
  }

  @Override
  public OpenApiExportVo exportOpenApi(Long id, String format, Boolean includeDisabled) {
    // TODO: 实际导出OpenAPI规范
    OpenApiExportVo vo = new OpenApiExportVo();
    vo.setFormat(format != null ? format : "json");
    vo.setSpec("{}"); // TODO: 生成OpenAPI规范
    return vo;
  }

}

