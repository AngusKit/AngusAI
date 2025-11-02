package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 * 更新用户设置请求参数
 */
@Data
@Schema(description = "更新用户设置请求参数")
public class UserSettingsUpdateDto {

  @Schema(description = "个人资料")
  private ProfileDto profile;

  @Schema(description = "偏好设置")
  private PreferencesDto preferences;

  @Schema(description = "隐私设置")
  private PrivacyDto privacy;

  @Data
  @Schema(description = "个人资料")
  public static class ProfileDto {

    @Length(max = 100)
    @Schema(description = "姓名", example = "张三")
    private String name;

    @Length(max = 50)
    @Schema(description = "电话", example = "13800138000")
    private String phone;

    @Length(max = 200)
    @Schema(description = "公司", example = "某某科技公司")
    private String company;

    @Length(max = 100)
    @Schema(description = "职位", example = "高级工程师")
    private String position;

    @Length(max = 50)
    @Schema(description = "时区", example = "Asia/Shanghai")
    private String timezone;

    @Length(max = 20)
    @Schema(description = "语言", example = "zh-CN")
    private String language;
  }

  @Data
  @Schema(description = "偏好设置")
  public static class PreferencesDto {

    @Schema(description = "主题", example = "light", allowableValues = {"light", "dark", "auto"})
    private String theme;

    @Schema(description = "区域设置", example = "zh-CN")
    private String locale;

    @Schema(description = "日期格式", example = "YYYY-MM-DD")
    private String dateFormat;

    @Schema(description = "时间格式", example = "24h", allowableValues = {"12h", "24h"})
    private String timeFormat;

    @Schema(description = "默认视图", example = "grid", allowableValues = {"grid", "list"})
    private String defaultView;
  }

  @Data
  @Schema(description = "隐私设置")
  public static class PrivacyDto {

    @Schema(description = "个人资料可见性", example = "team", allowableValues = {"public", "team",
        "private"})
    private String profileVisibility;

    @Schema(description = "是否显示邮箱", example = "false")
    private Boolean showEmail;

    @Schema(description = "是否显示活动", example = "true")
    private Boolean showActivity;
  }
}
