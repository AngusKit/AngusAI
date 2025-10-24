package cloud.xcan.angus.core.ai.domain.activity;

import cloud.xcan.angus.spec.ValueObject;

public enum ActivityType implements ValueObject<ActivityType> {
  ;

  public String getValue() {
    return this.name();
  }

  public String getDescMessageKey() {
    return "xcm.tester.activity." + this.name();
  }

  public String getDetailMessageKey() {
    return "xcm.tester.activity.detail." + this.name();
  }

}

