package cloud.xcan.core.workflow.node;

import cloud.xcan.core.workflow.engine.NodeExecutionContext;
import cloud.xcan.core.workflow.enums.NodeType;

import cloud.xcan.core.workflow.engine.NodeExecutor;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

/**
 * CONDITION 节点 — if-else 分支判断
 */
@Slf4j
public class ConditionNodeExecutor implements NodeExecutor {

  private final ExpressionParser parser = new SpelExpressionParser();

  @Override
  public String getNodeType() {
    return NodeType.CONDITION.name();
  }

  @Override
  public Map<String, Object> execute(NodeExecutionContext context) {
    Map<String, Object> config = context.getNodeDefinition().getConfig();
    if (config == null) {
      throw new IllegalArgumentException("CONDITION node requires config with expression");
    }

    String expression = (String) config.get("expression");
    String ifTrue = (String) config.get("ifTrue");
    String ifFalse = (String) config.get("ifFalse");

    StandardEvaluationContext evalContext = new StandardEvaluationContext();
    evalContext.setVariable("nodes", context.getNodeOutputs());
    evalContext.setVariable("variables", context.getVariables());

    boolean result;
    try {
      result = Boolean.TRUE.equals(
          parser.parseExpression(expression).getValue(evalContext, Boolean.class));
    } catch (Exception e) {
      log.warn("Condition expression evaluation failed: {} — {}", expression, e.getMessage());
      result = false;
    }

    String nextNode = result ? ifTrue : ifFalse;
    log.debug("CONDITION evaluated to {} → next: {}", result, nextNode);

    return Map.of(
        "result", result,
        "nextNode", nextNode != null ? nextNode : ""
    );
  }
}
