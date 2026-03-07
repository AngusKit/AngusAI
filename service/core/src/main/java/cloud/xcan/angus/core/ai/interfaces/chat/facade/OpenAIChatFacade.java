package cloud.xcan.angus.core.ai.interfaces.chat.facade;

import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsRequest;
import cloud.xcan.angus.core.ai.interfaces.chat.openai.OpenAIChatCompletionsResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * OpenAI Chat Completions 兼容接口 Facade
 */
public interface OpenAIChatFacade {

  /**
   * 通用 Chat Completions（必须传 model）
   *
   * @param request OpenAI 格式请求
   * @param sessionId 可选，X-Session-Id Header
   * @return 同步响应
   */
  OpenAIChatCompletionsResponse chatCompletions(OpenAIChatCompletionsRequest request,
      String sessionId);

  /**
   * 流式 Chat Completions
   *
   * @param request OpenAI 格式请求
   * @param sessionId 可选，X-Session-Id Header
   * @return SSE 流
   */
  SseEmitter chatCompletionsStream(OpenAIChatCompletionsRequest request, String sessionId);

  /**
   * 应用入口 Chat Completions（model 可选，按应用默认 Agent）
   *
   * @param appId 应用 ID
   * @param request OpenAI 格式请求
   * @param sessionId 可选
   * @return 同步响应
   */
  OpenAIChatCompletionsResponse chatCompletionsByApp(Long appId,
      OpenAIChatCompletionsRequest request, String sessionId);

  /**
   * 应用入口流式 Chat Completions
   */
  SseEmitter chatCompletionsStreamByApp(Long appId, OpenAIChatCompletionsRequest request,
      String sessionId);

  /**
   * 智能体直连 Chat Completions（等价于 model=agent_{agentId}）
   *
   * @param agentId 智能体 ID
   * @param request OpenAI 格式请求
   * @param sessionId 可选
   * @return 同步响应
   */
  OpenAIChatCompletionsResponse chatCompletionsByAgent(Long agentId,
      OpenAIChatCompletionsRequest request, String sessionId);

  /**
   * 智能体直连流式 Chat Completions
   */
  SseEmitter chatCompletionsStreamByAgent(Long agentId, OpenAIChatCompletionsRequest request,
      String sessionId);
}
