package cloud.xcan.angus.core.ai.application.query.vector.impl;

import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 向量存储源查询服务实现
 */
@Service
public class VectorStoreQueryImpl implements VectorStoreQuery {

  @Resource
  private VectorStoreRepo vectorStoreRepo;

  @Resource
  private VectorStoreSearchRepo vectorStoreSearchRepo;

  @Resource
  private VectorStoreAccessLogRepo vectorStoreAccessLogRepo;

  @Override
  public VectorStore findAndCheck(Long id) {
    return new BizTemplate<VectorStore>() {
      @Override
      protected VectorStore process() {
        return vectorStoreRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("存储源未找到", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<VectorStore> find(GenericSpecification<VectorStore> spec, Pageable pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<VectorStore>>() {
      @Override
      protected Page<VectorStore> process() {
        return fullTextSearch
            ? vectorStoreSearchRepo.find(spec.getCriteria(), pageable, VectorStore.class, match)
            : vectorStoreRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  /**
   * 统计存储源总数
   */
  public long countTotalStores() {
    return vectorStoreRepo.count();
  }

  /**
   * 统计已连接的存储源数
   */
  public long countConnectedStores() {
    return vectorStoreRepo.countByStatus(ConnectionStatus.CONNECTED.name());
  }

  /**
   * 按类型统计存储源数量
   */
  public List<Object[]> countGroupByType() {
    return vectorStoreRepo.countGroupByType();
  }

  /**
   * 统计指定日期范围内的查询数
   */
  public long countQueriesByDateRange(LocalDateTime start, LocalDateTime end) {
    return vectorStoreAccessLogRepo.countByQueryDateBetween(start, end);
  }

  /**
   * 获取热门存储源（按查询次数）
   */
  public List<Object[]> getTopStoresByQueryCount(LocalDateTime start, LocalDateTime end, int limit) {
    return vectorStoreAccessLogRepo.topStoresByQueryCount(start, end, limit);
  }

  /**
   * 获取存储源的平均响应时间
   */
  public List<Object[]> getAvgResponseTimeByStore(LocalDateTime start, LocalDateTime end) {
    return vectorStoreAccessLogRepo.avgResponseTimeByStore(start, end);
  }

  /**
   * 获取性能趋势（按天）
   */
  public List<Object[]> getPerformanceTrendByDay(LocalDateTime start, LocalDateTime end) {
    return vectorStoreAccessLogRepo.performanceTrendByDay(start, end);
  }

  /**
   * 统计错误数
   */
  public long countFailedQueries(LocalDateTime start, LocalDateTime end) {
    return vectorStoreAccessLogRepo.countFailedByQueryDateBetween(start, end);
  }

  /**
   * 按存储源统计错误数
   */
  public List<Object[]> getErrorCountByStore(LocalDateTime start, LocalDateTime end) {
    return vectorStoreAccessLogRepo.errorCountByStore(start, end);
  }
}
