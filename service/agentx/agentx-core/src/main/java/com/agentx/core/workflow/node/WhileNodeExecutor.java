package com.agentx.core.workflow.node;

import com.agentx.core.workflow.enums.NodeType;

import com.agentx.core.workflow.engine.NodeExecutionContext;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

/**
 * WHILE 节点 — 条件循环
 */
@Slf4j
public class WhileNodeExecutor implements NodeExecutor {

  private final ExpressionParser parser = new SpelExpressionParser();

  @Override
  public String getNodeType() {
    return NodeType.WHILE.name();
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    String condition = (String) config.get("condition");
    int maxIterations = config.containsKey("maxIterations") ?
        ((Number) config.get("maxIterations")).intValue() : 100;

    StandardEvaluationContext evalContext = new StandardEvaluationContext();
    evalContext.setVariable("variables", context.getVariables());
    evalContext.setVariable("nodes", context.getNodeOutputs());

    int iterations = 0;
    while (iterations < maxIterations) {
      try {
        Boolean result = parser.parseExpression(condition).getValue(evalContext, Boolean.class);
        if (!Boolean.TRUE.equals(result)) {
          break;
        }
      } catch (Exception e) {
        log.warn("WHILE condition evaluation failed: {}", e.getMessage());
        break;
      }
      iterations++;
    }

    return Map.of("iterations", iterations);
  }
}
