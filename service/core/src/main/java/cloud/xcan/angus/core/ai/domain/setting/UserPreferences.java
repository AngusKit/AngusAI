package cloud.xcan.angus.core.ai.domain.setting;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 用户偏好设置
 */
@Data
@Accessors(chain = true)
public class UserPreferences {

  /**
   * 主题: light, dark, auto
   */
  private String theme = "light";

  /**
   * 区域设置
   */
  private String locale = "zh-CN";

  /**
   * 日期格式
   */
  private String dateFormat = "YYYY-MM-DD";

  /**
   * 时间格式: 12h, 24h
   */
  private String timeFormat = "24h";

  /**
   * 默认视图: grid, list
   */
  private String defaultView = "grid";
}
