package cloud.xcan.angus.core.ai.domain.application;

/**
 * 应用数量统计投影（用于一次查询聚合 total/draft/published/paused）
 */
public interface ApplicationCountsProjection {

  long getTotal();

  long getDraft();

  long getPublished();

  long getPaused();
}
