package cloud.xcan.angus.core.ai.application.query.model.impl;

import cloud.xcan.angus.core.ai.application.query.model.ModelCallRecordQuery;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecordRepo;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class ModelCallRecordQueryImpl implements ModelCallRecordQuery {

  @Resource
  private ModelCallRecordRepo modelCallRecordRepo;

  @Override
  public long countAllByFilters(Set<SearchCriteria> filters) {
    return modelCallRecordRepo.countAllByFilters(filters);
  }

  @Override
  public <V> V sumByFilters(Class<ModelCallRecord> modelCallRecordClass,
      Class<V> doubleTotalViewClass, Set<SearchCriteria> filters, String fieldName) {
    return modelCallRecordRepo.sumByFilters(modelCallRecordClass, doubleTotalViewClass,
        filters, fieldName);
  }
}
