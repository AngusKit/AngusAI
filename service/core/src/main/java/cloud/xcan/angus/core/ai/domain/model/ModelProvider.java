package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ModelProvider implements EnumMessage<String> {
  OPENAI,        // OpenAI
  ANTHROPIC,     // Anthropic
  GOOGLE,        // Google
  BAIDU,         // 百度
  ALIBABA,       // 阿里云
  TENCENT,       // 腾讯云
  HUAWEI,        // 华为云
  MOONSHOT,      // 月之暗面
  DEEPSEEK,      // DeepSeek
  ZHIPU,         // 智谱AI
  QWEN,          // 通义千问
  LOCAL,         // 本地部署
  CUSTOM;        // 自定义

  public String getValue() {
    return this.name();
  }
}
