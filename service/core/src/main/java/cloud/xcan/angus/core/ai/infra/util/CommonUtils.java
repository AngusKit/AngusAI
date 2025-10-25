package cloud.xcan.angus.core.ai.infra.util;

import java.text.DecimalFormat;

public class CommonUtils {

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

}
