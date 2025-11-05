package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 接口集查询服务
 */
public interface ApiCollectionQuery {

  /**
   * 根据ID查询接口集
   */
  ApiCollection findAndCheck(Long id);

  /**
   * 分页查询接口集
   */
  Page<ApiCollection> find(GenericSpecification<ApiCollection> spec, Pageable pageable,
      boolean fullTextSearch, String[] match);
}

