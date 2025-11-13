package cloud.xcan.angus.core.ai.domain.apis.converter;


import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.swagger.v3.core.util.DeserializationModule;
import io.swagger.v3.core.util.Json31;
import io.swagger.v3.core.util.SecuritySchemeDeserializer;
import io.swagger.v3.oas.models.responses.ApiResponse;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Map;

/**
 * @see Json31
 * @see DeserializationModule
 * @see SecuritySchemeDeserializer Note:: The default implementation will ignore $ref
 */
@Converter
public class ApiResponseConverter implements AttributeConverter<Map<String, ApiResponse>, String> {

  // Fix:: Scheme type is missing
  // public static final ObjectMapper OPENAPI_MAPPER = Json31.mapper();
  public static final ObjectMapper OPENAPI_MAPPER = Json31.converterMapper();

  static {
    // Overlay Configuration
    OPENAPI_MAPPER.configure(SerializationFeature.WRITE_BIGDECIMAL_AS_PLAIN, false);
  }

  @Override
  public String convertToDatabaseColumn(Map<String, ApiResponse> attribute) {
    try {
      return OPENAPI_MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public Map<String, ApiResponse> convertToEntityAttribute(String dbData) {
    if (isEmpty(dbData)) {
      return null;
    }
    try {
      return OPENAPI_MAPPER.readValue(dbData,
          new TypeReference<Map<String, ApiResponse>>() {
          });
    } catch (Exception e) {
      return null;
    }
  }
}
