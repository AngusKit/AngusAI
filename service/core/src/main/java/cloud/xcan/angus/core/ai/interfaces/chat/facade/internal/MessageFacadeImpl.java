package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parsePeriodDays;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.infra.agent.ActiveStreamRegistry;
import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.MessageFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFeedbackDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler.MessageAssembler;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.AttachmentUploadVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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
  private ActiveStreamRegistry activeStreamRegistry;

  @Override
  public AttachmentUploadVo uploadAttachment(MultipartFile file, Long messageId) {
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

  @NameJoin
  @Override
  public MessageVo feedbackMessage(Long messageId, MessageFeedbackDto dto) {
    // 添加消息反馈
    messageCmd.addFeedback(messageId, dto.getFeedbackType(), dto.getComment());

    // 返回更新后的消息
    Message message = messageQuery.findById(messageId);
    return MessageAssembler.toMessageVo(message);
  }

  @NameJoin
  @Override
  public MessageVo stopGeneration(Long messageId) {
    Message message = messageQuery.findAndCheck(messageId);
    ActiveStreamRegistry.StreamContext ctx = activeStreamRegistry.remove(messageId);
    if (ctx != null) {
      ctx.getCancelled().set(true);
      message.setContent(ctx.getFullContent().toString());
      messageCmd.updateContent(message);
      messageCmd.setStreaming(message, false);
      try {
        ctx.getEmitter().complete();
      } catch (Exception e) {
        // emitter 可能已关闭，忽略
      }
    } else if (Boolean.TRUE.equals(message.getIsStreaming())) {
      messageCmd.setStreaming(message, false);
    }
    return MessageAssembler.toMessageVo(message);
  }

  @Override
  public void clearFeedback(Long messageId) {
    messageCmd.clearFeedback(messageId);
  }

  @Override
  public void deleteMessage(Long messageId) {
    messageCmd.delete(messageId);
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

  @NameJoin
  @Override
  public MessageVo getMessage(Long messageId) {
    Message message = messageQuery.findAndCheck(messageId);
    return MessageAssembler.toMessageVo(message);
  }

  @NameJoin
  @Override
  public PageResult<MessageVo> list(MessageFindDto dto) {
    GenericSpecification<Message> spec = MessageAssembler.getSpecification(dto);
    Page<Message> page = messageQuery.find(spec, dto.tranPage(), dto.fullTextSearch,
        getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, MessageAssembler::toMessageVo);
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

    // 3. 使用趋势，period 格式：7、30 或 7d、30d，默认 7 天
    int trendDays = parsePeriodDays(period);
    vo.setUsageTrend(messageQuery.getUsageTrend(trendDays));

    // 4. Top应用
    vo.setTopApps(sessionQuery.getTopApps(5));

    // 5. Top模型
    vo.setTopModels(sessionQuery.getTopModels(5));
    return vo;
  }

}
