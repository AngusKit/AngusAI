package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import java.util.List;
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

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Override
  @Transactional
  public Session create(Session session) {
    return new BizTemplate<Session>() {
      Application application;
      Model currentModel;

      @Override
      protected void checkParams() {
        // 检查应用和模型是否存在
        application = applicationQuery.findAndCheck(session.getId(), session.getModelId());

        // TODO 检查会话配额，默认每个用户应用会话数不超过500，应用总会话不超过10000
      }

      @Override
      protected Session process() {

        session.setTitle(nullSafe(session.getTitle(), "新对话"));

        ApplicationConfig appConfig = application.getConfig();
        SessionConfig sessionConfig = session.getConfig();
        sessionConfig.setTemperature(nullSafe(sessionConfig.getTemperature(),
            currentModel.getConfig().getTemperature()));
        sessionConfig.setMaxTokens(nullSafe(sessionConfig.getMaxTokens(),
            currentModel.getConfig().getMaxTokens()));
        sessionConfig.setTopP(nullSafe(sessionConfig.getTopP(),
            appConfig.getModel().getTopP()));
        sessionConfig.setFrequencyPenalty(nullSafe(sessionConfig.getFrequencyPenalty(),
            appConfig.getModel().getFrequencyPenalty()));
        sessionConfig.setPresencePenalty(nullSafe(sessionConfig.getPresencePenalty(),
            appConfig.getModel().getPresencePenalty()));
        sessionConfig.setSystemPrompt(nullSafe(sessionConfig.getSystemPrompt(),
            appConfig.getPrompts().getSystem()));

        currentModel = application.getCurrentUseMode();
        sessionConfig.setTemperature(nullSafe(sessionConfig.getTemperature(),
            currentModel.getConfig().getTemperature()));

        insert0(session);
        return session;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Session update(Session session) {
    return new BizTemplate<Session>() {
      Session sessionDb;

      @Override
      protected void checkParams() {
        // 查找并检查会话是否存在
        sessionDb = sessionQuery.findAndCheck(session.getId());

        // TODO 检查会话配额，默认每个用户应用会话数不超过500，应用总会话不超过10000
      }

      @Override
      protected Session process() {
        if (nonNull(session.getTitle())) {
          sessionDb.setTitle(session.getTitle());
        }
        if (nonNull(session.getConfig())) {
          CoreUtils.copyPropertiesIgnoreNull(session.getConfig(), sessionDb.getConfig());
        }
        update(session, sessionDb);
        return sessionDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void switchApp(Long id, Long appId) {
    new BizTemplate<Void>() {
      Session session;
      Application application;

      @Override
      protected void checkParams() {
        // 查找并检查会话是否存在
        session = sessionQuery.findAndCheck(id);

        // 检查应用是否存在
        applicationQuery.findAndCheck(appId);
      }

      @Override
      protected Void process() {
        session.setAppId(appId);
        session.setModelId(application.getModelId());
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
        // 查找并检查会话是否存在
        session = sessionQuery.findAndCheck(id);
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
        // 查找并检查会话是否存在
        session = sessionQuery.findAndCheck(id);
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
  public void delete(Long id) {
    new BizTemplate<Void>() {
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
  public Integer batchDelete(List<Long> sessionIds) {
    return new BizTemplate<Integer>() {
      @Override
      protected Integer process() {
        // 删除会话的所有消息
        messageRepo.deleteBySessionIdIn(sessionIds);
        // 删除会话
        return sessionRepo.deleteByIdIn(sessionIds);
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
        // 查找并检查会话是否存在
        session = sessionQuery.findAndCheck(id);
      }

      @Override
      protected Integer process() {
        long count = messageRepo.deleteBySessionId(id);

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
  public void updateLastMessage(Long sessionId, String content, MessageRole role) {
    Session session = sessionRepo.findById(sessionId).orElse(null);
    if (session != null) {
      session.setLastMessageContent(lengthSafe(content, 60000));
      session.setLastMessageRole(role);
      sessionRepo.save(session);
    }
  }

  @Override
  @Transactional
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
