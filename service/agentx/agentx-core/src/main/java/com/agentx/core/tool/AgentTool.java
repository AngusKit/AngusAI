package com.agentx.core.tool;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 标注方法为 AgentX 可用工具
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AgentTool {

  /**
   * 工具 ID
   */
  String id();

  /**
   * 工具名称
   */
  String name() default "";

  /**
   * 工具描述
   */
  String description() default "";

  /**
   * 工具分类
   */
  String category() default "custom";
}
