package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 接口集查询服务实现
 */
@Service
public class ApiCollectionQueryImpl implements ApiCollectionQuery {

  @Resource
  private ApiCollectionRepo apiCollectionRepo;

  @Resource
  private ApiCollectionSearchRepo apiCollectionSearchRepo;

  @Override
  public ApiCollection findAndCheck(Long id) {
    return new BizTemplate<ApiCollection>() {
      @Override
      protected ApiCollection process() {
        return apiCollectionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("接口集未找到", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<ApiCollection> find(GenericSpecification<ApiCollection> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<ApiCollection>>() {
      @Override
      protected Page<ApiCollection> process() {
        return fullTextSearch
            ? apiCollectionSearchRepo.find(spec.getCriteria(), pageable, ApiCollection.class, match)
            : apiCollectionRepo.findAll(spec, pageable);
      }
    }.execute();
  }
}

