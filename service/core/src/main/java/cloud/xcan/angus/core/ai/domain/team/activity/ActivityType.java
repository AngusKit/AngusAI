package cloud.xcan.angus.core.ai.domain.team.activity;

import cloud.xcan.angus.spec.ValueObject;

public enum ActivityType implements ValueObject<ActivityType> {
  ;

  public String getValue() {
    return this.name();
  }

  public String getDescMessageKey() {
    return "xcm.ai.activity." + this.name();
  }

  public String getDetailMessageKey() {
    return "xcm.ai.activity.detail." + this.name();
  }

}

