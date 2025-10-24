package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ApplicationStatus implements EnumMessage<String> {
  DRAFT, // 草稿
  PUBLISHED, // 已发布
  PAUSED; // 已暂停

  public String getValue() {
    return this.name();
  }
}
