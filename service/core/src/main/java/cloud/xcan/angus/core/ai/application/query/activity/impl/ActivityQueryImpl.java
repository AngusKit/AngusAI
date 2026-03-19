package cloud.xcan.angus.core.ai.application.query.activity.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.DATE_FMT;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;

import cloud.xcan.angus.api.manager.UserManager;
import cloud.xcan.angus.core.ai.application.query.activity.ActivityQuery;
import cloud.xcan.angus.core.ai.domain.activity.Activity;
import cloud.xcan.angus.core.ai.domain.activity.ActivityRepo;
import cloud.xcan.angus.core.ai.domain.activity.ActivitySearchRepo;
import cloud.xcan.angus.core.ai.domain.activity.ActivityStatus;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

  private static final int TOP_N = 10;

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
          userManager.setUserNameAndAvatar(page.getContent(), "userId", "userName", "userAvatar");
        }
        return page;
      }
    }.execute();
  }

  @Override
  public ActivityStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    // parse and normalize date range
    LocalDateTime start = parseStartDate(dto.getStartDate());
    LocalDateTime end = parseEndDate(dto.getEndDate());

    ActivityStatisticsVo vo = new ActivityStatisticsVo();

    // Overview
    long total = activityRepo.countByActivityDateBetween(start, end);
    ActivityStatisticsVo.Overview ov = new ActivityStatisticsVo.Overview();
    ov.setTotalActivities(total);

    // today based on end
    LocalDate todayDate = end.toLocalDate();
    LocalDateTime tstart = todayDate.atStartOfDay();
    LocalDateTime tend = todayDate.atTime(LocalTime.MAX);
    long todayCount = activityRepo.countByActivityDateBetween(tstart, tend);
    ov.setTodayActivities(todayCount);

    long activeUsers = activityRepo.countDistinctUsersByDateRange(start, end);
    ov.setActiveUsers(activeUsers);

    Long succ = activityRepo.countByStatusAndDateRange(ActivityStatus.SUCCESS.name(), start, end);
    double successRate = (ov.getTotalActivities() == 0) ? 0.0
        : (succ.doubleValue() * 100.0 / ov.getTotalActivities());
    ov.setSuccessRate(successRate);
    vo.setOverview(ov);

    // distributions
    vo.setActionTypeDistribution(buildActionDistribution(start, end, ov.getTotalActivities()));
    vo.setResourceTypeDistribution(buildResourceDistribution(start, end, ov.getTotalActivities()));
    vo.setStatusDistribution(buildStatusDistribution(start, end));

    // top users
    List<ActivityStatisticsVo.TopUser> topUsers = buildTopUsers(start, end);
    // enrich userName and userAvatar using userManager
    if (!topUsers.isEmpty()) {
      userManager.setUserNameAndAvatar(topUsers, "userId", "userName", "userAvatar");
    }
    vo.setTopActiveUsers(topUsers);

    // time trend
    vo.setTimeTrend(buildTimeTrend(start, end));

    // top resources
    vo.setTopResources(buildTopResources(start, end));
    return vo;
  }

  private List<ActivityStatisticsVo.ActionTypeDistribution> buildActionDistribution(
      LocalDateTime start, LocalDateTime end, long total) {
    List<Object[]> rows = activityRepo.countGroupByActionType(start, end);
    List<ActivityStatisticsVo.ActionTypeDistribution> list = new ArrayList<>();
    if (rows == null) {
      return list;
    }
    for (Object[] r : rows) {
      ActivityStatisticsVo.ActionTypeDistribution d = new ActivityStatisticsVo.ActionTypeDistribution();
      d.setActionType(Objects.toString(r[0], null));
      d.setActionTypeLabel(d.getActionType());
      d.setCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      d.setPercentage(total == 0 ? 0.0 : (d.getCount() * 100.0 / total));
      list.add(d);
    }
    return list;
  }

  private List<ActivityStatisticsVo.ResourceTypeDistribution> buildResourceDistribution(
      LocalDateTime start, LocalDateTime end, long total) {
    List<Object[]> rows = activityRepo.countGroupByResourceType(start, end);
    List<ActivityStatisticsVo.ResourceTypeDistribution> list = new ArrayList<>();
    if (rows == null) {
      return list;
    }
    for (Object[] r : rows) {
      ActivityStatisticsVo.ResourceTypeDistribution d = new ActivityStatisticsVo.ResourceTypeDistribution();
      d.setResourceType(Objects.toString(r[0], null));
      d.setResourceTypeLabel(d.getResourceType());
      d.setCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      d.setPercentage(total == 0 ? 0.0 : (d.getCount() * 100.0 / total));
      list.add(d);
    }
    return list;
  }

  private ActivityStatisticsVo.StatusDistribution buildStatusDistribution(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = activityRepo.countGroupByStatus(start, end);
    ActivityStatisticsVo.StatusDistribution sd = new ActivityStatisticsVo.StatusDistribution();
    if (rows == null) {
      return sd;
    }
    for (Object[] r : rows) {
      String st = Objects.toString(r[0], "");
      long cnt = r[1] == null ? 0L : ((Number) r[1]).longValue();
      if (ActivityStatus.SUCCESS.name().equalsIgnoreCase(st)) {
        sd.setSuccess(cnt);
      } else if (ActivityStatus.FAILED.name().equalsIgnoreCase(st)) {
        sd.setFailed(cnt);
      } else if (ActivityStatus.WARNING.name().equalsIgnoreCase(st)) {
        sd.setWarning(cnt);
      }
    }
    return sd;
  }

  private List<ActivityStatisticsVo.TopUser> buildTopUsers(LocalDateTime start, LocalDateTime end) {
    List<Object[]> rows = activityRepo.topUsersBetween(start, end, TOP_N);
    List<ActivityStatisticsVo.TopUser> users = new ArrayList<>();
    if (rows == null) {
      return users;
    }
    for (Object[] r : rows) {
      ActivityStatisticsVo.TopUser u = new ActivityStatisticsVo.TopUser();
      u.setUserId(r[0] == null ? null : ((Number) r[0]).longValue());
      u.setActivityCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      u.setLastActivityDate(Objects.toString(r[2], null));
      users.add(u);
    }
    return users;
  }

  private List<ActivityStatisticsVo.TimeTrend> buildTimeTrend(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = activityRepo.timeTrendByDay(start, end);
    List<ActivityStatisticsVo.TimeTrend> trends = new ArrayList<>();
    if (rows == null) {
      return trends;
    }
    for (Object[] r : rows) {
      ActivityStatisticsVo.TimeTrend t = new ActivityStatisticsVo.TimeTrend();
      String date = Objects.toString(r[0], null);
      t.setDate(date);
      try {
        LocalDateTime dt = LocalDate.parse(date, DATE_FMT).atStartOfDay();
        long ts = dt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        t.setTimestamp(ts);
      } catch (Exception e) {
        t.setTimestamp(null);
      }
      t.setCount(r[1] == null ? 0L : ((Number) r[1]).longValue());
      t.setSuccessCount(r[2] == null ? 0L : ((Number) r[2]).longValue());
      t.setFailedCount(r[3] == null ? 0L : ((Number) r[3]).longValue());
      trends.add(t);
    }
    return trends;
  }

  private List<ActivityStatisticsVo.TopResource> buildTopResources(LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = activityRepo.topResourcesBetween(start, end, TOP_N);
    List<ActivityStatisticsVo.TopResource> res = new ArrayList<>();
    if (rows == null) {
      return res;
    }
    for (Object[] r : rows) {
      ActivityStatisticsVo.TopResource tr = new ActivityStatisticsVo.TopResource();
      tr.setResourceId(r[0] == null ? null : ((Number) r[0]).longValue());
      tr.setResourceType(Objects.toString(r[1], null));
      tr.setResourceName(Objects.toString(r[2], null));
      tr.setOperationCount(r[3] == null ? 0L : ((Number) r[3]).longValue());
      tr.setLastOperationDate(Objects.toString(r[4], null));
      res.add(tr);
    }
    return res;
  }

}
