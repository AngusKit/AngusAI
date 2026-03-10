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
  /**
   * 同步对话
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID(UUID)，与 Session/Message 统一；为空时业务层初始化
   * @param message   用户消息
   * @return 回复内容与生效的 sessionId（初始化时返回新生成的 UUID）
   */
  AgentChatResult chat(Long agentId, String sessionId, String message);

  /**
   * 流式对话
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID(UUID)，为空时业务层初始化
   * @param message   用户消息
   * @param timeoutMs 超时（毫秒），null 用默认值
   */
  SseEmitter chatStream(Long agentId, String sessionId, String message, Long timeoutMs);

}
