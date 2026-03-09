package cloud.xcan.angus.core.ai.application.query.vector;

import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 向量存储源查询服务
 */
public interface VectorStoreQuery {

  /**
   * 根据ID查询存储源
   */
  VectorStore findAndCheck(Long id);

  /**
   * 分页查询存储源
   */
  Page<VectorStore> find(GenericSpecification<VectorStore> spec, Pageable pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 获取向量存储源统计信息
   *
   * @param dto 统计参数，包含可选的开始时间和结束时间
   * @return 统计信息VO
   */
  VectorStoreStatisticsVo getStatistics(SimpleStatisticsDto dto);

  /**
   * 根据ID查询存储源（不存在时返回空）
   */
  Optional<VectorStore> findById(Long id);

  /**
   * 查询用于 AgentX 配置的向量存储列表（仅启用的，支持租户筛选）
   */
  List<VectorStore> findVectorStoresForConfig(String tenantId);

}
