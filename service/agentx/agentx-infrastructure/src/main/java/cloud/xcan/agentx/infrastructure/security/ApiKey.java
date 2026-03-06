package cloud.xcan.agentx.infrastructure.security;

import java.util.Set;
import lombok.Data;

/**
 * API Key 实体
 */
@Data
public class ApiKey {

  private String key;
  private String tenantId;
  private String name;
  private Set<String> scopes;
  private boolean active;
}
