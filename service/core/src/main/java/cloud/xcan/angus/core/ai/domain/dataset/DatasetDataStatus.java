package cloud.xcan.angus.core.ai.domain.dataset;

public enum DatasetDataStatus  {
  PENDING, // 待处理
  PROCESSING, // 处理中
  COMPLETED, // 已完成
  FAILED; // 处理失败

  public String getValue() {
    return this.name();
  }
}
