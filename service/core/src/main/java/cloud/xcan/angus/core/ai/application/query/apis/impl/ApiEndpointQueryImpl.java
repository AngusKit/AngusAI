package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

  @Override
  public Map<Long, Long> countEndpointsByCollectionIds(List<Long> collectionIds) {
    if (collectionIds == null || collectionIds.isEmpty()) {
      return new HashMap<>();
    }
    List<Object[]> results = apiEndpointRepo.countByCollectionIds(collectionIds);
    Map<Long, Long> countMap = new HashMap<>();
    for (Object[] result : results) {
      Long collectionId = (Long) result[0];
      Long count = (Long) result[1];
      countMap.put(collectionId, count);
    }
    return countMap;
  }

  @Override
  public Map<Long, Long> countEnabledEndpointsByCollectionIds(List<Long> collectionIds) {
    if (collectionIds == null || collectionIds.isEmpty()) {
      return new HashMap<>();
    }
    List<Object[]> results = apiEndpointRepo.countEnabledByCollectionIds(collectionIds);
    Map<Long, Long> countMap = new HashMap<>();
    for (Object[] result : results) {
      Long collectionId = (Long) result[0];
      Long count = (Long) result[1];
      countMap.put(collectionId, count);
    }
    return countMap;
  }

  @Override
  public Long countTotalEndpoints() {
    return apiEndpointRepo.count();
  }

  @Override
  public Long countTotalEnabledEndpoints() {
    return apiEndpointRepo.countEnabled();
  }

  @Override
  public Map<Long, ApiEndpoint> findByIds(List<Long> endpointIds) {
    if (endpointIds == null || endpointIds.isEmpty()) {
      return new HashMap<>();
    }
    List<ApiEndpoint> endpoints = apiEndpointRepo.findAllById(endpointIds);
    Map<Long, ApiEndpoint> endpointMap = new HashMap<>();
    for (ApiEndpoint endpoint : endpoints) {
      endpointMap.put(endpoint.getId(), endpoint);
    }
    return endpointMap;
  }

}

