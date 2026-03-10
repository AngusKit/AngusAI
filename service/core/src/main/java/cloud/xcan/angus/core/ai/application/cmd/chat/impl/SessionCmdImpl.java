package cloud.xcan.angus.core.ai.application.cmd.chat.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
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
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * 会话命令实现
 */
@Service
public class SessionCmdImpl extends CommCmd<Session, Long> implements SessionCmd {

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private MessageRepo messageRepo;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private SessionCmd self;

  @Override
  @Transactional
  public Session create(Session session) {
    return new BizTemplate<Session>() {
      AIApplication application;
      Model currentModel;
      Agent agent;

      @Override
      protected void checkParams() {
        // 检查应用和模型是否存在（appId 必填，modelId 可选，默认从 Agent 获取）
        application = applicationQuery.findAndCheck(session.getAppId(), session.getModelId());
        currentModel = application.getCurrentUseMode();
        agent = agentQuery.findAndCheck(applicationQuery.getDefaultAgentId(application.getId()));
        // 会话配额校验
        sessionQuery.checkSessionQuota(session.getAppId());
      }

      @Override
      protected Session process() {
        session.setSessionId(nullSafe(session.getSessionId(), UUID.randomUUID().toString()));
        session.setTitle(nullSafe(session.getTitle(), "新对话"));
        // 会话默认使用应用绑定的 Agent 的模型
        if (session.getModelId() == null) {
          session.setModelId(currentModel.getId());
        }

        SessionConfig sessionConfig = session.getConfig();
        if (currentModel != null && currentModel.getConfig() != null) {
          var modelConfig = currentModel.getConfig();
          sessionConfig.setTemperature(nullSafe(sessionConfig.getTemperature(),
              modelConfig.getTemperature()));
          sessionConfig.setMaxTokens(nullSafe(sessionConfig.getMaxTokens(),
              modelConfig.getMaxTokens()));
          // topP/frequencyPenalty/presencePenalty 不在 ModelConfigDefinition 中，使用默认值
          sessionConfig.setTopP(nullSafe(sessionConfig.getTopP(), 0.9));
          sessionConfig.setFrequencyPenalty(nullSafe(sessionConfig.getFrequencyPenalty(), 0.0));
          sessionConfig.setPresencePenalty(nullSafe(sessionConfig.getPresencePenalty(), 0.0));
        }
        sessionConfig.setSystemPrompt(nullSafe(nullSafe(sessionConfig.getSystemPrompt(),
            agent != null ? agent.getSystemPrompt() : null), ""));

        insert0(session);
        return session;
      }
    }.execute();
  }

  @Override
  public Session createOrGetForAgentChat(Agent agent, String sessionId) {
    String effectiveSessionId = (sessionId != null && !sessionId.isBlank())
        ? sessionId : UUID.randomUUID().toString();
    Session existing = sessionQuery.findBySessionId(effectiveSessionId);
    if (existing != null) {
      return existing;
    }
    Session session = new Session();
    session.setSessionId(effectiveSessionId);
    session.setAppId(agent.getId());
    session.setAgentId(agent.getId());
    session.setTitle("新对话");
    SessionConfig config = new SessionConfig();
    config.setSystemPrompt("You are a helpful assistant.");
    session.setConfig(config);
    return self.create(session);
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
      AIApplication application;

      @Override
      protected void checkParams() {
        // 查找并检查会话是否存在
        session = sessionQuery.findAndCheck(id);

        // 检查应用是否存在，并获取默认模型（来自绑定的 Agent）
        application = applicationQuery.findAndCheck(appId, null);
      }

      @Override
      protected Void process() {
        session.setAppId(appId);
        Model defaultModel = application.getCurrentUseMode();
        session.setModelId(defaultModel != null ? defaultModel.getId() : null);
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
        messageRepo.deleteBySessionEntityId(id);
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
        messageRepo.deleteBySessionEntityIdIn(sessionIds);
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
        long count = messageRepo.deleteBySessionEntityId(id);

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
