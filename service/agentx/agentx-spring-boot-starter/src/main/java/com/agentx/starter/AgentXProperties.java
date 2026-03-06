package com.agentx.starter;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * AgentX 配置属性
 */
@Data
@ConfigurationProperties(prefix = "agentx")
public class AgentXProperties {

  /**
   * 默认模型提供商 (openai / anthropic / ollama)
   */
  private String defaultProvider = "openai";

  /**
   * 默认模型名称
   */
  private String defaultModel = "gpt-4o";

  /**
   * 默认记忆窗口大小
   */
  private int memoryWindowSize = 20;

  /**
   * 是否启用 Guardrails
   */
  private boolean guardrailsEnabled = true;

  /**
   * 是否启用可观测性
   */
  private boolean observabilityEnabled = true;

  /**
   * Agent 定义目录（classpath 下）
   */
  private String agentDefinitionsPath = "agents/";

  /**
   * Workflow 定义目录（classpath 下）
   */
  private String workflowDefinitionsPath = "workflows/";
}
