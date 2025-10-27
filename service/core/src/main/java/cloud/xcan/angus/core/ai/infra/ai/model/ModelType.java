package cloud.xcan.angus.core.ai.infra.ai.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

/**
 * AI模型类型枚举
 */
@EndpointRegister
public enum ModelType implements EnumMessage<String> {
  CHAT,           // 对话模型
  IMAGE,          // 图像模型
  AUDIO,          // 音频模型
  EMBEDDING,      // 嵌入模型
  MODERATION;     // 审核模型

  public String getValue() {
    return this.name();
  }
}
