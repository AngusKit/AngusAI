package cloud.xcan.angus.core.ai.interfaces.apis.facade;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointTestDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.SecurityConfigDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointTestVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.OpenApiExportVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 接口集门面服务接口
 */
public interface ApiCollectionFacade {

  /**
   * 创建接口集
   */
  ApiCollectionVo create(ApiCollectionCreateDto dto);

  /**
   * 更新接口集
   */
  ApiCollectionVo update(Long id, ApiCollectionUpdateDto dto);

  /**
   * 删除接口集
   */
  void delete(Long id, Boolean force);

  /**
   * 导入接口集
   */
  ApiCollectionImportVo importCollection(ApiCollectionImportDto dto);

  /**
   * 获取接口集详情
   */
  ApiCollectionVo getDetail(Long id);

  /**
   * 获取接口集列表
   */
  PageResult<ApiCollectionListVo> list(ApiCollectionFindDto dto);

  /**
   * 更新安全配置
   */
  ApiCollectionVo updateSecurity(Long id, SecurityConfigDto dto);

  /**
   * 导出OpenAPI规范
   */
  OpenApiExportVo exportOpenApi(Long id, String format, Boolean includeDisabled);

  /**
   * 获取端点列表
   */
  PageResult<ApiEndpointVo> listEndpoints(Long collectionId, ApiEndpointFindDto dto);

  /**
   * 创建端点
   */
  ApiEndpointVo createEndpoint(Long collectionId, ApiEndpointCreateDto dto);

  /**
   * 更新端点
   */
  ApiEndpointVo updateEndpoint(Long collectionId, Long endpointId, ApiEndpointUpdateDto dto);

  /**
   * 删除端点
   */
  void deleteEndpoint(Long collectionId, Long endpointId);

  /**
   * 切换端点状态
   */
  ApiEndpointVo toggleEndpoint(Long collectionId, Long endpointId, Boolean enabled);

  /**
   * 测试端点
   */
  ApiEndpointTestVo testEndpoint(Long collectionId, Long endpointId, ApiEndpointTestDto dto);
}

