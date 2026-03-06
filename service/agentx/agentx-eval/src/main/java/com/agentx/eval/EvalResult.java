package com.agentx.eval;

import java.util.Map;
import lombok.Data;

/**
 * 单条评估结果
 */
@Data
public class EvalResult {

  private String caseId;
  private String input;
  private String expectedOutput;
  private String actualOutput;
  private Map<String, Double> scores;
  private boolean passed;
  private long latencyMs;
}
