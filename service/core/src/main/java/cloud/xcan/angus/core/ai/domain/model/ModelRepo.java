package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;

public interface ModelRepo extends BaseRepository<Model, Long> {

  /**
   * 检查模型名称是否存在
   */
  boolean existsByNameAndVersion(String name, String version);

  /**
   * 检查模型名称是否存在（排除指定ID）
   */
  boolean existsByNameAndVersionAndIdNot(String name, String version, Long id);

}
