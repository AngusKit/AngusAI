package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumValueMessage;

@EndpointRegister
public enum DatabaseType implements EnumValueMessage<String> {
  MySQL,
  SQLServer,
  DB2,
  PostgreSQL,
  Oracle;

  public String getValue() {
    return this.name();
  }
}
