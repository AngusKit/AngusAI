package cloud.xcan.angus.core.ai.infra.persistence.postgres.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetRepoPostgres extends DatasetRepo {

  /**
   * 统计活跃（被引用）数据集数（在应用中被使用的数据集）
   */
  @Override
  @Query(value = "SELECT COUNT(DISTINCT d.id) FROM ai_dataset d " +
      "JOIN ai_application app ON CAST(d.id AS string) = ANY(CAST(app.dataset_ids AS text[]))", nativeQuery = true)
  Long countActiveDatasets();
}
