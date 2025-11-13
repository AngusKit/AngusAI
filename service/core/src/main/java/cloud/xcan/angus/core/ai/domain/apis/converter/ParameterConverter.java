package cloud.xcan.angus.core.ai.domain.apis.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.v3.oas.models.parameters.Parameter;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

@Converter
public class ParameterConverter implements AttributeConverter<List<Parameter>, String> {

  @Override
  public String convertToDatabaseColumn(List<Parameter> attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public List<Parameter> convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData, new TypeReference<List<Parameter>>() {
      });
    } catch (Exception e) {
      return null;
    }
  }
}
