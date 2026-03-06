package com.agentx.core.guardrail;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;

/**
 * 护栏链执行器 — 双向护栏链管理
 */
@Slf4j
public class GuardrailChain {

  private final Map<String, InputGuardrail> inputGuardrails = new ConcurrentHashMap<>();
  private final Map<String, OutputGuardrail> outputGuardrails = new ConcurrentHashMap<>();

  public void registerInput(InputGuardrail guardrail) {
    inputGuardrails.put(guardrail.getId(), guardrail);
  }

  public void registerOutput(OutputGuardrail guardrail) {
    outputGuardrails.put(guardrail.getId(), guardrail);
  }

  /**
   * 执行输入护栏链
   *
   * @param input        用户输入
   * @param guardrailIds 要执行的护栏 ID 列表（按顺序）
   * @return 最终检查结果
   */
  public GuardrailResult checkInput(String input, List<String> guardrailIds) {
    String current = input;
    for (String id : guardrailIds) {
      InputGuardrail guardrail = inputGuardrails.get(id);
      if (guardrail == null) {
        log.warn("Input guardrail not found: {}", id);
        continue;
      }

      GuardrailResult result = guardrail.check(current);
      if (!result.isPassed()) {
        log.info("Input blocked by guardrail {}: {}", id, result.getReason());
        return result;
      }
      if (result.getSanitizedContent() != null) {
        current = result.getSanitizedContent();
      }
    }
    return GuardrailResult.builder().passed(true).sanitizedContent(current).build();
  }

  /**
   * 执行输出护栏链
   */
  public GuardrailResult checkOutput(String output, List<String> guardrailIds) {
    String current = output;
    for (String id : guardrailIds) {
      OutputGuardrail guardrail = outputGuardrails.get(id);
      if (guardrail == null) {
        log.warn("Output guardrail not found: {}", id);
        continue;
      }

      GuardrailResult result = guardrail.check(current);
      if (!result.isPassed()) {
        log.info("Output blocked by guardrail {}: {}", id, result.getReason());
        return result;
      }
      if (result.getSanitizedContent() != null) {
        current = result.getSanitizedContent();
      }
    }
    return GuardrailResult.builder().passed(true).sanitizedContent(current).build();
  }
}
