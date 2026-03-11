package cloud.xcan.angus.core.ai.application.query.model;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
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

  /**
   * 根据ID查询模型（不存在时返回空）
   */
  Optional<Model> findById(Long id);

  /**
   * 根据ID列表查询模型
   */
  List<Model> findByIds(Collection<Long> ids);

  /**
   * 查询用于 AgentX 配置的模型列表（仅 ACTIVE 状态，支持租户筛选）
   */
  List<Model> findModelsForConfig(String tenantId);


}
