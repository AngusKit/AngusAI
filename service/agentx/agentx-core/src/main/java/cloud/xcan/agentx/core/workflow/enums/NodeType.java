package cloud.xcan.agentx.core.workflow.enums;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 工作流节点类型
 */
@Schema(description = "工作流节点类型")
public enum NodeType {
  @Schema(description = "工作流入口节点")
  START,
  @Schema(description = "工作流终止节点")
  END,
  @Schema(description = "调用大语言模型")
  LLM,
  @Schema(description = "调用已注册 Agent")
  AGENT,
  @Schema(description = "调用工具")
  TOOL,
  @Schema(description = "发起 HTTP 请求")
  HTTP,
  @Schema(description = "执行代码片段")
  CODE,
  @Schema(description = "条件分支")
  CONDITION,
  @Schema(description = "多路分支")
  SWITCH,
  @Schema(description = "for-each 循环")
  LOOP,
  @Schema(description = "条件循环")
  WHILE,
  @Schema(description = "并行执行")
  PARALLEL,
  @Schema(description = "等待节点（人工审批/延时）")
  WAIT,
  @Schema(description = "调用子工作流")
  SUB_WORKFLOW,
  @Schema(description = "设置变量")
  SET_VARIABLE,
  @Schema(description = "知识库检索")
  KNOWLEDGE_RETRIEVAL
}
