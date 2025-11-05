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
   * 批量统计接口集下的端点数量
   * 返回 Map<collectionId, count>
   */
  Map<Long, Long> countEndpointsByCollectionIds(List<Long> collectionIds);

  /**
   * 批量统计接口集下启用的端点数量
   * 返回 Map<collectionId, enabledCount>
   */
  Map<Long, Long> countEnabledEndpointsByCollectionIds(List<Long> collectionIds);
}

