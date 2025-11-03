package cloud.xcan.angus.api.commonlink;

import cloud.xcan.angus.spec.locale.EnumMessage;

public enum FullResourceType implements EnumMessage<String> {
  ;

  @Override
  public String getValue() {
    return this.name();
  }

  public boolean isParent() {
    return false;
  }
}
