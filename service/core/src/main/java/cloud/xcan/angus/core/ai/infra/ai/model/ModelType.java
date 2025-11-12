package cloud.xcan.angus.core.ai.infra.ai.model;

/**
 * AI模型类型枚举
 */
public enum ModelType {
  CHAT,           // 对话模型
  IMAGE,          // 图像模型
  AUDIO,          // 音频模型
  EMBEDDING,      // 嵌入模型
  MODERATION;     // 审核模型

  public String getValue() {
    return this.name();
  }
}
