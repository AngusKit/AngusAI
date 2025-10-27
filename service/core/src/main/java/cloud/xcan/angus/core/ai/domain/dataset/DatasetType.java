package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DatasetType implements EnumMessage<String> {
  FILE,   // 表格数据(Excel或CSV)
  DATASOURCE;   // 数据源

  public String getValue() {
    return this.name();
  }

  public boolean isDatasource(){
    return this.equals(DATASOURCE);
  }
}
