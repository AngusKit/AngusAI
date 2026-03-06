package com.agentx.core.guardrail.builtin;

import com.agentx.core.guardrail.GuardrailResult;
import com.agentx.core.guardrail.InputGuardrail;

/**
 * 输入长度限制护栏
 */
public class LengthLimitGuardrail implements InputGuardrail {

  private final int maxLength;

  public LengthLimitGuardrail(int maxLength) {
    this.maxLength = maxLength;
  }

  public LengthLimitGuardrail() {
    this(10000);
  }

  @Override
  public String getId() {
    return "length-limit";
  }

  @Override
  public GuardrailResult check(String input) {
    if (input.length() > maxLength) {
      return GuardrailResult.block(getId(),
          "Input exceeds maximum length: " + input.length() + " > " + maxLength);
    }
    return GuardrailResult.pass();
  }
}
