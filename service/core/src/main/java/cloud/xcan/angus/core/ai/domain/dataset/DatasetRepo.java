package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface DatasetRepo extends BaseRepository<Dataset, Long> {

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
  @Query("SELECT COUNT(d) FROM Dataset d")
  Long countTotalDatasets();

  /**
   * 统计活跃（被引用）数据集数（在应用中被使用的数据集）
   */
  @Query("SELECT COUNT(DISTINCT d.id) FROM Dataset d " +
      "JOIN Application app ON app.datasetId = d.id")
  Long countActiveDatasets();
}
