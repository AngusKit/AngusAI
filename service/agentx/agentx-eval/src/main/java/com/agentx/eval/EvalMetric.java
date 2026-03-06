package com.agentx.eval;

/**
 * 评估指标 SPI
 */
public interface EvalMetric {

  /**
   * 指标名称
   */
  String name();

  /**
   * 计算分数 (0.0 ~ 1.0)
   */
  double score(String expected, String actual);
}
