package cloud.xcan.angus.core.ai.infra.util;

import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

public class TimeRangeUtils {

  public static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  public static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern(
      "yyyy-MM-dd HH:mm:ss");

  // --- helper methods ---
  public static LocalDateTime parseStartDate(String startDate) {
    try {
      if (startDate != null) {
        if (startDate.length() == 10) {
          return LocalDate.parse(startDate, DATE_FMT).atStartOfDay();
        }
        return LocalDateTime.parse(startDate, DATETIME_FMT);
      }
    } catch (Exception ignored) {
    }
    return LocalDateTime.of(1970, 1, 1, 0, 0);
  }

  public static LocalDateTime parseEndDate(String endDate) {
    try {
      if (endDate != null) {
        if (endDate.length() == 10) {
          return LocalDate.parse(endDate, DATE_FMT).atTime(LocalTime.MAX);
        }
        return LocalDateTime.parse(endDate, DATETIME_FMT);
      }
    } catch (Exception ignored) {
    }
    return LocalDateTime.now();
  }

  public static Set<SearchCriteria> buildPeriodFilters(StatisticsPeriod period) {
    var base = SearchCriteria.criteria();
    if (period == null) {
      return base;
    }
    LocalDateTime start;
    LocalDateTime end = LocalDateTime.now();
    switch (period) {
      case TODAY -> start = LocalDate.now().atStartOfDay();
      case LAST_7_DAYS -> start = LocalDate.now().minusDays(6).atStartOfDay();
      case LAST_30_DAYS -> start = LocalDate.now().minusDays(29).atStartOfDay();
      default -> start = null;
    }
    if (start != null) {
      base = SearchCriteria.merge(base,
          SearchCriteria.greaterThanEqual("createdDate", start),
          SearchCriteria.lessThanEqual("createdDate", end));
    }
    return base;
  }

  public static LocalDateTime[] getPeriodRange(StatisticsPeriod period) {
    if (period == null) {
      return null;
    }
    LocalDateTime end = LocalDateTime.now();
    LocalDateTime start;
    switch (period) {
      case TODAY -> start = LocalDate.now().atStartOfDay();
      case LAST_7_DAYS -> start = LocalDate.now().minusDays(6).atStartOfDay();
      case LAST_30_DAYS -> start = LocalDate.now().minusDays(29).atStartOfDay();
      default -> {
        return null;
      }
    }
    return new LocalDateTime[]{start, end};
  }

  /**
   * 解析时间范围
   */
  public static TimeRange parseTimeRange(String timeRangeStr) {
    LocalDateTime end = LocalDateTime.now();
    LocalDateTime start = switch (timeRangeStr) {
      case "24hours" -> end.minusHours(24);
      case "30days" -> end.minusDays(30);
      case "90days" -> end.minusDays(90);
      default -> end.minusDays(7);
    };
    return new TimeRange(start, end);
  }

  /**
   * 确定数据粒度
   */
  public static String determineGranularity(String timeRange, String granularity) {
    if (granularity != null) {
      return granularity;
    }

    // 根据时间范围自动确定粒度
    return switch (timeRange) {
      case "24hours" -> "hour";
      case "90days" -> "week";
      default -> "day";
    };
  }

  /**
   * 时间范围内部类
   */
  public static class TimeRange {

    public final LocalDateTime start;
    public final LocalDateTime end;

    TimeRange(LocalDateTime start, LocalDateTime end) {
      this.start = start;
      this.end = end;
    }
  }

}
