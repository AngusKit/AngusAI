package com.agentx.core.workflow.expression;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

/**
 * SpEL 表达式引擎 — 解析 ${...} 表达式
 */
@Slf4j
@Component
public class ExpressionEngine {

  private static final Pattern EXPR_PATTERN = Pattern.compile("\\$\\{(.+?)}");
  private final ExpressionParser parser = new SpelExpressionParser();

  /**
   * 解析并替换字符串中的 ${...} 表达式
   */
  public Object resolve(String template, Map<String, Object> context) {
    if (template == null) {
      return null;
    }

    Matcher matcher = EXPR_PATTERN.matcher(template);

    // 如果整个字符串是一个表达式，返回原始类型
    if (matcher.matches()) {
      return evaluate(matcher.group(1), context);
    }

    // 否则做字符串拼接替换
    StringBuilder sb = new StringBuilder();
    while (matcher.find()) {
      Object result = evaluate(matcher.group(1), context);
      matcher.appendReplacement(sb, Matcher.quoteReplacement(String.valueOf(result)));
    }
    matcher.appendTail(sb);
    return sb.toString();
  }

  /**
   * 解析并替换 Map 中所有值的表达式
   */
  @SuppressWarnings("unchecked")
  public Map<String, Object> resolveMap(Map<String, Object> map, Map<String, Object> context) {
    if (map == null) {
      return Map.of();
    }
    map.replaceAll((k, v) -> {
      if (v instanceof String str) {
        return resolve(str, context);
      } else if (v instanceof Map) {
        return resolveMap((Map<String, Object>) v, context);
      }
      return v;
    });
    return map;
  }

  private Object evaluate(String expression, Map<String, Object> context) {
    try {
      EvaluationContext evalContext = new StandardEvaluationContext();
      context.forEach(((StandardEvaluationContext) evalContext)::setVariable);

      // 以 root 对象注册常用变量
      StandardEvaluationContext stdCtx = (StandardEvaluationContext) evalContext;
      if (context.containsKey("variables")) {
        stdCtx.setVariable("variables", context.get("variables"));
      }
      if (context.containsKey("nodes")) {
        stdCtx.setVariable("nodes", context.get("nodes"));
      }
      if (context.containsKey("secrets")) {
        stdCtx.setVariable("secrets", context.get("secrets"));
      }
      if (context.containsKey("context")) {
        stdCtx.setVariable("context", context.get("context"));
      }

      // 支持直接引用 variables.xxx 格式 → 转为 #variables['xxx']
      String spelExpr = expression
          .replaceAll("variables\\.", "#variables['")
          .replaceAll("nodes\\[", "#nodes[")
          .replaceAll("secrets\\.", "#secrets['")
          .replaceAll("context\\.", "#context['");

      // 修复未闭合的引号
      if (spelExpr.contains("['") && !spelExpr.contains("']")) {
        spelExpr = spelExpr + "']";
      }

      Expression exp = parser.parseExpression(spelExpr);
      return exp.getValue(evalContext);
    } catch (Exception e) {
      log.warn("Expression evaluation failed: {} — {}", expression, e.getMessage());
      return "${" + expression + "}";
    }
  }
}
