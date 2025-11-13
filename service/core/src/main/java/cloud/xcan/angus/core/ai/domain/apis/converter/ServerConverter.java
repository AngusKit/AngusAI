package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import io.swagger.v3.oas.models.servers.Server;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ServerConverter implements AttributeConverter<Server, String> {

  @Override
  public String convertToDatabaseColumn(Server attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public Server convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, Server.class);
    } catch (Exception e) {
      return null;
    }
  }
}
