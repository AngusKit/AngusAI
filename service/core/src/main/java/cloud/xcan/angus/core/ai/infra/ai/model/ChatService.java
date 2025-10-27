package cloud.xcan.angus.core.ai.infra.ai.model;

import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.model.Model;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * AI服务 - 基于Spring AI实现
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

  @Resource
  private ModelFactory modelFactory;

  // 存储流式响应的消息ID
  private final Map<Long, Boolean> streamingMessages = new ConcurrentHashMap<>();

  /**
   * 发送消息并获取AI响应
   */
  public String sendMessage(Long sessionId, String content, SessionConfig overrideConfig) {
    try {
      // 1. 获取会话信息
      Session session = sessionQuery.findById(sessionId);
      if (session == null) {
        throw new IllegalArgumentException("会话不存在");
      }

      // 2. 获取模型信息
      Model model = modelQuery.findById(session.getModelId());
      if (model == null) {
        throw new IllegalArgumentException("模型不存在");
      }

      // 3. 构建消息历史
      List<org.springframework.ai.chat.messages.Message> messages = buildMessageHistory(sessionId);

      // 4. 添加用户消息
      messages.add(new UserMessage(content));

      // 5. 获取ChatClient
      ChatClient chatClient = modelFactory.getChatClient(model.getConfig());

      // 6. 构建ChatOptions
      ChatOptions chatOptions = buildChatOptions(model, session.getConfig(), overrideConfig);

      //      // 7. 发送请求
      //      Prompt prompt = new Prompt(messages, chatOptions);
      //      ChatResponse response = chatClient.call(prompt);
      //
      //      // 8. 返回响应内容
      //      return response.getResult().getOutput().getContent();

      return null;
    } catch (Exception e) {
      log.error("发送AI消息失败: sessionId={}, content={}", sessionId, content, e);
      throw new RuntimeException("AI服务调用失败: " + e.getMessage(), e);
    }
  }

  /**
   * 流式发送消息
   */
  public SseEmitter sendMessageStream(Long sessionId, String content, SessionConfig overrideConfig,
      Long assistantMessageId) {
    SseEmitter emitter = new SseEmitter(30000L); // 30秒超时

    CompletableFuture.runAsync(() -> {
      try {
        // 1. 获取会话信息
        Session session = sessionQuery.findById(sessionId);
        if (session == null) {
          emitter.completeWithError(new IllegalArgumentException("会话不存在"));
          return;
        }

        // 2. 获取模型信息
        Model model = modelQuery.findById(session.getModelId());
        if (model == null) {
          emitter.completeWithError(new IllegalArgumentException("模型不存在"));
          return;
        }

        // 3. 构建消息历史
        List<org.springframework.ai.chat.messages.Message> messages = buildMessageHistory(
            sessionId);
        messages.add(new UserMessage(content));

        // 4. 获取ChatClient
        ChatClient chatClient = modelFactory.getChatClient(model.getConfig());

        // 5. 构建ChatOptions
        ChatOptions chatOptions = buildChatOptions(model, session.getConfig(), overrideConfig);

        // 6. 标记消息为流式生成
        streamingMessages.put(assistantMessageId, true);

        // 7. 发送流式请求
        Prompt prompt = new Prompt(messages, chatOptions);
        StringBuilder fullContent = new StringBuilder();

//        chatClient.stream(prompt).subscribe(
//            chunk -> {
//              try {
//                String chunkContent = chunk.getResult().getOutput().getContent();
//                if (chunkContent != null && !chunkContent.isEmpty()) {
//                  fullContent.append(chunkContent);
//
//                  // 发送SSE事件
//                  SseEmitter.SseEventBuilder event = SseEmitter.event()
//                      .name("message")
//                      .data(chunkContent);
//                  emitter.send(event);
//                }
//              } catch (Exception e) {
//                log.error("发送SSE事件失败", e);
//              }
//            },
//            error -> {
//              log.error("流式响应错误", error);
//              streamingMessages.remove(assistantMessageId);
//              emitter.completeWithError(error);
//            },
//            () -> {
//              // 流式响应完成
//              try {
//                // 更新消息内容
//                messageQuery.updateContent(assistantMessageId, fullContent.toString());
//
//                // 标记流式生成完成
//                streamingMessages.remove(assistantMessageId);
//
//                // 发送完成事件
//                SseEmitter.SseEventBuilder event = SseEmitter.event()
//                    .name("done")
//                    .data("stream_complete");
//                emitter.send(event);
//                emitter.complete();
//              } catch (Exception e) {
//                log.error("完成流式响应失败", e);
//                emitter.completeWithError(e);
//              }
//            }
//        );

      } catch (Exception e) {
        log.error("流式发送AI消息失败: sessionId={}, content={}", sessionId, content, e);
        streamingMessages.remove(assistantMessageId);
        emitter.completeWithError(e);
      }
    });

    return emitter;
  }

  /**
   * 停止流式生成
   */
  public void stopGeneration(Long messageId) {
    streamingMessages.put(messageId, false);
  }

  /**
   * 检查消息是否正在流式生成
   */
  public boolean isStreaming(Long messageId) {
    return streamingMessages.getOrDefault(messageId, false);
  }

  /**
   * 构建消息历史
   */
  private List<org.springframework.ai.chat.messages.Message> buildMessageHistory(Long sessionId) {
    List<org.springframework.ai.chat.messages.Message> messages = new ArrayList<>();

    // 获取会话配置
    Session session = sessionQuery.findById(sessionId);
    if (session != null && session.getConfig() != null
        && session.getConfig().getSystemPrompt() != null) {
      messages.add(new SystemMessage(session.getConfig().getSystemPrompt()));
    }

    // 获取最近的消息历史（限制数量避免token过多）
    List<Message> historyMessages = messageQuery.findRecentBySessionId(sessionId, 20);

    for (Message msg : historyMessages) {
      if (msg.getRole() == MessageRole.USER) {
        messages.add(new UserMessage(msg.getContent()));
      } else if (msg.getRole() == MessageRole.ASSISTANT) {
        messages.add(new AssistantMessage(msg.getContent()));
      }
    }
    return messages;
  }

  /**
   * 构建ChatOptions
   */
  private ChatOptions buildChatOptions(Model model, SessionConfig sessionConfig,
      SessionConfig overrideConfig) {
    // 使用覆盖配置或会话配置
    SessionConfig config = overrideConfig != null ? overrideConfig : sessionConfig;

    if (config == null) {
      return ChatOptions.builder().build();
    }

    // 根据模型提供商构建不同的选项
    return switch (model.getProvider()) {
      case OPENAI -> OpenAiChatOptions.builder()
          .model(model.getName())
          .temperature(config.getTemperature())
          .maxTokens(config.getMaxTokens())
          .topP(config.getTopP())
          .frequencyPenalty(config.getFrequencyPenalty())
          .presencePenalty(config.getPresencePenalty())
          .build();
      case ANTHROPIC -> AnthropicChatOptions.builder()
          .model(model.getName())
          .temperature(config.getTemperature())
          .maxTokens(config.getMaxTokens())
          .topP(config.getTopP())
          .build();
      case OLLAMA -> OllamaOptions.builder()
          .model(model.getName())
          .temperature(config.getTemperature())
          .topP(config.getTopP())
          .build();
      default -> ChatOptions.builder().build();
    };
  }
}
