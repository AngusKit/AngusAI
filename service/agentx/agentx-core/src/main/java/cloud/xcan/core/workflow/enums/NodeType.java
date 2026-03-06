package cloud.xcan.core.workflow.enums;

/**
 * 工作流节点类型
 */
public enum NodeType {
  START,
  END,
  LLM,
  AGENT,
  TOOL,
  HTTP,
  CODE,
  CONDITION,
  SWITCH,
  LOOP,
  WHILE,
  PARALLEL,
  WAIT,
  SUB_WORKFLOW,
  SET_VARIABLE,
  KNOWLEDGE_RETRIEVAL
}
