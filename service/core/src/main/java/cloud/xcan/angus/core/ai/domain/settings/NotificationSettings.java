package cloud.xcan.angus.core.ai.domain.settings;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 通知设置
 */
@Data
@Accessors(chain = true)
public class NotificationSettings {

  /**
   * 邮件通知设置
   */
  private EmailNotification email = new EmailNotification();

  /**
   * 浏览器通知设置
   */
  private BrowserNotification browser = new BrowserNotification();

  /**
   * 应用内通知设置
   */
  private InAppNotification inApp = new InAppNotification();

  /**
   * 移动推送设置
   */
  private MobileNotification mobile = new MobileNotification();

  @Data
  @Accessors(chain = true)
  public static class EmailNotification {

    private Boolean enabled = true;
    private String frequency = "immediately"; // immediately, daily, weekly

    // 具体通知类型
    private NotificationTypes notifications = new NotificationTypes();
  }

  @Data
  @Accessors(chain = true)
  public static class BrowserNotification {

    private Boolean enabled = true;
    private BrowserNotificationTypes notifications = new BrowserNotificationTypes();
  }

  @Data
  @Accessors(chain = true)
  public static class InAppNotification {

    private Boolean enabled = true;
    private Boolean showBadge = true;
    private Boolean playSound = true;
  }

  @Data
  @Accessors(chain = true)
  public static class MobileNotification {

    private Boolean enabled = false;
    private QuietHours quietHours = new QuietHours();
  }

  @Data
  @Accessors(chain = true)
  public static class NotificationTypes {

    private Boolean systemUpdates = true;
    private Boolean securityAlerts = true;
    private Boolean usageAlerts = true;
    private Boolean billingNotices = true;
    private Boolean teamInvitations = true;
    private Boolean resourceSharing = true;
    private Boolean workflowStatus = true;
    private Boolean apiErrors = true;
  }

  @Data
  @Accessors(chain = true)
  public static class BrowserNotificationTypes {

    private Boolean chatMessages = true;
    private Boolean workflowComplete = true;
    private Boolean errorAlerts = true;
  }

  @Data
  @Accessors(chain = true)
  public static class QuietHours {

    private Boolean enabled = false;
    private String start = "22:00";
    private String end = "08:00";
  }
}
