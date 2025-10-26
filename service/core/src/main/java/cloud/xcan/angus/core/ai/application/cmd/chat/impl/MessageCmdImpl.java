package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.MessageUsage;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * 消息命令实现
 */
@Component
public class MessageCmdImpl extends CommCmd<Message, Long> implements MessageCmd {

  @Resource
  private MessageRepo messageRepo;

  @Resource
  private SessionCmd sessionCmd;

  @Override
  @Transactional
  public Long create(Long sessionId, MessageRole role, String content) {
    return new BizTemplate<Long>() {
      @Override
      protected void checkParams() {
        if (sessionId == null) {
          throw new IllegalArgumentException("会话ID不能为空");
        }
        if (role == null) {
          throw new IllegalArgumentException("消息角色不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
          throw new IllegalArgumentException("消息内容不能为空");
        }
      }

      @Override
      protected Long process() {
        Message message = new Message();
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        message.setIsStreaming(false);

        Message savedMessage = messageRepo.save(message);

        // 更新会话统计
        sessionCmd.incrementMessageCount(sessionId);
        sessionCmd.updateLastMessage(sessionId, content, role);

        return savedMessage.getId();
      }
    }.execute();
  }

  @Override
  @Transactional
  public Long createWithAttachments(Long sessionId, MessageRole role, String content,
      List<MessageAttachment> attachments) {
    return new BizTemplate<Long>() {
      @Override
      protected void checkParams() {
        if (sessionId == null) {
          throw new IllegalArgumentException("会话ID不能为空");
        }
        if (role == null) {
          throw new IllegalArgumentException("消息角色不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
          throw new IllegalArgumentException("消息内容不能为空");
        }
      }

      @Override
      protected Long process() {
        Message message = new Message();
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        message.setAttachments(attachments);
        message.setIsStreaming(false);

        Message savedMessage = messageRepo.save(message);

        // 更新会话统计
        sessionCmd.incrementMessageCount(sessionId);
        sessionCmd.updateLastMessage(sessionId, content, role);

        return savedMessage.getId();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void updateContent(Long id, String content) {
    new BizTemplate<Void>() {
      Message message;

      @Override
      protected void checkParams() {
        message = messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        message.setContent(content);
        messageRepo.save(message);

        // 更新会话的最后消息
        sessionCmd.updateLastMessage(message.getSessionId(), content, message.getRole());

        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void updateUsage(Long id, MessageUsage usage) {
    new BizTemplate<Void>() {
      Message message;

      @Override
      protected void checkParams() {
        message = messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        message.setUsage(usage);
        messageRepo.save(message);
        return null;
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
  public Long regenerateMessage(Long originalMessageId, String newContent) {
    return new BizTemplate<Long>() {
      Message originalMessage;

      @Override
      protected void checkParams() {
        originalMessage = messageRepo.findById(originalMessageId)
            .orElseThrow(() -> ResourceNotFound.of("原消息不存在", new Object[]{}));
      }

      @Override
      protected Long process() {
        // 删除原消息
        messageRepo.deleteById(originalMessageId);

        // 创建新消息
        Message newMessage = new Message();
        newMessage.setSessionId(originalMessage.getSessionId());
        newMessage.setRole(originalMessage.getRole());
        newMessage.setContent(newContent);
        newMessage.setAttachments(originalMessage.getAttachments());
        newMessage.setIsStreaming(false);
        newMessage.setParentMessageId(originalMessageId);

        Message savedMessage = messageRepo.save(newMessage);

        // 更新会话的最后消息
        sessionCmd.updateLastMessage(originalMessage.getSessionId(), newContent,
            originalMessage.getRole());

        return savedMessage.getId();
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
  @Transactional
  public Integer batchDelete(List<Long> messageIds) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        int count = 0;
        for (Long id : messageIds) {
          try {
            delete(id);
            count++;
          } catch (Exception e) {
            // 记录日志，继续删除其他消息
          }
        }
        return count;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void deleteBySessionId(Long sessionId) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        messageRepo.deleteBySessionId(sessionId);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Message, Long> getRepository() {
    return messageRepo;
  }
}
