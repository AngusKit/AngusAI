package cloud.xcan.angus.core.ai.application.query.model;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
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
   * 获取模型统计信息
   *
   * @param dto 统计参数，包含可选的开始时间和结束时间
   * @return 统计信息VO
   */
  ModelStatisticsVo getStatistics(SimpleStatisticsDto dto);

  /**
   * 检查模型名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查模型名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

}
