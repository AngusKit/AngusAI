package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 接口端点查询服务实现
 */
@Service
public class ApiEndpointQueryImpl implements ApiEndpointQuery {

  @Resource
  private ApiEndpointRepo apiEndpointRepo;

  @Override
  public ApiEndpoint findAndCheck(Long id) {
    return new BizTemplate<ApiEndpoint>() {
      @Override
      protected ApiEndpoint process() {
        return apiEndpointRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("接口端点未找到", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<ApiEndpoint> find(GenericSpecification<ApiEndpoint> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<ApiEndpoint>>() {
      @Override
      protected Page<ApiEndpoint> process() {
        // 接口端点暂时不支持全文搜索，使用普通查询
        return apiEndpointRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public List<ApiEndpoint> findByCollectionId(Long collectionId) {
    return new BizTemplate<List<ApiEndpoint>>() {
      @Override
      protected List<ApiEndpoint> process() {
        return apiEndpointRepo.findByCollectionId(collectionId);
      }
    }.execute();
  }
}

