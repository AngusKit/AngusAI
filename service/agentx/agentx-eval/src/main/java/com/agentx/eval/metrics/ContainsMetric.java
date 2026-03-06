package com.agentx.eval.metrics;

import com.agentx.eval.EvalMetric;

/**
 * 包含匹配指标 —— 检查 actual 是否包含 expected 中的关键内容
 */
public class ContainsMetric implements EvalMetric {

  @Override
  public String name() {
    return "contains";
  }

  @Override
  public double score(String expected, String actual) {
    if (expected == null || actual == null) {
      return 0.0;
    }
    return actual.toLowerCase().contains(expected.toLowerCase()) ? 1.0 : 0.0;
  }
}
