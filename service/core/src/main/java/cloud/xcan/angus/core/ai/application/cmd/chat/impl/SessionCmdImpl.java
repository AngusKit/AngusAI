package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import java.util.List;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

/**
 * 会话命令实现
 */
@Component
public class SessionCmdImpl extends CommCmd<Session, Long> implements SessionCmd {

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private MessageRepo messageRepo;

  @Override
  @Transactional
  public Long create(String title, Long appId, Long modelId, SessionConfig config) {
    return new BizTemplate<Long>() {
      @Override
      protected void checkParams() {
        // 参数验证
        if (appId == null) {
          throw new IllegalArgumentException("应用ID不能为空");
        }
        if (modelId == null) {
          throw new IllegalArgumentException("模型ID不能为空");
        }
      }

      @Override
      protected Long process() {
        Session session = new Session();
        session.setTitle(ObjectUtils.defaultIfNull(title, "新对话"));
        session.setAppId(appId);
        session.setModelId(modelId);
        session.setConfig(config);
        session.setMessageCount(0);
        session.setIsArchived(false);
        session.setIsPinned(false);
        session.setIsStarred(false);

        Session savedSession = sessionRepo.save(session);
        return savedSession.getId();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void update(Long id, String title, Long appId, Long modelId, SessionConfig config,
                     Boolean isPinned, Boolean isStarred, Boolean isArchived) {
    new BizTemplate<Void>() {
      Session session;

      @Override
      protected void checkParams() {
        session = sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        if (title != null) session.setTitle(title);
        if (appId != null) session.setAppId(appId);
        if (modelId != null) session.setModelId(modelId);
        if (config != null) {
          SessionConfig existingConfig = session.getConfig();
          if (existingConfig == null) {
            session.setConfig(config);
          } else {
            CoreUtils.copyPropertiesIgnoreNull(config, existingConfig);
          }
        }
        if (isPinned != null) session.setIsPinned(isPinned);
        if (isStarred != null) session.setIsStarred(isStarred);
        if (isArchived != null) session.setIsArchived(isArchived);

        sessionRepo.save(session);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void switchApp(Long id, Long appId) {
    new BizTemplate<Void>() {
      Session session;

      @Override
      protected void checkParams() {
        session = sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        session.setAppId(appId);
        sessionRepo.save(session);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void switchModel(Long id, Long modelId) {
    new BizTemplate<Void>() {
      Session session;

      @Override
      protected void checkParams() {
        session = sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        session.setModelId(modelId);
        sessionRepo.save(session);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void star(Long id, Boolean isStarred) {
    new BizTemplate<Void>() {
      Session session;

      @Override
      protected void checkParams() {
        session = sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        session.setIsStarred(isStarred);
        sessionRepo.save(session);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void updateLastMessage(Long sessionId, String content, MessageRole role) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        Session session = sessionRepo.findById(sessionId).orElse(null);
        if (session != null) {
          session.setLastMessageContent(content.length() > 200 ? content.substring(0, 200) : content);
          session.setLastMessageRole(role);
          session.setLastMessageTime(System.currentTimeMillis());
          sessionRepo.save(session);
        }
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void incrementMessageCount(Long sessionId) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        Session session = sessionRepo.findById(sessionId).orElse(null);
        if (session != null) {
          session.setMessageCount(session.getMessageCount() + 1);
          sessionRepo.save(session);
        }
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
        sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Void process() {
        // 删除会话的所有消息
        messageRepo.deleteBySessionId(id);
        // 删除会话
        sessionRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Integer clearMessages(Long id) {
    return new BizTemplate<Integer>() {
      Session session;

      @Override
      protected void checkParams() {
        session = sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
      }

      @Override
      protected Integer process() {
        long count = messageRepo.countBySessionId(id);
        messageRepo.deleteBySessionId(id);

        // 更新会话消息计数
        session.setMessageCount(0);
        session.setLastMessageContent(null);
        session.setLastMessageRole(null);
        session.setLastMessageTime(null);
        sessionRepo.save(session);

        return (int) count;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Integer batchDelete(List<Long> sessionIds) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        int count = 0;
        for (Long id : sessionIds) {
          try {
            delete(id);
            count++;
          } catch (Exception e) {
            // 记录日志，继续删除其他会话
          }
        }
        return count;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Session, Long> getRepository() {
    return sessionRepo;
  }
}
