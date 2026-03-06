package com.agentx.infrastructure.security;

import lombok.Data;

import java.util.Set;

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
