package cloud.xcan.angus.core.ai.domain.application;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ApplicationCategory implements EnumMessage<String> {
  CHATBOT, // 聊天机器人
  ASSISTANT, // 智能助手
  WORKFLOW, // 工作流
  KNOWLEDGE_BASE; // 知识库

  public String getValue() {
    return this.name();
  }

}
