package cloud.xcan.angus.core.ai.infra.persistence.mysql.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetRepoMysql extends DatasetRepo {

  /**
   * 统计活跃（被引用）数据集数（在应用中被使用的数据集）
   */
  @Override
  @Query(value = "SELECT COUNT(DISTINCT d.id) FROM dataset d " +
      "JOIN application app ON JSON_CONTAINS(app.dataset_ids, CAST(d.id AS CHAR))", nativeQuery = true)
  Long countActiveDatasets();
}
