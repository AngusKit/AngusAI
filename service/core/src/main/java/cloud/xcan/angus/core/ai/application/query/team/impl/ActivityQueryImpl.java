package cloud.xcan.angus.core.ai.application.query.team.impl;

import cloud.xcan.angus.api.manager.UserManager;
import cloud.xcan.angus.core.ai.application.query.team.ActivityQuery;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityRepo;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivitySearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * Implementation of activity query operations for activity management and reporting.
 *
 * @author XiaoLong Liu
 */
@Service                                                                                                                                                                                                                             
public class ActivityQueryImpl implements ActivityQuery {

  @Resource
  private ActivityRepo activityRepo;

  @Resource
  private ActivitySearchRepo activitySearchRepo;

  @Resource
  private UserManager userManager;

  /**
   * Finds activities with pagination, filtering, and optional full-text search.
   */
  @Override
  public Page<Activity> find(GenericSpecification<Activity> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Activity>>() {

      @Override
      protected Page<Activity> process() {
        // Execute activity query with full-text search or standard search
        Page<Activity> page = fullTextSearch
            ? activitySearchRepo.find(spec.getCriteria(), pageable, Activity.class, match)
            : activityRepo.findAll(spec, pageable);

        // Enrich activity data with project names and user information if content exists
        if (page.hasContent()) {
          userManager.setUserNameAndAvatar(page.getContent(), "userId", "fullName", "avatar");
        }
        return page;
      }
    }.execute();
  }


  /**
   * Counts activities between the given date range.
   */
  public long countByDateRange(LocalDateTime start, LocalDateTime end) {
    return activityRepo.countByActivityDateBetween(start, end);
  }

  /**
   * Counts distinct active users in the given date range.
   */
  public long countDistinctUsersByDateRange(LocalDateTime start, LocalDateTime end) {
    Long count = activityRepo.countDistinctUsersByDateRange(start, end);
    return count == null ? 0L : count;
  }

  /**
   * Counts activities by status in the given date range.
   */
  public Long countByStatusAndDateRange(String status, LocalDateTime start, LocalDateTime end) {
    return activityRepo.countByStatusAndDateRange(status, start, end);
  }

  /**
   * Gets action type distribution grouped by action type.
   */
  public List<Object[]> getActionTypeDistribution(LocalDateTime start, LocalDateTime end) {
    return activityRepo.countGroupByActionType(start, end);
  }

  /**
   * Gets resource type distribution grouped by resource type.
   */
  public List<Object[]> getResourceTypeDistribution(LocalDateTime start, LocalDateTime end) {
    return activityRepo.countGroupByResourceType(start, end);
  }

  /**
   * Gets status distribution grouped by status.
   */
  public List<Object[]> getStatusDistribution(LocalDateTime start, LocalDateTime end) {
    return activityRepo.countGroupByStatus(start, end);
  }

  /**
   * Gets top active users in the given date range.
   */
  public List<Object[]> getTopUsers(LocalDateTime start, LocalDateTime end, int limit) {
    return activityRepo.topUsersBetween(start, end, limit);
  }

  /**
   * Gets time trend by day in the given date range.
   */
  public List<Object[]> getTimeTrendByDay(LocalDateTime start, LocalDateTime end) {
    return activityRepo.timeTrendByDay(start, end);
  }

  /**
   * Gets top resources in the given date range.
   */
  public List<Object[]> getTopResources(LocalDateTime start, LocalDateTime end, int limit) {
    return activityRepo.topResourcesBetween(start, end, limit);
  }

}
