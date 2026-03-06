package com.agentx.core.skill;

import java.util.Map;

/**
 * 技能 SPI — 定义可执行技能的扩展点。
 * <p>
 * 除了声明式的 {@link SkillDefinition}，开发者也可以实现此接口来提供 编程式技能，支持自定义执行逻辑。
 * </p>
 */
public interface Skill {

  /**
   * 获取技能定义
   */
  SkillDefinition getDefinition();

  /**
   * 执行技能（用于编程式触发）
   *
   * @param input 输入参数
   * @return 执行结果
   */
  String execute(Map<String, Object> input);

  /**
   * 技能是否可用（运行时检查）
   */
  default boolean isAvailable() {
    return getDefinition().isEnabled();
  }
}
