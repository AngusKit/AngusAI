package cloud.xcan.angus.core.ai.interfaces.apis.facade;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointTestDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiEndpointUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointTestVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiEndpointVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 接口集门面服务接口
 */
public interface ApiEndpointFacade {

  /**
   * 创建端点
   */
  ApiEndpointVo createEndpoint(Long collectionId, ApiEndpointCreateDto dto);

  /**
   * 更新端点
   */
  ApiEndpointVo updateEndpoint(Long collectionId, Long endpointId, ApiEndpointUpdateDto dto);

  /**
   * 切换端点状态
   */
  ApiEndpointVo toggleEndpoint(Long collectionId, Long endpointId, Boolean enabled);

  /**
   * 测试端点
   */
  ApiEndpointTestVo testEndpoint(Long collectionId, Long endpointId, ApiEndpointTestDto dto);

  /**
   * 删除端点
   */
  void deleteEndpoint(Long collectionId, Long endpointId);

  /**
   * 获取端点列表
   */
  PageResult<ApiEndpointVo> listEndpoints(Long collectionId, ApiEndpointFindDto dto);

}

