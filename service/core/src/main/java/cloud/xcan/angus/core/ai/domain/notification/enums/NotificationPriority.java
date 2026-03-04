package cloud.xcan.angus.core.ai.domain.notification.enums;

import cloud.xcan.angus.spec.experimental.Value;

/**
 * 通知优先级枚举
 */
public enum NotificationPriority implements Value<String> {
  HIGH,       // 高优先级
  MEDIUM,     // 中优先级
  LOW;        // 低优先级

  @Override
  public String getValue() {
    return this.name();
  }
}
