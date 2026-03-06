package com.agentx.core.agent.runtime;

import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/**
 * LangChain4j AiServices 代理接口 — 通用 chat
 */
public interface AgentChatService {

  @UserMessage("{{message}}")
  String chat(@V("message") String message);
}
