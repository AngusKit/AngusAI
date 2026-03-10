package cloud.xcan.angus.core.ai.domain.agent;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 智能体对话结果
 */
@Getter
@AllArgsConstructor
public class AgentChatResult {

  private final String reply;
  private final String sessionId;
}
