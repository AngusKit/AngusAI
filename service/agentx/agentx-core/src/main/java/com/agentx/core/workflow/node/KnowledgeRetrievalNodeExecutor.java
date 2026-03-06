package com.agentx.core.workflow.node;

import com.agentx.core.workflow.enums.NodeType;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * KNOWLEDGE_RETRIEVAL 节点 — 检索知识库
 */
@Slf4j
public class KnowledgeRetrievalNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return NodeType.KNOWLEDGE_RETRIEVAL.name();
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String query = (String) config.get("query");
    int topK = config.containsKey("topK") ? ((Number) config.get("topK")).intValue() : 5;
    var knowledgeBaseIds = config.getOrDefault("knowledgeBaseIds", java.util.List.of());

    log.debug("KNOWLEDGE_RETRIEVAL: query='{}', topK={}, kbIds={}", query, topK, knowledgeBaseIds);

    // 实际实现需要通过 KnowledgeService 检索
    return Map.of("query", query, "topK", topK, "results", java.util.List.of());
  }
}
