package cloud.xcan.agentx.core.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 模型提供商枚举 — JSON 序列化使用枚举名（如 "OPEN_AI"）
 *
 * @see dev.langchain4j.model.ModelProvider
 */
public enum ModelProvider {
  OPEN_AI,
  ANTHROPIC,
  OLLAMA,
  GEMINI,
  AMAZON_BEDROCK,
  GITHUB_MODELS,
  /**
   * @deprecated
   */
  @Deprecated
  AZURE_OPEN_AI,
  GOOGLE_AI_GEMINI,
  GOOGLE_VERTEX_AI_GEMINI,
  GOOGLE_VERTEX_AI_ANTHROPIC,
  MICROSOFT_FOUNDRY,
  MISTRAL_AI,
  WATSONX,
  OTHER,

  // 针对langchain4j扩展模型提供商
  /**
   * 通义千问（阿里）
   */
  QWEN,
  /**
   * 智谱 GLM
   */
  ZHIPU,
  /**
   * DeepSeek
   */
  DEEPSEEK;

  /**
   * 用于 Map 查找、JSON 序列化 — 返回枚举名
   */
  @JsonValue
  public String getKey() {
    return name();
  }

  @JsonCreator
  public static ModelProvider fromKey(String key) {
    if (key == null || key.isBlank()) {
      return null;
    }
    String normalized = key.toUpperCase().replace("-", "_");
    try {
      return valueOf(normalized);
    } catch (IllegalArgumentException e) {
      // 兼容小写如 "openai" -> OPEN_AI
      String target = normalized.replace("_", "");
      for (ModelProvider p : values()) {
        if (p.name().replace("_", "").equalsIgnoreCase(target)) {
          return p;
        }
      }
      return null;
    }
  }
}
