package com.agentx.core.guardrail.builtin;

import com.agentx.core.guardrail.GuardrailResult;
import com.agentx.core.guardrail.InputGuardrail;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Prompt 注入检测护栏
 */
public class PromptInjectionGuardrail implements InputGuardrail {

  private static final List<Pattern> INJECTION_PATTERNS = List.of(
      Pattern.compile("ignore\\s+(previous|above|all)\\s+instructions", Pattern.CASE_INSENSITIVE),
      Pattern.compile("you\\s+are\\s+now\\s+", Pattern.CASE_INSENSITIVE),
      Pattern.compile("forget\\s+(everything|your|all)", Pattern.CASE_INSENSITIVE),
      Pattern.compile("system\\s*prompt", Pattern.CASE_INSENSITIVE),
      Pattern.compile("\\bDAN\\b"),
      Pattern.compile("jailbreak", Pattern.CASE_INSENSITIVE)
  );

  @Override
  public String getId() {
    return "prompt-injection-detector";
  }

  @Override
  public GuardrailResult check(String input) {
    for (Pattern pattern : INJECTION_PATTERNS) {
      if (pattern.matcher(input).find()) {
        return GuardrailResult.block(getId(),
            "Potential prompt injection detected");
      }
    }
    return GuardrailResult.pass();
  }
}
