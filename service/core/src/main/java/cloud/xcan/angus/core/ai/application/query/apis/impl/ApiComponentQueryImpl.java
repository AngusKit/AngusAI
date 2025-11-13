package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiComponentQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentType;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ApiComponentQueryImpl implements ApiComponentQuery {

  @Resource
  private ApiComponentRepo apiComponentRepo;

  @Override
  public List<ApiComponent> findByCollectionIdAndType(Long collectionId, ApiComponentType type) {
    return apiComponentRepo.findByCollectionIdAndType(collectionId, type);
  }

}
