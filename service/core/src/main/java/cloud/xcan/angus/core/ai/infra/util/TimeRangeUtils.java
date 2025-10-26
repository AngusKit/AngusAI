package cloud.xcan.angus.core.ai.infra.util;

import java.time.LocalDateTime;

public class TimeRangeUtils {


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
