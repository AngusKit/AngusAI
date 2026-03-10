package cloud.xcan.angus.core.ai.domain.apis;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;
import lombok.Getter;

@EndpointRegister
@Getter
public enum ApiComponentType implements EnumMessage<String> {
  schemas, responses, parameters,
  examples, requestBodies, headers,
  securitySchemes, links, callbacks, extensions, pathItems;

  public boolean isSecuritySchemes() {
    return this.equals(securitySchemes);
  }

  @Override
  public String getValue() {
    return this.name();
  }

}
