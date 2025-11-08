package cloud.xcan.angus.core.ai.domain.dataset;

public enum DatasetStatus{
  ACTIVE,       // 已激活
  INACTIVE,     // 非活跃
  PREPARING;    // 准备中

  public String getValue() {
    return this.name();
  }
}
