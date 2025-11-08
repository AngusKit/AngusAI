package cloud.xcan.angus.core.ai.application.query.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocUsageLogQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocUsageLog;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocUsageLogRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 知识库文档使用记录查询服务实现
 */
@Service
public class KnowledgeBaseDocUsageLogQueryImpl implements KnowledgeBaseDocUsageLogQuery {

  @Resource
  private KnowledgeBaseDocUsageLogRepo knowledgeBaseDocUsageLogRepo;

  @Override
  public Long countByTimeRange(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return knowledgeBaseDocUsageLogRepo.countByTimeRange(start, end);
      }
    }.execute();
  }

  @Override
  public List<KnowledgeBaseDocUsageLog> findByQueryDateBetween(LocalDateTime start,
      LocalDateTime end) {
    return new BizTemplate<List<KnowledgeBaseDocUsageLog>>() {
      @Override
      protected List<KnowledgeBaseDocUsageLog> process() {
        return knowledgeBaseDocUsageLogRepo.findByQueryDateBetween(start, end);
      }
    }.execute();
  }

  @Override
  public List<Object[]> getTopKnowledgeBasesByQueryCount(LocalDateTime start, LocalDateTime end,
      Integer limit) {
    return new BizTemplate<List<Object[]>>() {
      @Override
      protected List<Object[]> process() {
        return knowledgeBaseDocUsageLogRepo.getTopKnowledgeBasesByQueryCount(start, end, limit);
      }
    }.execute();
  }

  @Override
  public List<Object[]> getQueryTrendByDay(LocalDateTime start, LocalDateTime end) {
    return new BizTemplate<List<Object[]>>() {
      @Override
      protected List<Object[]> process() {
        return knowledgeBaseDocUsageLogRepo.getQueryTrendByDay(start, end);
      }
    }.execute();
  }
}

