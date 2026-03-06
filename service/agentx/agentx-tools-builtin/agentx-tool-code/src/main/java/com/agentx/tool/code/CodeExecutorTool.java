package com.agentx.tool.code;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import lombok.extern.slf4j.Slf4j;

/**
 * 代码执行工具 — 在沙盒中执行简单脚本
 */
@Slf4j
public class CodeExecutorTool {

  @Tool("Execute a mathematical expression or simple calculation and return the result")
  public String calculate(@P("The mathematical expression to evaluate") String expression) {
    try {
      ScriptEngine engine = new ScriptEngineManager().getEngineByName("js");
      if (engine == null) {
        // Fallback: simple expression evaluation
        return String.valueOf(evaluateSimple(expression));
      }
      Object result = engine.eval(expression);
      return String.valueOf(result);
    } catch (Exception e) {
      return "Calculation error: " + e.getMessage();
    }
  }

  private double evaluateSimple(String expression) {
    // Simple recursive descent parser for basic math
    expression = expression.replaceAll("\\s+", "");
    return parseExpression(expression, new int[]{0});
  }

  private double parseExpression(String expr, int[] pos) {
    double result = parseTerm(expr, pos);
    while (pos[0] < expr.length() && (expr.charAt(pos[0]) == '+' || expr.charAt(pos[0]) == '-')) {
      char op = expr.charAt(pos[0]++);
      double term = parseTerm(expr, pos);
      result = op == '+' ? result + term : result - term;
    }
    return result;
  }

  private double parseTerm(String expr, int[] pos) {
    double result = parseFactor(expr, pos);
    while (pos[0] < expr.length() && (expr.charAt(pos[0]) == '*' || expr.charAt(pos[0]) == '/')) {
      char op = expr.charAt(pos[0]++);
      double factor = parseFactor(expr, pos);
      result = op == '*' ? result * factor : result / factor;
    }
    return result;
  }

  private double parseFactor(String expr, int[] pos) {
    if (pos[0] < expr.length() && expr.charAt(pos[0]) == '(') {
      pos[0]++;
      double result = parseExpression(expr, pos);
      if (pos[0] < expr.length() && expr.charAt(pos[0]) == ')') {
        pos[0]++;
      }
      return result;
    }
    int start = pos[0];
    if (pos[0] < expr.length() && (expr.charAt(pos[0]) == '-' || expr.charAt(pos[0]) == '+')) {
      pos[0]++;
    }
    while (pos[0] < expr.length() && (Character.isDigit(expr.charAt(pos[0]))
        || expr.charAt(pos[0]) == '.')) {
      pos[0]++;
    }
    return Double.parseDouble(expr.substring(start, pos[0]));
  }
}
