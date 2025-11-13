package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class DatasetQueryImpl implements DatasetQuery {

  @Resource
  private DatasetRepo datasetRepo;

  @Resource
  private DatasetSearchRepo datasetSearchRepo;

  @Override
  public Dataset findAndCheck(Long id) {
    return new BizTemplate<Dataset>() {
      @Override
      protected Dataset process() {
        return datasetRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("数据集不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<Dataset> find(GenericSpecification<Dataset> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Dataset>>() {
      @Override
      protected Page<Dataset> process() {
        return fullTextSearch
            ? datasetSearchRepo.find(spec.getCriteria(), pageable, Dataset.class, match)
            : datasetRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public boolean existsByName(String name) {
    return datasetRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return datasetRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public Long countTotalDatasets() {
    return datasetRepo.countTotalDatasets();
  }

  @Override
  public Long countActiveDatasets() {
    return datasetRepo.countActiveDatasets();
  }

  @Override
  public Map<Long, Dataset> findByIds(List<Long> datasetIds) {
    if (datasetIds == null || datasetIds.isEmpty()) {
      return new HashMap<>();
    }
    List<Dataset> datasets = datasetRepo.findAllById(datasetIds);
    return datasets.stream().collect(Collectors.toMap(Dataset::getId, ds -> ds));
  }

  @Override
  public List<Dataset> findById(List<Long> datasetIds) {
    return datasetRepo.findAllById(datasetIds);
  }

}
