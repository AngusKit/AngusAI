package cloud.xcan.agentx.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import lombok.Data;

@Data
public class ChatRequest {

  @NotBlank
  private String agentId;

  @NotBlank
  private String message;

  private String sessionId;

  private Map<String, Object> variables;
}
