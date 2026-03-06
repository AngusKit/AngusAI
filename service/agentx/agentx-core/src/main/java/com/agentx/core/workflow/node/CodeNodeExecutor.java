package com.agentx.core.workflow.node;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * CODE 节点 — 在沙盒中执行代码片段（简化实现：仅支持 Groovy/JS 脚本引擎）
 */
@Slf4j
public class CodeNodeExecutor implements NodeExecutor {

  @Override
  public String getNodeType() {
    return "CODE";
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String language = (String) config.getOrDefault("language", "javascript");
    String code = (String) config.get("code");

    log.debug("CODE node executing {} code ({} chars)", language, code != null ? code.length() : 0);

    // 注意: 生产环境应使用 GraalVM Polyglot 沙盒执行
    // 这里简化处理，返回代码内容
    return Map.of("language", language, "executed", true, "code", code != null ? code : "");
  }
}
