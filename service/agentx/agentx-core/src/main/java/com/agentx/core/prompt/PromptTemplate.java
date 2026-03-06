package com.agentx.core.prompt;

import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 提示词模板
 */
@Data
@Builder
public class PromptTemplate {

  private String id;
  private String name;
  private String category;
  private String content;
  private int version;
  private Map<String, String> variables;
  private String tenantId;
  private Instant createdAt;
  private Instant updatedAt;
}
