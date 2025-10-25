package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class DatasetQueryImpl implements DatasetQuery {

  @Resource
  private cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo datasetRepo;

  @Override
  public Page<Dataset> find(GenericSpecification<Dataset> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return datasetRepo.find(spec, pageable, fullTextSearch, match);
  }

  @Override
  public Dataset findById(Long id) {
    return datasetRepo.findById(id);
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
  public long countByCreatedBy(Long createdBy) {
    return datasetRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByStatus(DatasetStatus status) {
    return datasetRepo.countByStatus(status);
  }

  @Override
  public long countByType(DatasetType type) {
    return datasetRepo.countByType(type);
  }

  @Override
  public long countByVisibility(Visibility visibility) {
    return datasetRepo.countByVisibility(visibility);
  }

  @Override
  public Page<Dataset> findActiveDatasets(PageRequest pageable) {
    return datasetRepo.findByStatus(DatasetStatus.ACTIVE, pageable);
  }

  @Override
  public Page<Dataset> findPreparingDatasets(PageRequest pageable) {
    return datasetRepo.findByStatus(DatasetStatus.PREPARING, pageable);
  }

  @Override
  public Page<Dataset> findInactiveDatasets(PageRequest pageable) {
    return datasetRepo.findByStatus(DatasetStatus.INACTIVE, pageable);
  }

  @Override
  public Page<Dataset> findByType(DatasetType type, PageRequest pageable) {
    return datasetRepo.findByType(type, pageable);
  }

  @Override
  public Page<Dataset> findByVisibility(Visibility visibility, PageRequest pageable) {
    return datasetRepo.findByVisibility(visibility, pageable);
  }

  @Override
  public Page<Dataset> findRecentDatasets(PageRequest pageable) {
    return datasetRepo.findRecentDatasets(pageable);
  }

  @Override
  public Page<Dataset> findLargestDatasets(PageRequest pageable) {
    return datasetRepo.findLargestDatasets(pageable);
  }

  @Override
  public Page<Dataset> findRecentlyUpdatedDatasets(PageRequest pageable) {
    return datasetRepo.findRecentlyUpdatedDatasets(pageable);
  }

  @Override
  public Page<Dataset> findByTags(String[] tags, PageRequest pageable) {
    return datasetRepo.findByTags(tags, pageable);
  }

  @Override
  public Page<Dataset> findPublicDatasets(PageRequest pageable) {
    return datasetRepo.findPublicDatasets(pageable);
  }

  @Override
  public Page<Dataset> findTeamDatasets(PageRequest pageable) {
    return datasetRepo.findTeamDatasets(pageable);
  }

  @Override
  public Page<Dataset> findPrivateDatasets(PageRequest pageable) {
    return datasetRepo.findPrivateDatasets(pageable);
  }

  @Override
  public Page<Dataset> findDatasetsNeedingCleanup(PageRequest pageable) {
    return datasetRepo.findDatasetsNeedingCleanup(pageable);
  }

  @Override
  public Page<Dataset> findDatasetsByStorageUsage(PageRequest pageable) {
    return datasetRepo.findDatasetsByStorageUsage(pageable);
  }

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

  @Override
  public Page<Dataset> findFailedDatasets(PageRequest pageable) {
    return datasetRepo.findFailedDatasets(pageable);
  }

  @Override
  public Page<Dataset> findByCreatedBy(Long createdBy, PageRequest pageable) {
    return datasetRepo.findByCreatedBy(createdBy, pageable);
  }

  @Override
  public Page<Dataset> findDatasetsNeedingBackup(PageRequest pageable) {
    return datasetRepo.findDatasetsNeedingBackup(pageable);
  }
}
