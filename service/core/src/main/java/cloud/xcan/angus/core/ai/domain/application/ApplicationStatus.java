package cloud.xcan.angus.core.ai.domain.application;

public enum ApplicationStatus {
  DRAFT, // 草稿
  PUBLISHED, // 已发布
  PAUSED; // 已暂停

  public String getValue() {
    return this.name();
  }

  public boolean isPublished() {
    return this.equals(PUBLISHED);
  }
}
