package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 接口端点查询服务
 */
public interface ApiEndpointQuery {

  /**
   * 根据ID查询端点
   */
  ApiEndpoint findAndCheck(Long id);

  /**
   * 根据接口集ID和端点ID查询端点
   */
  ApiEndpoint findAndCheck(Long collectionId, Long endpointId);

  /**
   * 分页查询端点
   */
  Page<ApiEndpoint> find(GenericSpecification<ApiEndpoint> spec, Pageable pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 统计接口集下的端点数量
   */
  Long countEndpointsByCollectionId(Long id);

  /**
   * 统计接口集下的端点数量
   */
  Long countEnabledEndpointsByCollectionId(Long id);

  /**
   * 批量统计接口集下的端点数量 返回 Map<collectionId, count>
   */
  Map<Long, Long> countEndpointsByCollectionIds(List<Long> collectionIds);

  /**
   * 批量统计接口集下启用的端点数量 返回 Map<collectionId, enabledCount>
   */
  Map<Long, Long> countEnabledEndpointsByCollectionIds(List<Long> collectionIds);

  /**
   * 统计所有接口总数
   */
  Long countTotalEndpoints();

  /**
   * 统计所有已启用的接口总数
   */
  Long countTotalEnabledEndpoints();

  /**
   * 批量根据ID查询端点 返回 Map<endpointId, ApiEndpoint>
   */
  Map<Long, ApiEndpoint> findByIds(List<Long> endpointIds);

  /**
   * 根据接口集ID查询所有端点
   */
  List<ApiEndpoint> findByCollectionId(Long collectionId);

  /**
   * 根据接口集ID和启用状态查询端点
   */
  List<ApiEndpoint> findByCollectionIdAndEnabled(Long collectionId, boolean enabled);
}

