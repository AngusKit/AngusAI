package com.agentx.eval;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.function.Function;

/**
 * 评估运行器 —— 执行数据集中的所有用例并生成评估报告
 */
public class EvalRunner {

  private static final Logger log = LoggerFactory.getLogger(EvalRunner.class);

  private final List<EvalMetric> metrics;
  private final Function<String, String> agentFunction;

  /**
   * @param agentFunction 被评估的 Agent 函数 input → output
   * @param metrics       评估指标列表
   */
  public EvalRunner(Function<String, String> agentFunction, List<EvalMetric> metrics) {
    this.agentFunction = agentFunction;
    this.metrics = metrics;
  }

  /**
   * 运行整个数据集的评估
   */
  public EvalReport run(EvalDataset dataset) {
    List<EvalResult> results = new ArrayList<>();
    for (EvalDataset.EvalCase evalCase : dataset.getCases()) {
      long start = System.currentTimeMillis();
      String actual;
      try {
        actual = agentFunction.apply(evalCase.getInput());
      } catch (Exception e) {
        log.error("Eval case {} failed with exception", evalCase.getId(), e);
        actual = "[ERROR] " + e.getMessage();
      }
      long elapsed = System.currentTimeMillis() - start;

      Map<String, Double> scores = new LinkedHashMap<>();
      for (EvalMetric metric : metrics) {
        scores.put(metric.name(), metric.score(evalCase.getExpectedOutput(), actual));
      }

      EvalResult result = new EvalResult();
      result.setCaseId(evalCase.getId());
      result.setInput(evalCase.getInput());
      result.setExpectedOutput(evalCase.getExpectedOutput());
      result.setActualOutput(actual);
      result.setScores(scores);
      result.setLatencyMs(elapsed);
      result.setPassed(scores.values().stream().allMatch(s -> s >= 0.5));
      results.add(result);
    }
    return new EvalReport(dataset.getName(), results);
  }

  /**
   * 评估报告
   */
  public record EvalReport(String datasetName, List<EvalResult> results) {

    public long passedCount() {
      return results.stream().filter(EvalResult::isPassed).count();
    }

    public long failedCount() {
      return results.size() - passedCount();
    }

    public double passRate() {
      return results.isEmpty() ? 0.0 : (double) passedCount() / results.size();
    }

    public double avgLatencyMs() {
      return results.stream().mapToLong(EvalResult::getLatencyMs).average().orElse(0.0);
    }

    public String summary() {
      return String.format(
          "Dataset: %s | Total: %d | Passed: %d | Failed: %d | Pass Rate: %.2f%% | Avg Latency: %.0fms",
          datasetName, results.size(), passedCount(), failedCount(), passRate() * 100,
          avgLatencyMs());
    }
  }
}
