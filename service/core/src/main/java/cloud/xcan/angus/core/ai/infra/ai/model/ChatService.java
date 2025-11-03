package cloud.xcan.angus.core.ai.infra.ai.model;

import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * AI服务 - 基于Spring AI实现，支持同步与流式（SSE）调用。
 * <p>
 * 说明：尽量使用 Spring AI 的 ChatClient（如果在运行时可用），否则通过 WebClient 调用兼容 OpenAI 风格的 HTTP 接口。
 */
@Slf4j
@Service
public class ChatService {

  @Resource
  private MessageQuery messageQuery;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private SessionQuery sessionQuery;

  public ChatService() {
  }

  /**
   * 发送消息并获取AI响应（优先使用 Spring AI 的 ChatClient，同步等待完整回复）
   */
  public String sendMessage(Long sessionId, String content, SessionConfig overrideConfig) {
    return null;
  }

}
