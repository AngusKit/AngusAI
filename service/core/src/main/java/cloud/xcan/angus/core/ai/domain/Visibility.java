package cloud.xcan.angus.core.ai.domain;

public enum Visibility {
  PRIVATE,      // 私有
  TEAM,         // 团队
  PUBLIC;       // 公开

  public String getValue() {
    return this.name();
  }
}
