package cloud.xcan.angus.core.ai.domain.application;

public enum ApplicationCategory {
  CHATBOT, // 聊天机器人
  CONTENT_CREATION, // 内容创作
  KNOWLEDGE_QA, // 知识问答
  AGENT_PROXY; // 智能体代理

  public String getValue() {
    return this.name();
  }

}
