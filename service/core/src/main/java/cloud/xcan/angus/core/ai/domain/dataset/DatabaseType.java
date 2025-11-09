package cloud.xcan.angus.core.ai.domain.dataset;

public enum DatabaseType {
  MySQL,
  SQLServer,
  DB2,
  PostgreSQL,
  Oracle,
  DM;

  public String getValue() {
    return this.name();
  }
}
