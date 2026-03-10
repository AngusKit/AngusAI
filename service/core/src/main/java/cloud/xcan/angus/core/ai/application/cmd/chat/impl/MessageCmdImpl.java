package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 消息命令实现
 */
@Service
public class MessageCmdImpl extends CommCmd<Message, Long> implements MessageCmd {

  @Resource
  private MessageRepo messageRepo;

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  private SessionQuery sessionQuery;

  @Override
  @Transactional
  public Long create(String sessionId, MessageRole role, String content) {
    return new BizTemplate<Long>() {
      cloud.xcan.angus.core.ai.domain.chat.Session session;

      @Override
      protected void checkParams() {
        if (sessionId == null || sessionId.isBlank()) {
          throw new IllegalArgumentException("会话ID不能为空");
        }
        if (role == null) {
          throw new IllegalArgumentException("消息角色不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
          throw new IllegalArgumentException("消息内容不能为空");
        }
        session = sessionQuery.findAndCheckBySessionId(sessionId);
      }

      @Override
      protected Long process() {
        Message message = new Message();
        message.setSessionEntityId(session.getId());
        message.setSessionId(session.getSessionId());
        message.setRole(role);
        message.setContent(content);
        message.setIsStreaming(false);

        Message savedMessage = messageRepo.save(message);

        sessionCmd.incrementMessageCount(session.getId());
        sessionCmd.updateLastMessage(session.getId(), content, role);

        return savedMessage.getId();
      }
    }.execute();
  }

  @Override
  @Transactional
  public Long createWithAttachments(String sessionId, MessageRole role, String content,
      List<MessageAttachment> attachments) {
    return new BizTemplate<Long>() {
      cloud.xcan.angus.core.ai.domain.chat.Session session;

      @Override
      protected void checkParams() {
        if (sessionId == null || sessionId.isBlank()) {
          throw new IllegalArgumentException("会话ID不能为空");
        }
        if (role == null) {
          throw new IllegalArgumentException("消息角色不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
          throw new IllegalArgumentException("消息内容不能为空");
        }
        session = sessionQuery.findAndCheckBySessionId(sessionId);
      }

      @Override
      protected Long process() {
        Message message = new Message();
        message.setSessionEntityId(session.getId());
        message.setSessionId(session.getSessionId());
        message.setRole(role);
        message.setContent(content);
        message.setAttachments(attachments);
        message.setIsStreaming(false);

        Message savedMessage = messageRepo.save(message);

        sessionCmd.incrementMessageCount(session.getId());
        sessionCmd.updateLastMessage(session.getId(), content, role);

        return savedMessage.getId();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void setStreaming(Long id, Boolean isStreaming) {
    new BizTemplate<Void>() {
      Message message;

      @Override
      protected void checkParams() {
        message = messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        message.setIsStreaming(isStreaming);
        messageRepo.save(message);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void addFeedback(Long id, String feedbackType, String feedbackComment) {
    new BizTemplate<Void>() {
      Message message;

      @Override
      protected void checkParams() {
        message = messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        message.setFeedbackType(feedbackType);
        message.setFeedbackComment(feedbackComment);
        messageRepo.save(message);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        messageRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Message, Long> getRepository() {
    return messageRepo;
  }
}
