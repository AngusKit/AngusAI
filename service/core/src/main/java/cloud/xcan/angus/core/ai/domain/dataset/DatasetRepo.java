package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
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

}
