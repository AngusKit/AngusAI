package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 用户设置详情
 */
@Data
@Schema(description = "用户设置详情")
public class UserSettingsVo {

  @Schema(description = "用户ID")
  private Long userId;

  @Schema(description = "个人资料")
  private ProfileVo profile;

  @Schema(description = "偏好设置")
  private PreferencesVo preferences;

  @Schema(description = "隐私设置")
  private PrivacyVo privacy;

  @Data
  @Schema(description = "个人资料")
  public static class ProfileVo {

    @Schema(description = "姓名")
    private String name;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "电话")
    private String phone;

    @Schema(description = "公司")
    private String company;

    @Schema(description = "职位")
    private String position;

    @Schema(description = "时区")
    private String timezone;

    @Schema(description = "语言")
    private String language;
  }

  @Data
  @Schema(description = "偏好设置")
  public static class PreferencesVo {

    @Schema(description = "主题")
    private String theme;

    @Schema(description = "区域设置")
    private String locale;

    @Schema(description = "日期格式")
    private String dateFormat;

    @Schema(description = "时间格式")
    private String timeFormat;

    @Schema(description = "默认视图")
    private String defaultView;
  }

  @Data
  @Schema(description = "隐私设置")
  public static class PrivacyVo {

    @Schema(description = "个人资料可见性")
    private String profileVisibility;

    @Schema(description = "是否显示邮箱")
    private Boolean showEmail;

    @Schema(description = "是否显示活动")
    private Boolean showActivity;
  }
}
