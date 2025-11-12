package cloud.xcan.angus.core.ai.application.query.model;

import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public interface ModelCallRecordQuery {

  long countAllByFilters(Set<SearchCriteria> filters);

  <V> V sumByFilters(Class<ModelCallRecord> modelCallRecordClass,
      Class<V> doubleTotalViewClass, Set<SearchCriteria> filters, String fieldName);
}
