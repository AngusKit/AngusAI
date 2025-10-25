package cloud.xcan.angus.core.ai.domain.prompt;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PromptStatus {
  ACTIVE("active", "激活"),
  INACTIVE("inactive", "未激活"),
  ARCHIVED("archived", "已归档");

  private final String code;
  private final String desc;

  PromptStatus(String code, String desc) {
    this.code = code;
    this.desc = desc;
  }

  @JsonValue
  public String getCode() {
    return code;
  }

  public String getDesc() {
    return desc;
  }

  @JsonCreator
  public static PromptStatus fromCode(String code) {
    for (PromptStatus status : PromptStatus.values()) {
      if (status.code.equals(code)) {
        return status;
      }
    }
    throw new IllegalArgumentException("Unknown prompt status: " + code);
  }
}
