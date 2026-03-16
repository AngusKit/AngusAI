package cloud.xcan.angus.core.ai.application.cmd.agent;

import cloud.xcan.angus.core.ai.domain.agent.AgentChatResult;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentChatCmd {

  /**
   * 同步对话
   *
   * @param session 会话
   * @param message 用户消息
   * @param config  可选配置覆盖，优先级：请求 > 会话 > 智能体 > 默认
   * @return 回复内容与生效的 sessionId（初始化时返回新生成的 UUID）
   */
  AgentChatResult chat(Session session, String message, SessionConfig config);

  /**
   * 流式对话
   *
   * @param session 会话
   * @param message 用户消息
   * @param config  可选配置覆盖
   */
  SseEmitter chatStream(Session session, String message, SessionConfig config);

}
