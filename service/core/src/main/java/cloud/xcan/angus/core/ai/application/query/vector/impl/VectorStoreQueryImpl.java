package cloud.xcan.angus.core.ai.application.query.vector.impl;

import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreSearchRepo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
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
        if (fullTextSearch) {
          return vectorStoreSearchRepo.find(spec.getCriteria(), pageable, VectorStore.class, match);
        } else {
          return vectorStoreRepo.findAll(spec, pageable);
        }
      }
    }.execute();
  }

  @Override
  public VectorStoreStatisticsVo getStatistics() {
    return new BizTemplate<VectorStoreStatisticsVo>() {
      @Override
      protected VectorStoreStatisticsVo process() {
        // TODO: 实现统计信息查询
        VectorStoreStatisticsVo statistics = new VectorStoreStatisticsVo();
        
        // 设置总体统计
        VectorStoreStatisticsVo.Overview overview = new VectorStoreStatisticsVo.Overview();
        overview.setTotalStores(vectorStoreRepo.count());
        overview.setConnectedStores(vectorStoreRepo.countByStatus("connected"));
        overview.setTotalVectors(0L); // TODO: 从向量数据统计
        overview.setTodayQueries(0L); // TODO: 从查询日志统计
        statistics.setOverview(overview);
        
        // TODO: 实现类型分布、使用率排行、性能趋势
        
        return statistics;
      }
    }.execute();
  }
}
