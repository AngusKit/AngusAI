package cloud.xcan.agentx.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import lombok.Data;

@Data
public class WorkflowRunRequest {

  @NotBlank
  private String workflowId;

  private Map<String, Object> variables;
}
