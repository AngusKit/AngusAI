package cloud.xcan.angus.core.ai.domain.setting;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 隐私设置
 */
@Data
@Accessors(chain = true)
public class PrivacySettings {

  /**
   * 个人资料可见性: public, team, private
   */
  private String profileVisibility = "team";

  /**
   * 是否显示邮箱
   */
  private Boolean showEmail = false;

  /**
   * 是否显示活动
   */
  private Boolean showActivity = true;
}
