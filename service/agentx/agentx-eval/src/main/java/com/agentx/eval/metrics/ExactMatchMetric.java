package com.agentx.eval.metrics;

import com.agentx.eval.EvalMetric;

/**
 * 精确匹配指标
 */
public class ExactMatchMetric implements EvalMetric {

  @Override
  public String name() {
    return "exact_match";
  }

  @Override
  public double score(String expected, String actual) {
    if (expected == null && actual == null) {
      return 1.0;
    }
    if (expected == null || actual == null) {
      return 0.0;
    }
    return expected.trim().equals(actual.trim()) ? 1.0 : 0.0;
  }
}
