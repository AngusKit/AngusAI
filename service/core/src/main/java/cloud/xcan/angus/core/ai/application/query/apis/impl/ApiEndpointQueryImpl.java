package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
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

  @Resource
  private ApiEndpointSearchRepo apiEndpointSearchRepo;

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
        return fullTextSearch
            ? apiEndpointSearchRepo.find(spec.getCriteria(), pageable, ApiEndpoint.class, match)
            : apiEndpointRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Long countEndpointsByCollectionId(Long collectionId) {
    return apiEndpointRepo.countByCollectionId(collectionId);
  }

  @Override
  public Long countEnabledEndpointsByCollectionId(Long collectionId) {
    return apiEndpointRepo.countEnabledByCollectionId(collectionId);
  }

}

