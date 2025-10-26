package cloud.xcan.angus.core.ai.infra.util;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class CommonUtils {

  public static final DecimalFormat NUMBER_FORMAT = new DecimalFormat("#,###");
  public static final DecimalFormat PERCENTAGE_FORMAT = new DecimalFormat("0.0");

  /**
   * 格式化数字(千位分隔)
   */
  public static String formatNumber(Long number) {
    return NUMBER_FORMAT.format(number);
  }

  /**
   * 格式化大数字(使用K、M简化)
   */
  public static String formatLargeNumber(Long number) {
    if (number >= 1_000_000) {
      return PERCENTAGE_FORMAT.format(number / 1_000_000.0) + "M";
    } else if (number >= 1_000) {
      return PERCENTAGE_FORMAT.format(number / 1_000.0) + "K";
    }
    return NUMBER_FORMAT.format(number);
  }

  /**
   * 格式化百分比
   */
  public static String formatPercentage(Double percentage) {
    if (percentage == null) {
      return "0%";
    }
    String sign = percentage >= 0 ? "+" : "";
    return sign + PERCENTAGE_FORMAT.format(percentage) + "%";
  }

  /**
   * 格式化响应时间
   */
  public static String formatResponseTime(Double ms) {
    if (ms >= 1000) {
      return PERCENTAGE_FORMAT.format(ms / 1000.0) + "s";
    }
    return Math.round(ms) + "ms";
  }

  /**
   * 获取趋势方向
   */
  public static String getTrend(Double change) {
    if (change == null || change == 0) {
      return "up";
    }
    return change > 0 ? "up" : "down";
  }

  /**
   * 格式化文件大小
   */
  public static String formatFileSize(Long size) {
    if (size == null || size == 0) {
      return "0 B";
    }

    String[] units = {"B", "KB", "MB", "GB", "TB"};
    int unitIndex = 0;
    double fileSize = size.doubleValue();

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    DecimalFormat df = new DecimalFormat("#.##");
    return df.format(fileSize) + " " + units[unitIndex];
  }


  /**
   * 根据粒度格式化日期
   */
  public static String formatDateByGranularity(LocalDateTime dateTime, String granularity) {
    if ("hour".equals(granularity)) {
      return dateTime.format(DateTimeFormatter.ofPattern("MM/dd HH:00"));
    } else if ("week".equals(granularity)) {
      return dateTime.format(DateTimeFormatter.ofPattern("yyyy-'W'ww"));
    } else {
      return dateTime.format(DateTimeFormatter.ofPattern("MM/dd"));
    }
  }

  /**
   * 计算百分位数
   */
  public static int calculatePercentile(List<Integer> sortedValues, int percentile) {
    if (sortedValues.isEmpty()) {
      return 0;
    }
    int index = (int) Math.ceil(sortedValues.size() * percentile / 100.0) - 1;
    return sortedValues.get(Math.max(0, Math.min(index, sortedValues.size() - 1)));
  }

  /**
   * 计算变化百分比
   */
  public static double calculateChangePercentage(Long current, Long previous) {
    if (previous == null || previous == 0) {
      return 0.0;
    }
    return ((current - previous) * 100.0 / previous);
  }

  /**
   * 获取错误名称
   */
  public static String getStatusErrorName(Integer statusCode) {
    if (statusCode == null) {
      return "Unknown";
    }
    return switch (statusCode) {
      case 400 -> "Bad Request";
      case 401 -> "Unauthorized";
      case 403 -> "Forbidden";
      case 404 -> "Not Found";
      case 429 -> "Rate Limit";
      case 500 -> "Internal Error";
      case 502 -> "Bad Gateway";
      case 503 -> "Service Unavailable";
      case 504 -> "Gateway Timeout";
      default -> "Error " + statusCode;
    };
  }

}
