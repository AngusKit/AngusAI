package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
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
   * 根据接口集ID查询所有端点
   */
  List<ApiEndpoint> findByCollectionId(Long collectionId);
}

