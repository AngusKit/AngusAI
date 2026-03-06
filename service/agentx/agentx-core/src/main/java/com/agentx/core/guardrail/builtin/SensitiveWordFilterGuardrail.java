package com.agentx.core.guardrail.builtin;

import com.agentx.core.guardrail.GuardrailResult;
import com.agentx.core.guardrail.OutputGuardrail;

import java.util.List;
import java.util.regex.Pattern;

/**
 * 敏感词过滤护栏（输出）
 */
public class SensitiveWordFilterGuardrail implements OutputGuardrail {

  private final List<Pattern> sensitivePatterns;

  public SensitiveWordFilterGuardrail(List<String> sensitiveWords) {
    this.sensitivePatterns = sensitiveWords.stream()
        .map(w -> Pattern.compile(Pattern.quote(w), Pattern.CASE_INSENSITIVE))
        .toList();
  }

  @Override
  public String getId() {
    return "sensitive-word-filter";
  }

  @Override
  public GuardrailResult check(String output) {
    String sanitized = output;
    for (Pattern pattern : sensitivePatterns) {
      sanitized = pattern.matcher(sanitized).replaceAll("***");
    }
    if (!sanitized.equals(output)) {
      return GuardrailResult.sanitize(getId(), sanitized);
    }
    return GuardrailResult.pass();
  }
}
