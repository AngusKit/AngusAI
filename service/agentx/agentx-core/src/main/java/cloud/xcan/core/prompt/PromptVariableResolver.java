package cloud.xcan.core.prompt;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 提示词变量解析器 — 将模板中的 {{key}} 或 ${key} 替换为 variables 中的值。
 */
public final class PromptVariableResolver {

  private static final Pattern PLACEHOLDER = Pattern.compile(
      "\\{\\{([^}]+)\\}\\}|\\$\\{([^}]+)\\}");

  private PromptVariableResolver() {
  }

  /**
   * 解析模板，将 {{key}} 或 ${key} 替换为 variables.get(key)。
   *
   * @param template  原始模板
   * @param variables 变量映射，可为 null
   * @return 替换后的字符串，variables 为 null 或空时返回原模板
   */
  public static String resolve(String template, Map<String, String> variables) {
    if (template == null || template.isEmpty()) {
      return template;
    }
    if (variables == null || variables.isEmpty()) {
      return template;
    }

    Matcher matcher = PLACEHOLDER.matcher(template);
    StringBuffer sb = new StringBuffer();
    while (matcher.find()) {
      String key = matcher.group(1) != null ? matcher.group(1) : matcher.group(2);
      String value = variables.getOrDefault(key, "");
      matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
    }
    matcher.appendTail(sb);
    return sb.toString();
  }
}
