package cloud.xcan.angus.core.ai.application.query.model;

import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ModelQuery {

  /**
   * 查询模型并检查是否存在
   */
  Model findAndCheck(Long id);

  /**
   * 查询模型列表
   */
  Page<Model> find(GenericSpecification<Model> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 获取模型统计数据（period 可为 null，表示不按时间过滤）
   */
  ModelStats getStatistics(StatisticsPeriod period);

  /**
   * 检查模型名称是否存在
   */
  boolean existsByNameAndVersion(String name, String version);

  /**
   * 检查模型名称是否存在（排除指定ID）
   */
  boolean existsByNameAndVersionAndIdNot(String name, String version, Long id);

}
