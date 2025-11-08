package cloud.xcan.angus.core.ai.application.query.dataset.impl;

import cloud.xcan.angus.core.ai.application.query.dataset.DatasetUsageLogQuery;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetUsageLog;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetUsageLogRepo;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 数据集查询使用记录查询服务实现
 */
@Service
public class DatasetUsageLogQueryImpl implements DatasetUsageLogQuery {

  @Resource
  private DatasetUsageLogRepo datasetUsageLogRepo;

  @Override
  public Long countByTimeRange(LocalDateTime start, LocalDateTime end) {
    return datasetUsageLogRepo.countByTimeRange(start, end);
  }

  @Override
  public List<DatasetUsageLog> findByQueryDateBetween(LocalDateTime start, LocalDateTime end) {
    return datasetUsageLogRepo.findByQueryDateBetween(start, end);
  }

  @Override
  public List<Object[]> getTopDatasetsByQueryCount(LocalDateTime start, LocalDateTime end,
      Integer limit) {
    return datasetUsageLogRepo.getTopDatasetsByQueryCount(start, end, limit);
  }

  @Override
  public List<Object[]> getQueryTrendByDay(LocalDateTime start, LocalDateTime end) {
    return datasetUsageLogRepo.getQueryTrendByDay(start, end);
  }
}

