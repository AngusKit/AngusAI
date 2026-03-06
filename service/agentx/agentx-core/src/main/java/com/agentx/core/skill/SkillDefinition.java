package com.agentx.core.skill;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

/**
 * 技能定义 — 描述一个可复用的 Agent 能力单元。
 * <p>
 * 技能将相关的工具、提示词片段和行为规则打包为一个可组合单元， Agent 通过绑定多个技能来获得复合能力。
 * </p>
 */
@Data
@Builder
public class SkillDefinition {

  /**
   * 技能唯一标识
   */
  private String id;

  /**
   * 技能名称
   */
  private String name;

  /**
   * 技能描述
   */
  private String description;

  /**
   * 版本
   */
  @Builder.Default
  private String version = "1.0.0";

  /**
   * 技能分类: reasoning / tool_use / knowledge / communication / coding / analysis
   */
  private String category;

  /**
   * 该技能需要的工具 ID 列表
   */
  private List<String> toolIds;

  /**
   * 该技能的系统提示词片段（会追加到 Agent 系统提示词中）
   */
  private String promptFragment;

  /**
   * 技能的输入参数定义（用于结构化调用）
   */
  private Map<String, ParameterDefinition> inputParameters;

  /**
   * 技能的输出格式描述
   */
  private String outputFormat;

  /**
   * 技能的使用示例
   */
  private List<String> examples;

  /**
   * 关联的知识库 ID（用于 RAG 技能）
   */
  private List<String> knowledgeBaseIds;

  /**
   * 技能的护栏配置
   */
  private SkillGuardrails guardrails;

  /**
   * 是否启用
   */
  @Builder.Default
  private boolean enabled = true;

  /**
   * 扩展属性
   */
  private Map<String, Object> extraProperties;

  @Data
  @Builder
  public static class ParameterDefinition {

    private String name;
    private String type;
    private String description;
    private boolean required;
    private Object defaultValue;
  }

  @Data
  @Builder
  public static class SkillGuardrails {

    private List<String> inputGuardrailIds;
    private List<String> outputGuardrailIds;
  }
}
