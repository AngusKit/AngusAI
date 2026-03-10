package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.MessageFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFeedbackDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageSendDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler.MessageAssembler;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.AttachmentUploadVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageSendVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.message.ProtocolException;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Message Facade实现
 */
@Component
public class MessageFacadeImpl implements MessageFacade {

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  private MessageCmd messageCmd;

  @Resource
  private MessageQuery messageQuery;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private cloud.xcan.agentx.core.agent.AgentRegistry agentRegistry;

  @Override
  public MessageSendVo sendMessage(String sessionId, MessageSendDto dto) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    // 1. 创建用户消息
    Long userMessageId = messageCmd.createWithAttachments(
        sessionId,
        MessageRole.USER,
        dto.getContent(),
        dto.getAttachments()
    );

    // 2. Session → Application → agentId → AgentRegistry.chat
    AIApplication application = applicationQuery.findAndCheck(session.getAppId());
    Long defaultAgentId = applicationQuery.getDefaultAgentId(session.getAppId());
    if (defaultAgentId == null) {
      throw ProtocolException.of("应用未绑定智能体，无法进行对话");
    }
    String agentIdStr = String.valueOf(defaultAgentId);
    String aiResponse = agentRegistry.chat(agentIdStr, sessionId, dto.getContent());

    // 3. 创建助手消息
    Long assistantMessageId = messageCmd.create(sessionId, MessageRole.ASSISTANT, aiResponse);

    // 4. 构建返回结果
    MessageSendVo vo = new MessageSendVo();
    Message userMsg = messageQuery.findById(userMessageId);
    Message assistantMsg = messageQuery.findById(assistantMessageId);
    vo.setUserMsg(MessageAssembler.toMessageVo(userMsg));
    vo.setAssistantMsg(MessageAssembler.toMessageVo(assistantMsg));
    return vo;
  }

  private static final String STREAMING_PLACEHOLDER = ".";

  @Override
  public SseEmitter sendMessageStream(String sessionId, MessageSendDto dto) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    // 1. 创建用户消息
    messageCmd.createWithAttachments(
        sessionId,
        MessageRole.USER,
        dto.getContent(),
        dto.getAttachments()
    );

    // 2. Session → Application → agentId → AgentRegistry.chatStream
    AIApplication application = applicationQuery.findAndCheck(session.getAppId());
    Long defaultAgentId = applicationQuery.getDefaultAgentId(session.getAppId());
    if (defaultAgentId == null) {
      throw ProtocolException.of("应用未绑定智能体，无法进行对话");
    }
    String agentIdStr = String.valueOf(defaultAgentId);

    // 3. 创建占位助手消息用于流式更新
    Long assistantMessageId = messageCmd.create(sessionId, MessageRole.ASSISTANT, STREAMING_PLACEHOLDER);
    messageCmd.setStreaming(assistantMessageId, true);

    // 4. 流式调用 AgentRegistry.chatStream
    SseEmitter emitter = new SseEmitter(120_000L);
    new Thread(() -> {
      try {
        dev.langchain4j.service.TokenStream stream = agentRegistry.chatStream(
            agentIdStr, sessionId, dto.getContent());
        StringBuilder fullContent = new StringBuilder();
        stream.onPartialResponse(token -> {
              fullContent.append(token);
              try {
                emitter.send(SseEmitter.event().data(token));
              } catch (Exception e) {
                emitter.completeWithError(e);
              }
            })
            .onCompleteResponse(r -> {
              messageQuery.updateContent(assistantMessageId, fullContent.toString());
              messageCmd.setStreaming(assistantMessageId, false);
              emitter.complete();
            })
            .onError(e -> {
              messageCmd.setStreaming(assistantMessageId, false);
              emitter.completeWithError(e);
            });
        stream.start();
      } catch (Exception e) {
        messageCmd.setStreaming(assistantMessageId, false);
        emitter.completeWithError(e);
      }
    }).start();

    return emitter;
  }

  @Override
  public AttachmentUploadVo uploadAttachment(MultipartFile file, String sessionId) {
//    // 1. 验证文件类型
//    if (!fileStorageService.isValidFileType(file.getContentType())) {
//      throw new IllegalArgumentException("不支持的文件类型: " + file.getContentType());
//    }
//
//    // 2. 上传文件
//    cloud.xcan.angus.core.ai.domain.chat.Attachment attachment = fileStorageService.uploadFile(file,
//        sessionId);
//
//    // 3. 构建返回结果
//    AttachmentUploadVo vo = new AttachmentUploadVo();
//    vo.setId(attachment.getId());
//    vo.setName(attachment.getName());
//    vo.setType(attachment.getType());
//    vo.setSize(attachment.getSize());
//    vo.setUrl(attachment.getUrl());
    //vo.setUploadedAt(attachment.getUploadedAt());
    return null;
  }

  @Override
  public MessageVo regenerateMessage(String sessionId, Long messageId) {
    // 1. 获取原消息
    //Message originalMessage = messageQuery.findAndCheck(messageId);

    // 2. 重新调用AI生成
    //String newContent = callAIService(sessionId, originalMessage.getContent(), null);

    // 3. 重新生成消息
    //Long newMessageId = messageCmd.regenerateMessage(messageId, newContent);

    // 4. 返回新消息
    Message newMessage = messageQuery.findById(/*newMessageId*/-1L);
    return MessageAssembler.toMessageVo(newMessage);
  }

  @Override
  public MessageVo feedbackMessage(String sessionId, Long messageId, MessageFeedbackDto dto) {
    // 添加消息反馈
    messageCmd.addFeedback(messageId, dto.getFeedbackType(), dto.getComment());

    // 返回更新后的消息
    Message message = messageQuery.findById(messageId);
    return MessageAssembler.toMessageVo(message);
  }

  @Override
  public MessageVo stopGeneration(String sessionId) {
    // 1. 查找正在流式生成的消息
    List<Message> streamingMessages = messageQuery.findStreamingMessages(sessionId);

    if (!streamingMessages.isEmpty()) {
      Message message = streamingMessages.get(0);

      // 2. 停止AI服务流式生成
      // aiService.stopGeneration(message.getId());

      // 3. 停止流式生成
      messageCmd.setStreaming(message.getId(), false);

      // 4. 返回当前消息状态
      return MessageAssembler.toMessageVo(message);
    }

    return new MessageVo();
  }

  @Override
  public Integer clearSessionMessages(String sessionId) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    return sessionCmd.clearMessages(session.getId());
  }

  @Override
  public void deleteAttachment(Long id) {
    // 删除附件
    // fileStorageService.deleteFile(id);
  }

  @Override
  public PageResult<MessageVo> listMessages(String sessionId, MessageFindDto dto) {
    PageRequest pageable = PageRequest.of(dto.getPageNo() - 1, dto.getPageSize());
    Page<Message> page = messageQuery.findBySessionId(sessionId, pageable);

    List<MessageVo> content = page.getContent().stream()
        .map(MessageAssembler::toMessageVo)
        .collect(Collectors.toList());

    return PageResult.of(page.getTotalElements(), content);
  }

  @Override
  public ChatStatisticsVo getChatStatistics(String period) {
    ChatStatisticsVo vo = new ChatStatisticsVo();

    // 1. 基础统计
    vo.setTotalSessions(sessionQuery.countAll());
    vo.setTotalMessages(messageQuery.countAll());

    // 2. 今日统计
    ChatStatisticsVo.TodayStats todayStats = new ChatStatisticsVo.TodayStats();
    todayStats.setSessions(sessionQuery.countToday());
    todayStats.setMessages(messageQuery.countToday());
    vo.setTodayStats(todayStats);

    // 3. 使用趋势（最近7天）
    List<ChatStatisticsVo.UsageTrend> trends = messageQuery.getUsageTrend(7);
    vo.setUsageTrend(trends);

    // 4. Top应用
    List<ChatStatisticsVo.TopApp> topApps = sessionQuery.getTopApps(5);
    vo.setTopApps(topApps);

    // 5. Top模型
    List<ChatStatisticsVo.TopModel> topModels = sessionQuery.getTopModels(5);
    vo.setTopModels(topModels);
    return vo;
  }
}
