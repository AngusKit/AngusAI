package cloud.xcan.angus.core.ai.infra.util;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

public class CommonUtils {

  public static final DecimalFormat NUMBER_FORMAT = new DecimalFormat("#,###");
  public static final DecimalFormat PERCENTAGE_FORMAT = new DecimalFormat("0.0");
  /** 百分比格式（2位小数，已乘以100的值如 25.5 表示 25.5%） */
  public static final DecimalFormat PERCENTAGE_2DECIMAL_FORMAT = new DecimalFormat("0.00");

  /**
   * 格式化百分比为2位小数（输入已乘以100，如 25.567 表示 25.567%）
   */
  public static Double formatPercentageTo2Decimals(Double percentage) {
    double value = percentage == null ? 0.0 : percentage.doubleValue();
    return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
  }

  /**
   * 格式化数字(千位分隔)
   */
  public static String formatNumber(Long number) {
    if (number == null) {
      return "0";
    }
    return NUMBER_FORMAT.format(number);
  }

  /**
   * 格式化费用为展示字符串。
   * <p>费用在系统中以美分(cents)存储，此方法将美分转为美元展示，如 "$12.34"。
   *
   * @param costCents 费用（美分），可为 null
   * @return 格式化字符串，如 "$12.34"；null 时返回 "$0.00"
   */
  public static String formatCost(Long costCents) {
    if (costCents == null) {
      return "$0.00";
    }
    return "$" + String.format(Locale.US, "%.2f", costCents / 100.0);
  }

  /**
   * 格式化费用为展示字符串（输入为美元）。
   * <p>用于 ModelCallRecord 等以美元存储的 cost 字段。
   *
   * @param costDollars 费用（美元），可为 null
   * @return 格式化字符串，如 "$12.34"；null 时返回 "$0.00"
   */
  public static String formatCostFromDollars(Double costDollars) {
    if (costDollars == null) {
      return "$0.00";
    }
    return "$" + String.format(Locale.US, "%.2f", costDollars);
  }

  /**
   * 格式化大数字(使用K、M简化)
   */
  public static String formatLargeNumber(Long number) {
    if (number == null) {
      return "0";
    }
    if (number >= 1_000_000) {
      return PERCENTAGE_FORMAT.format(number / 1_000_000.0) + "M";
    } else if (number >= 1_000) {
      return PERCENTAGE_FORMAT.format(number / 1_000.0) + "K";
    }
    return NUMBER_FORMAT.format(number);
  }

  public static long getLong(Map<String, Object> map, String key) {
    Object v = map.get(key);
    if (v == null) {
      return 0L;
    }
    return v instanceof Number ? ((Number) v).longValue() : 0L;
  }

  public static Long toLong(Object value, Long defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    if (value instanceof Number) {
      return ((Number) value).longValue();
    }
    return defaultValue;
  }

  public static Double toDouble(Object value, Double defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    if (value instanceof Number) {
      return ((Number) value).doubleValue();
    }
    return defaultValue;
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
    if (ms == null) {
      return "0ms";
    }
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

  public static LocalDateTime toLocalDateTime(Object value) {
    if (value == null) {
      return null;
    }
    if (value instanceof LocalDateTime) {
      return (LocalDateTime) value;
    }
    if (value instanceof Timestamp) {
      return ((Timestamp) value).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }
    if (value instanceof java.util.Date) {
      return ((java.util.Date) value).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }
    return null;
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

  /**
   * 根据文件名计算文件类型
   *
   * @param filename 文件名
   * @return 文件类型，如果无法识别则返回 TXT
   */
  public static DocumentType calculateDocumentType(String filename, DocumentType defaultType) {
    if (filename == null || filename.isEmpty()) {
      return DocumentType.TXT;
    }

    String lowerFilename = filename.toLowerCase(Locale.ROOT);
    // 根据文件扩展名判断类型
    if (lowerFilename.endsWith(".pdf")) {
      return DocumentType.PDF;
    } else if (lowerFilename.endsWith(".docx") || lowerFilename.endsWith(".doc")) {
      return DocumentType.DOCX;
    } else if (lowerFilename.endsWith(".md") || lowerFilename.endsWith(".markdown")) {
      return DocumentType.MARKDOWN;
    } else if (lowerFilename.endsWith(".html") || lowerFilename.endsWith(".htm")) {
      return DocumentType.HTML;
    } else if (lowerFilename.endsWith(".txt") || lowerFilename.endsWith(".text")) {
      return DocumentType.TXT;
    } else if (lowerFilename.endsWith(".json")) {
      return DocumentType.JSON;
    } else if (lowerFilename.endsWith(".xml")) {
      return DocumentType.XML;
    }
    ;
    // 默认返回
    return defaultType;
  }

  /**
   * 根据文件名计算文件类型
   *
   * @param filename 文件名
   * @return 文件类型，如果无法识别则返回 TXT
   */
  public static DatasetDataType calculateDatasetType(String filename, DatasetDataType defaultType) {
    if (filename == null || filename.isEmpty()) {
      return DatasetDataType.EXCEL;
    }
    String lowerFilename = filename.toLowerCase(Locale.ROOT);
    // 根据文件扩展名判断类型
    if (lowerFilename.endsWith(".xlsx") || lowerFilename.endsWith(".xls")) {
      return DatasetDataType.EXCEL;
    } else if (lowerFilename.endsWith(".csv")) {
      return DatasetDataType.CSV;
    } else if (lowerFilename.endsWith(".json")) {
      return DatasetDataType.JSON;
    } else if (lowerFilename.endsWith(".xml")) {
      return DatasetDataType.XML;
    }
    // 默认返回
    return defaultType;
  }

  /**
   * 计算文件内容的哈希值（使用 SHA-256）
   *
   * @param file 文件
   * @return 文件内容的 SHA-256 哈希值（十六进制字符串），如果计算失败返回 null
   */
  public static String calculateContentHash(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      return null;
    }

    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");

      // 读取文件内容并计算哈希值
      try (InputStream inputStream = file.getInputStream()) {
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
          digest.update(buffer, 0, bytesRead);
        }
      }

      // 转换为十六进制字符串
      byte[] hashBytes = digest.digest();
      StringBuilder hexString = new StringBuilder();
      for (byte b : hashBytes) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) {
          hexString.append('0');
        }
        hexString.append(hex);
      }

      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      // SHA-256 算法应该总是可用，但如果不可用则返回 null
      return null;
    } catch (IOException e) {
      // 文件读取失败，返回 null
      return null;
    }
  }

}
