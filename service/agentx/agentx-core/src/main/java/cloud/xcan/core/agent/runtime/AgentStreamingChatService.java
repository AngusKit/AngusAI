package cloud.xcan.core.agent.runtime;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/**
 * LangChain4j AiServices 流式代理接口，支持按 sessionId 隔离会话记忆
 */
public interface AgentStreamingChatService {

  @UserMessage("{{message}}")
  TokenStream chatStream(@MemoryId Object memoryId, @V("message") String message);
}
