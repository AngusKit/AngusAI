package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DocumentVisibility implements EnumMessage<String> {
  PRIVATE, // 私有
  PUBLIC, // 公开
  SHARED; // 共享

  public String getValue() {
    return this.name();
  }
}
