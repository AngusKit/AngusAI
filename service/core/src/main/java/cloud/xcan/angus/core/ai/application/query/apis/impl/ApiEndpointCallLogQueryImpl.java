package cloud.xcan.angus.core.ai.application.query.apis.impl;

import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointCallLogQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointCallLog;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointCallLogRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * API端点调用日志查询服务实现
 */
@Service
public class ApiEndpointCallLogQueryImpl implements ApiEndpointCallLogQuery {

  @Resource
  private ApiEndpointCallLogRepo apiEndpointCallLogRepo;

  @Override
  public Long countByTimeRange(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return apiEndpointCallLogRepo.countByTimeRange(start, end);
      }
    }.execute();
  }

  @Override
  public List<ApiEndpointCallLog> findByCallDateBetween(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<List<ApiEndpointCallLog>>() {
      @Override
      protected List<ApiEndpointCallLog> process() {
        return apiEndpointCallLogRepo.findByCallDateBetween(start, end);
      }
    }.execute();
  }

  @Override
  public List<Object[]> getTopEndpointsByCallCount(LocalDateTime start, LocalDateTime end,
      Integer limit) {
    return new BizTemplate<List<Object[]>>() {
      @Override
      protected List<Object[]> process() {
        return apiEndpointCallLogRepo.getTopEndpointsByCallCount(start, end, limit);
      }
    }.execute();
  }

  @Override
  public List<Object[]> getAvgResponseTimeByEndpoint(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<List<Object[]>>() {
      @Override
      protected List<Object[]> process() {
        return apiEndpointCallLogRepo.getAvgResponseTimeByEndpoint(start, end);
      }
    }.execute();
  }

  @Override
  public List<Object[]> getPerformanceTrendByDay(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<List<Object[]>>() {
      @Override
      protected List<Object[]> process() {
        return apiEndpointCallLogRepo.getPerformanceTrendByDay(start, end);
      }
    }.execute();
  }
}

