package com.agentx.core.workflow.engine;

import java.util.Map;

/**
 * 节点执行器 SPI — 每种节点类型实现此接口
 */
public interface NodeExecutor {

  /**
   * @return 处理的节点类型标识（如 START, LLM, HTTP, CONDITION 等）
   */
  String getNodeType();

  /**
   * 执行节点
   *
   * @param context 工作流执行上下文
   * @return 节点输出
   */
  Map<String, Object> execute(NodeExecutionContext context);
}
