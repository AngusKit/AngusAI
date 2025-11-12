package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.Value;

public enum ModelStatus implements Value<String> {
  STOPPED,       // 已停止
  RUNNING,       // 运行中
  ERROR;         // 错误

  public String getValue() {
    return this.name();
  }
}
