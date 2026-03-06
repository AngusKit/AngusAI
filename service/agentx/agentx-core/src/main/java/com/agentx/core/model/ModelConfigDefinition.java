package com.agentx.core.model;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 模型配置定义 — 从数据库或其他外部源加载的模型配置
 */
@Data
@Builder
public class ModelConfigDefinition {

  /**
   * 配置唯一标识
   */
  private String id;

  /**
   * 模型提供商: openai / anthropic / ollama 等
   */
  private String provider;

  /**
   * 模型名称
   */
  private String modelName;

  /**
   * API Key（加密存储）
   */
  private String apiKey;

  /**
   * API Base URL（用于自托管或代理）
   */
  private String baseUrl;

  /**
   * 温度参数
   */
  @Builder.Default
  private Double temperature = 0.7;

  /**
   * 最大 Token 数
   */
  @Builder.Default
  private Integer maxTokens = 4096;

  /**
   * Embedding 模型名称
   */
  private String embeddingModelName;

  /**
   * 是否为默认配置
   */
  @Builder.Default
  private boolean defaultConfig = false;

  /**
   * 租户 ID（null 为全局）
   */
  private String tenantId;

  /**
   * 扩展参数
   */
  private Map<String, Object> extraProperties;
}
