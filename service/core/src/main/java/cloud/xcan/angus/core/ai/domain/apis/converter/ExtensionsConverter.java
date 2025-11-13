package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Map;

@Converter
public class ExtensionsConverter implements AttributeConverter<Map<String, Object>, String> {

  @Override
  public String convertToDatabaseColumn(Map<String, Object> attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public Map<String, Object> convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, new TypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      return null;
    }
  }
}
