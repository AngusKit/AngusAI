package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.Value;

public enum ModelStatus implements Value<String> {
  ACTIVE,    // 激活
  DISABLED;  // 禁用

  public String getValue() {
    return this.name();
  }
}
