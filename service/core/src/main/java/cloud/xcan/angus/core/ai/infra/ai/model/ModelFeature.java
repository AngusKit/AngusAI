package cloud.xcan.angus.core.ai.infra.ai.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

/**
 * AI模型特性枚举
 */
@EndpointRegister
public enum ModelFeature implements EnumMessage<String> {
  MULTIMODALITY,           // 多模态支持
  TOOLS_FUNCTIONS,         // 工具/函数调用
  STREAMING,              // 流式响应
  RETRY,                  // 重试机制
  OBSERVABILITY,          // 可观测性
  BUILT_IN_JSON,          // 内置JSON支持
  LOCAL,                  // 本地部署
  OPENAI_API_COMPATIBLE;  // OpenAI API兼容

  public String getValue() {
    return this.name();
  }
}
