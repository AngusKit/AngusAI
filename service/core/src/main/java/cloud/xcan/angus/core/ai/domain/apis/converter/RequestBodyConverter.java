package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import io.swagger.v3.oas.models.parameters.RequestBody;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class RequestBodyConverter implements AttributeConverter<RequestBody, String> {

  @Override
  public String convertToDatabaseColumn(RequestBody attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public RequestBody convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, RequestBody.class);
    } catch (Exception e) {
      return null;
    }
  }
}
