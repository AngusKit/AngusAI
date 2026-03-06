package cloud.xcan.core.agent.runtime;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/**
 * LangChain4j AiServices 代理接口 — 通用 chat，支持按 sessionId 隔离会话记忆
 */
public interface AgentChatService {

  @UserMessage("{{message}}")
  String chat(@MemoryId Object memoryId, @V("message") String message);
}
