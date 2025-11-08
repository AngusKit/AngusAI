package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DatasetDataType implements EnumMessage<String> {
  EXCEL,   // Excel文件
  CSV,  // CSV文件
  JSON, // JSON文件
  TABLE;   // 数据表

  public String getValue() {
    return this.name();
  }
}
