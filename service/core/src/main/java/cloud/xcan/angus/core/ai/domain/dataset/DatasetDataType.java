package cloud.xcan.angus.core.ai.domain.dataset;

public enum DatasetDataType {
  EXCEL,   // Excel文件
  CSV,  // CSV文件
  JSON, // JSON文件
  XML, // XML
  TABLE;   // 数据表

  public String getValue() {
    return this.name();
  }
}
