package com.agentx.core.workflow.node;

import com.agentx.core.workflow.enums.NodeType;
import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import dev.langchain4j.model.chat.ChatModel;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * LLM 节点 — 直接调用大语言模型
 */
@Slf4j
@RequiredArgsConstructor
public class LlmNodeExecutor implements NodeExecutor {

  private final ChatModel chatModel;

  @Override
  public String getNodeType() {
    return NodeType.LLM.name();
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    if (config == null) {
      throw new IllegalArgumentException(
          "LLM node requires config with systemPrompt and userPrompt");
    }

    String systemPrompt = (String) config.getOrDefault("systemPrompt", "");
    String userPrompt = (String) config.getOrDefault("userPrompt", "");

    log.debug("LLM node executing with userPrompt length: {}", userPrompt.length());

    String response = chatModel.chat(systemPrompt + "\n\n" + userPrompt);

    Map<String, Object> outputs = new HashMap<>();
    outputs.put("text", response);
    outputs.put("response", Map.of("text", response));
    return outputs;
  }
}
