package cloud.xcan.angus.core.ai.infra.util;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentType;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.springframework.web.multipart.MultipartFile;

public class CommonUtils {

  public static final DecimalFormat NUMBER_FORMAT = new DecimalFormat("#,###");
  public static final DecimalFormat PERCENTAGE_FORMAT = new DecimalFormat("0.0");

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
