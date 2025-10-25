package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ModelType implements EnumMessage<String> {
  LANGUAGE,     // 语言模型
  IMAGE,         // 图像模型
  VIDEO,         // 视频模型
  CODE,          // 代码模型
  AUDIO,         // 音频模型
  EMBEDDING,     // 嵌入模型
  MULTIMODAL;    // 多模态模型

  public String getValue() {
    return this.name();
  }
}
