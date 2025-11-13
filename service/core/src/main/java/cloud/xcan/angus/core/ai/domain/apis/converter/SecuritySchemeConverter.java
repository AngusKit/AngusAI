package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import io.swagger.v3.oas.models.security.SecurityScheme;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class SecuritySchemeConverter implements AttributeConverter<SecurityScheme, String> {

  @Override
  public String convertToDatabaseColumn(SecurityScheme attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public SecurityScheme convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, SecurityScheme.class);
    } catch (Exception e) {
      return null;
    }
  }
}
