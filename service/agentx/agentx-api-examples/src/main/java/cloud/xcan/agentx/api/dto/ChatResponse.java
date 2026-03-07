package cloud.xcan.agentx.api.dto;

import lombok.Data;

@Data
public class ChatResponse {

  private String agentId;
  private String sessionId;
  private String reply;
  private long latencyMs;
}
