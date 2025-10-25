package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 通知设置详情
 */
@Data
@Schema(description = "通知设置详情")
public class NotificationSettingsVo {

  @Schema(description = "邮件通知设置")
  private EmailNotificationVo email;

  @Schema(description = "浏览器通知设置")
  private BrowserNotificationVo browser;

  @Schema(description = "应用内通知设置")
  private InAppNotificationVo inApp;

  @Schema(description = "移动推送设置")
  private MobileNotificationVo mobile;

  @Data
  @Schema(description = "邮件通知设置")
  public static class EmailNotificationVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "频率")
    private String frequency;

    @Schema(description = "通知类型")
    private NotificationTypesVo notifications;
  }

  @Data
  @Schema(description = "浏览器通知设置")
  public static class BrowserNotificationVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "通知类型")
    private BrowserNotificationTypesVo notifications;
  }

  @Data
  @Schema(description = "应用内通知设置")
  public static class InAppNotificationVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "是否显示徽章")
    private Boolean showBadge;

    @Schema(description = "是否播放声音")
    private Boolean playSound;
  }

  @Data
  @Schema(description = "移动推送设置")
  public static class MobileNotificationVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "免打扰时间")
    private QuietHoursVo quietHours;
  }

  @Data
  @Schema(description = "通知类型")
  public static class NotificationTypesVo {
    private Boolean systemUpdates;
    private Boolean securityAlerts;
    private Boolean usageAlerts;
    private Boolean billingNotices;
    private Boolean teamInvitations;
    private Boolean resourceSharing;
    private Boolean workflowStatus;
    private Boolean apiErrors;
  }

  @Data
  @Schema(description = "浏览器通知类型")
  public static class BrowserNotificationTypesVo {
    private Boolean chatMessages;
    private Boolean workflowComplete;
    private Boolean errorAlerts;
  }

  @Data
  @Schema(description = "免打扰时间")
  public static class QuietHoursVo {
    private Boolean enabled;
    private String start;
    private String end;
  }
}
