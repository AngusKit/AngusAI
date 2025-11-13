package cloud.xcan.angus.core.ai.domain.apis.converter;

import cloud.xcan.angus.spec.utils.StringUtils;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import java.io.IOException;

public class AuthTypeSerializer extends JsonDeserializer<Type> {

  @Override
  public Type deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {
    ObjectCodec codec = parser.getCodec();
    JsonNode node = codec.readTree(parser);
    String code = node.asText();
    for (Type type : Type.values()) {
      if (StringUtils.equalsIgnoreCase(code, type.toString())) {
        return type;
      }
    }
    throw new IllegalArgumentException("Invalid Type: " + code);
  }
}
