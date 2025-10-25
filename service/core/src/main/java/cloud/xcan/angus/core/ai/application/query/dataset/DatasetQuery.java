package cloud.xcan.angus.core.ai.application.query.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface DatasetQuery {

  /**
   * 查询数据集列表
   */
  Page<Dataset> find(GenericSpecification<Dataset> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据ID查询数据集
   */
  Dataset findById(Long id);

  /**
   * 检查数据集名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查数据集名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计数据集数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的数据集数量
   */
  long countByStatus(DatasetStatus status);

  /**
   * 统计指定类型的数据集数量
   */
  long countByType(DatasetType type);

  /**
   * 统计指定可见性的数据集数量
   */
  long countByVisibility(Visibility visibility);

  /**
   * 查询活跃的数据集列表
   */
  Page<Dataset> findActiveDatasets(PageRequest pageable);

  /**
   * 查询准备中的数据集列表
   */
  Page<Dataset> findPreparingDatasets(PageRequest pageable);

  /**
   * 查询非活跃的数据集列表
   */
  Page<Dataset> findInactiveDatasets(PageRequest pageable);

  /**
   * 根据类型查询数据集列表
   */
  Page<Dataset> findByType(DatasetType type, PageRequest pageable);

  /**
   * 根据可见性查询数据集列表
   */
  Page<Dataset> findByVisibility(Visibility visibility, PageRequest pageable);

  /**
   * 查询最近创建的数据集
   */
  Page<Dataset> findRecentDatasets(PageRequest pageable);

  /**
   * 查询数据量最大的数据集
   */
  Page<Dataset> findLargestDatasets(PageRequest pageable);

  /**
   * 查询最近更新的数据集
   */
  Page<Dataset> findRecentlyUpdatedDatasets(PageRequest pageable);

  /**
   * 根据标签查询数据集列表
   */
  Page<Dataset> findByTags(String[] tags, PageRequest pageable);

  /**
   * 查询公开的数据集列表
   */
  Page<Dataset> findPublicDatasets(PageRequest pageable);

  /**
   * 查询团队共享的数据集列表
   */
  Page<Dataset> findTeamDatasets(PageRequest pageable);

  /**
   * 查询私有的数据集列表
   */
  Page<Dataset> findPrivateDatasets(PageRequest pageable);

  /**
   * 查询需要清理的数据集
   */
  Page<Dataset> findDatasetsNeedingCleanup(PageRequest pageable);

  /**
   * 查询存储空间使用最多的数据集
   */
  Page<Dataset> findDatasetsByStorageUsage(PageRequest pageable);

  /**
   * 查询失败的数据集
   */
  Page<Dataset> findFailedDatasets(PageRequest pageable);

  /**
   * 根据创建者查询数据集列表
   */
  Page<Dataset> findByCreatedBy(Long createdBy, PageRequest pageable);

  /**
   * 查询需要备份的数据集
   */
  Page<Dataset> findDatasetsNeedingBackup(PageRequest pageable);

}
