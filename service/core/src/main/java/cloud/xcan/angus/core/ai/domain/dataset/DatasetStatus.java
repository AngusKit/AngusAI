package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DatasetStatus implements EnumMessage<String> {
  ACTIVE,       // 活跃
  INACTIVE,     // 非活跃
  PREPARING;    // 准备中

  public String getValue() {
    return this.name();
  }
}
