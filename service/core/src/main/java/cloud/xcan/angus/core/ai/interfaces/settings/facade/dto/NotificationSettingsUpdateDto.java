package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 更新通知设置请求参数
 */
@Data
@Schema(description = "更新通知设置请求参数")
public class NotificationSettingsUpdateDto {

  @Schema(description = "邮件通知设置")
  private EmailNotificationDto email;

  @Schema(description = "浏览器通知设置")
  private BrowserNotificationDto browser;

  @Schema(description = "应用内通知设置")
  private InAppNotificationDto inApp;

  @Schema(description = "移动推送设置")
  private MobileNotificationDto mobile;

  @Data
  @Schema(description = "邮件通知设置")
  public static class EmailNotificationDto {

    @Schema(description = "是否启用", example = "true")
    private Boolean enabled;

    @Schema(description = "频率", example = "immediately", allowableValues = {"immediately", "daily", "weekly"})
    private String frequency;

    @Schema(description = "通知类型")
    private NotificationTypesDto notifications;
  }

  @Data
  @Schema(description = "浏览器通知设置")
  public static class BrowserNotificationDto {

    @Schema(description = "是否启用", example = "true")
    private Boolean enabled;

    @Schema(description = "通知类型")
    private BrowserNotificationTypesDto notifications;
  }

  @Data
  @Schema(description = "应用内通知设置")
  public static class InAppNotificationDto {

    @Schema(description = "是否启用", example = "true")
    private Boolean enabled;

    @Schema(description = "是否显示徽章", example = "true")
    private Boolean showBadge;

    @Schema(description = "是否播放声音", example = "true")
    private Boolean playSound;
  }

  @Data
  @Schema(description = "移动推送设置")
  public static class MobileNotificationDto {

    @Schema(description = "是否启用", example = "false")
    private Boolean enabled;

    @Schema(description = "免打扰时间")
    private QuietHoursDto quietHours;
  }

  @Data
  @Schema(description = "通知类型")
  public static class NotificationTypesDto {

    @Schema(description = "系统更新")
    private Boolean systemUpdates;

    @Schema(description = "安全警告")
    private Boolean securityAlerts;

    @Schema(description = "使用量警告")
    private Boolean usageAlerts;

    @Schema(description = "账单通知")
    private Boolean billingNotices;

    @Schema(description = "团队邀请")
    private Boolean teamInvitations;

    @Schema(description = "资源分享")
    private Boolean resourceSharing;

    @Schema(description = "工作流状态")
    private Boolean workflowStatus;

    @Schema(description = "API错误")
    private Boolean apiErrors;
  }

  @Data
  @Schema(description = "浏览器通知类型")
  public static class BrowserNotificationTypesDto {

    @Schema(description = "对话消息")
    private Boolean chatMessages;

    @Schema(description = "工作流完成")
    private Boolean workflowComplete;

    @Schema(description = "错误警告")
    private Boolean errorAlerts;
  }

  @Data
  @Schema(description = "免打扰时间")
  public static class QuietHoursDto {

    @Schema(description = "是否启用", example = "false")
    private Boolean enabled;

    @Schema(description = "开始时间", example = "22:00")
    private String start;

    @Schema(description = "结束时间", example = "08:00")
    private String end;
  }
}
