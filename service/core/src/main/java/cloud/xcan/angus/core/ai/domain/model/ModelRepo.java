package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;

public interface ModelRepo extends BaseRepository<Model, Long> {

  /**
   * 检查模型名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查模型名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

}
