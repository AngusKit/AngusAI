package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.infra.biz.BizTemplate;
import cloud.xcan.angus.infra.biz.CommCmd;
import cloud.xcan.angus.infra.biz.annotation.Biz;
import cloud.xcan.angus.infra.biz.annotation.DoInFuture;
import cloud.xcan.angus.infra.exception.ResourceExisted;
import cloud.xcan.angus.infra.exception.ResourceNotFound;
import cloud.xcan.angus.infra.jpa.common.BaseRepository;
import cloud.xcan.angus.infra.util.CoreUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 会话命令实现
 */
@Component
public class SessionCmdImpl extends CommCmd<Session, Long> implements SessionCmd {

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private cloud.xcan.angus.core.ai.domain.chat.MessageRepo messageRepo;

  @Override
  @Biz
  public Long create(String title, Long appId, Long modelId, SessionConfig config) {
    return BizTemplate.<Long>builder()
        .checkParams(() -> {
          // 参数验证
          if (appId == null) {
            throw new IllegalArgumentException("应用ID不能为空");
          }
          if (modelId == null) {
            throw new IllegalArgumentException("模型ID不能为空");
          }
        })
        .process(() -> {
          Session session = new Session();
          session.setTitle(ObjectUtils.defaultIfNull(title, "新对话"));
          session.setAppId(appId);
          session.setModelId(modelId);
          session.setConfig(config);
          session.setMessageCount(0);
          session.setIsArchived(false);
          session.setIsPinned(false);
          session.setIsStarred(false);

          return insert0(session).getId();
        })
        .execute();
  }

  @Override
  @Biz
  public void update(Long id, String title, Long appId, Long modelId, SessionConfig config,
                     Boolean isPinned, Boolean isStarred, Boolean isArchived) {
    BizTemplate.<Void>builder()
        .checkParams(() -> {
          Session session = sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          Session session = sessionRepo.findById(id).get();

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
        })
        .execute();
  }

  @Override
  @Biz
  public void delete(Long id) {
    BizTemplate.<Void>builder()
        .checkParams(() -> {
          Session session = sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          // 删除会话的所有消息
          messageRepo.deleteBySessionId(id);
          // 删除会话
          sessionRepo.deleteById(id);
          return null;
        })
        .execute();
  }

  @Override
  @Biz
  public void switchApp(Long id, Long appId) {
    BizTemplate.<Void>builder()
        .checkParams(() -> {
          sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          Session session = sessionRepo.findById(id).get();
          session.setAppId(appId);
          sessionRepo.save(session);
          return null;
        })
        .execute();
  }

  @Override
  @Biz
  public void switchModel(Long id, Long modelId) {
    BizTemplate.<Void>builder()
        .checkParams(() -> {
          sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          Session session = sessionRepo.findById(id).get();
          session.setModelId(modelId);
          sessionRepo.save(session);
          return null;
        })
        .execute();
  }

  @Override
  @Biz
  public void star(Long id, Boolean isStarred) {
    BizTemplate.<Void>builder()
        .checkParams(() -> {
          sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          Session session = sessionRepo.findById(id).get();
          session.setIsStarred(isStarred);
          sessionRepo.save(session);
          return null;
        })
        .execute();
  }

  @Override
  @Biz
  public Integer clearMessages(Long id) {
    return BizTemplate.<Integer>builder()
        .checkParams(() -> {
          sessionRepo.findById(id)
              .orElseThrow(() -> new ResourceNotFound("session", id));
        })
        .process(() -> {
          long count = messageRepo.countBySessionId(id);
          messageRepo.deleteBySessionId(id);

          // 更新会话消息计数
          Session session = sessionRepo.findById(id).get();
          session.setMessageCount(0);
          session.setLastMessageContent(null);
          session.setLastMessageRole(null);
          session.setLastMessageTime(null);
          sessionRepo.save(session);

          return (int) count;
        })
        .execute();
  }

  @Override
  @Biz
  public Integer batchDelete(List<Long> sessionIds) {
    return BizTemplate.<Integer>builder()
        .process(() -> {
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
        })
        .execute();
  }

  @Override
  @DoInFuture
  public void updateLastMessage(Long sessionId, String content, MessageRole role) {
    Session session = sessionRepo.findById(sessionId).orElse(null);
    if (session != null) {
      session.setLastMessageContent(content.length() > 200 ? content.substring(0, 200) : content);
      session.setLastMessageRole(role);
      session.setLastMessageTime(System.currentTimeMillis());
      sessionRepo.save(session);
    }
  }

  @Override
  @DoInFuture
  public void incrementMessageCount(Long sessionId) {
    Session session = sessionRepo.findById(sessionId).orElse(null);
    if (session != null) {
      session.setMessageCount(session.getMessageCount() + 1);
      sessionRepo.save(session);
    }
  }

  @Override
  protected BaseRepository<Session, Long> getRepository() {
    return sessionRepo;
  }
}
