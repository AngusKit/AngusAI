package cloud.xcan.angus.core.ai.domain.dataset;

public enum DatasetType {
  FILE,   // 表格数据(Excel或CSV)
  DATASOURCE;   // 数据源

  public String getValue() {
    return this.name();
  }

  public boolean isDatasource() {
    return this.equals(DATASOURCE);
  }
}
