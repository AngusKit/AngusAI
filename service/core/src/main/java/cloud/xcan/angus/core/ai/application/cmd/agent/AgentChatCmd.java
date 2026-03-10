package cloud.xcan.angus.core.ai.application.cmd.agent;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentChatCmd {

  /**
   * 同步对话
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID（用于多轮记忆）
   * @param message   用户消息
   * @return 对话回复
   */
  String chat(Long agentId, String sessionId, String message);

  /**
   * 流式对话，支持自定义超时
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID（用于多轮记忆）
   * @param message   用户消息
   * @param timeoutMs 超时时间（毫秒），null 时使用默认值
   */
  SseEmitter chatStream(Long agentId, String sessionId, String message, Long timeoutMs);

}
