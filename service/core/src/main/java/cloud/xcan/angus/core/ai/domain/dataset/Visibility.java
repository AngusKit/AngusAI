package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum Visibility implements EnumMessage<String> {
  PRIVATE,      // 私有
  TEAM,         // 团队
  PUBLIC;       // 公开

  public String getValue() {
    return this.name();
  }
}
