package cloud.xcan.angus.core.ai.application.cmd.agent;

import cloud.xcan.angus.core.ai.domain.agent.AgentChatConfig;
import cloud.xcan.angus.core.ai.domain.agent.AgentChatResult;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentChatCmd {

  /**
   * 同步对话
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID(UUID)，与 Session/Message 统一；为空时业务层初始化
   * @param message   用户消息
   * @param config    可选配置覆盖，优先级：请求 > 会话 > 智能体 > 默认
   * @return 回复内容与生效的 sessionId（初始化时返回新生成的 UUID）
   */
  AgentChatResult chat(Long agentId, String sessionId, String message,
      AgentChatConfig config);

  /**
   * 流式对话
   *
   * @param agentId   智能体 ID
   * @param sessionId 会话 ID(UUID)，为空时业务层初始化
   * @param message   用户消息
   * @param timeoutMs 超时（毫秒），null 用默认值
   * @param config    可选配置覆盖
   */
  SseEmitter chatStream(Long agentId, String sessionId, String message, Long timeoutMs,
      AgentChatConfig config);

}
