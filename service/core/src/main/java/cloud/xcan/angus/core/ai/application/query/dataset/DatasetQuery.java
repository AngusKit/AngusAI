package cloud.xcan.angus.core.ai.application.query.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatistics;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface DatasetQuery {

  /**
   * 根据ID查询数据集
   */
  Dataset findAndCheck(Long id);

  /**
   * 查询数据集列表
   */
  Page<Dataset> find(GenericSpecification<Dataset> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 检查数据集名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查数据集名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计总数据集数
   */
  Long countTotalDatasets();

  /**
   * 统计活跃（被引用）数据集数
   */
  Long countActiveDatasets();

  /**
   * 批量根据ID查询数据集 返回 Map<datasetId, Dataset>
   */
  Map<Long, Dataset> findByIds(List<Long> datasetIds);

}
