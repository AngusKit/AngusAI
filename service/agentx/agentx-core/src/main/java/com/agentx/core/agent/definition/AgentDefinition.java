package com.agentx.core.agent.definition;

import com.agentx.core.agent.enums.AutonomyLevel;
import com.agentx.core.agent.enums.InteractionMode;
import com.agentx.core.agent.enums.ReasoningStrategy;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent 声明式定义 — 对应 YAML/JSON 配置文件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentDefinition {

  /**
   * 唯一标识
   */
  private String id;

  /**
   * 名称
   */
  private String name;

  /**
   * 描述
   */
  private String description;

  /**
   * 版本
   */
  private String version;

  /**
   * 交互模式
   */
  @Builder.Default
  private InteractionMode interactionMode = InteractionMode.CHATBOT;

  /**
   * 推理策略
   */
  @Builder.Default
  private ReasoningStrategy reasoningStrategy = ReasoningStrategy.FUNCTION_CALLING;

  /**
   * 自治等级
   */
  @Builder.Default
  private AutonomyLevel autonomyLevel = AutonomyLevel.ASSISTANT;

  /**
   * 模型配置
   */
  private ModelConfig model;

  /**
   * 系统提示词
   */
  private String systemPrompt;

  /**
   * 开场白
   */
  private String welcomeMessage;

  /**
   * 建议问题列表
   */
  private List<String> suggestedQuestions;

  /**
   * 绑定的工具 ID 列表
   */
  private List<String> toolIds;

  /**
   * 绑定的技能名称列表（对应 LangChain4j Skill.name()）
   */
  private List<String> skillIds;

  /**
   * 绑定的知识库 ID 列表
   */
  private List<String> knowledgeBaseIds;

  /**
   * 记忆策略配置
   */
  private MemoryConfig memory;

  /**
   * 护栏配置
   */
  private GuardrailConfig guardrails;

  /**
   * 变量与上下文注入映射
   */
  private Map<String, String> variables;

  /**
   * 多渠道发布配置
   */
  private List<String> publishChannels;

  /**
   * 租户 ID
   */
  private String tenantId;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ModelConfig {

    private String provider;
    private String modelName;
    @Builder.Default
    private Double temperature = 0.7;
    @Builder.Default
    private Integer maxTokens = 4096;
    private String fallbackProvider;
    private String fallbackModelName;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class MemoryConfig {

    /**
     * 策略: NONE / MESSAGE_WINDOW / TOKEN_WINDOW / SUMMARY
     * 兼容历史配置: SLIDING_WINDOW → MESSAGE_WINDOW，PERSISTENT → MESSAGE_WINDOW
     */
    @Builder.Default
    private String strategy = "MESSAGE_WINDOW";
    /** 消息窗口大小（条数），用于 MESSAGE_WINDOW / SUMMARY */
    @Builder.Default
    private Integer windowSize = 20;
    /** Token 上限，用于 TOKEN_WINDOW */
    @Builder.Default
    private Integer maxTokens = 8000;
    /** SUMMARY 策略的摘要提示词，可用 {{messages}} 占位符，不配置则用默认模板 */
    private String summaryPrompt;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class GuardrailConfig {

    private List<String> inputGuardrailIds;
    private List<String> outputGuardrailIds;
  }
}
