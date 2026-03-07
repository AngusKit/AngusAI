package cloud.xcan.agentx.core.guardrail.builtin;

import cloud.xcan.agentx.core.guardrail.GuardrailResult;
import cloud.xcan.agentx.core.guardrail.InputGuardrail;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * PII 脱敏护栏 — 自动识别并脱敏手机号/身份证/银行卡/邮箱
 */
public class PiiSanitizationGuardrail implements InputGuardrail {

  private static final Map<String, Pattern> PII_PATTERNS = Map.of(
      "手机号", Pattern.compile("1[3-9]\\d{9}"),
      "身份证", Pattern.compile("\\d{17}[\\dXx]"),
      "银行卡", Pattern.compile("\\d{16,19}"),
      "邮箱", Pattern.compile("[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}")
  );

  @Override
  public String getId() {
    return "pii-sanitization";
  }

  @Override
  public GuardrailResult check(String input) {
    String sanitized = input;
    for (Map.Entry<String, Pattern> entry : PII_PATTERNS.entrySet()) {
      Matcher matcher = entry.getValue().matcher(sanitized);
      sanitized = matcher.replaceAll("[" + entry.getKey() + "已脱敏]");
    }

    if (!sanitized.equals(input)) {
      return GuardrailResult.sanitize(getId(), sanitized);
    }
    return GuardrailResult.pass();
  }
}
