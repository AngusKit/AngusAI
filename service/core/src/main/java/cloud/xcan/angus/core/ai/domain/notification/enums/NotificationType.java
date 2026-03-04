package cloud.xcan.angus.core.ai.domain.notification.enums;

import cloud.xcan.angus.spec.experimental.Value;

/**
 * 通知类型枚举
 */
public enum NotificationType implements Value<String> {
  SUCCESS,    // 成功
  WARNING,     // 警告
  INFO;        // 信息

  @Override
  public String getValue() {
    return this.name();
  }
}
