package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

@Converter
public class SecurityRequirementConverter implements
    AttributeConverter<List<SecurityRequirement>, String> {

  @Override
  public String convertToDatabaseColumn(List<SecurityRequirement> attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public List<SecurityRequirement> convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, new TypeReference<List<SecurityRequirement>>() {
      });
    } catch (Exception e) {
      return null;
    }
  }
}
