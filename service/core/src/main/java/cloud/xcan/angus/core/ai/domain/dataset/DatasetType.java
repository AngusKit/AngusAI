package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DatasetType implements EnumMessage<String> {
  TEXT,         // 文本数据
  TABLE,        // 表格数据
  DATASOURCE;   // 数据源

  public String getValue() {
    return this.name();
  }
}
