package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDatasourceQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class DatasetDatasourceQueryImpl implements DatasetDatasourceQuery {

  @Resource
  private DatasetRepo datasetRepo;

  @Override
  public Page<Dataset> findDatasetsWithDataSources(PageRequest pageable) {
    return datasetRepo.findDatasetsWithDataSources(pageable);
  }

  @Override
  public Page<Dataset> findDatasetsWithoutDataSources(PageRequest pageable) {
    return datasetRepo.findDatasetsWithoutDataSources(pageable);
  }

  @Override
  public Page<Dataset> findDatasetsNeedingSync(PageRequest pageable) {
    return datasetRepo.findDatasetsNeedingSync(pageable);
  }

}
