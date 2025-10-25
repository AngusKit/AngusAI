package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ModelStatus implements EnumMessage<String> {
  STOPPED,       // 已停止
  DEPLOYING,     // 部署中
  RUNNING,       // 运行中
  ERROR;         // 错误

  public String getValue() {
    return this.name();
  }
}
