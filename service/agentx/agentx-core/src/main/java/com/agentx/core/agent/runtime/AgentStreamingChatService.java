package com.agentx.core.agent.runtime;

import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/**
 * LangChain4j AiServices 流式代理接口
 */
public interface AgentStreamingChatService {

  @UserMessage("{{message}}")
  TokenStream chatStream(@V("message") String message);
}
