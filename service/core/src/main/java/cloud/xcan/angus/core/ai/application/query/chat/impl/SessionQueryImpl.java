package cloud.xcan.angus.core.ai.application.query.chat.impl;

import static cloud.xcan.angus.core.ai.domain.Constants.SESSION_QUOTA_PER_APP_TOTAL;
import static cloud.xcan.angus.core.ai.domain.Constants.SESSION_QUOTA_PER_USER_APP;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.ai.domain.chat.SessionSearchRepo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopApp;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopModel;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * 会话查询实现
 */
@Service
public class SessionQueryImpl implements SessionQuery {

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private SessionSearchRepo sessionSearchRepo;

  @Override
  public Session findById(Long id) {
    return new BizTemplate<Session>() {
      @Override
      protected Session process() {
        return sessionRepo.findById(id).orElse(null);
      }
    }.execute();
  }

  @Override
  public Session findBySessionId(String sessionId) {
    return new BizTemplate<Session>() {
      @Override
      protected Session process() {
        return sessionRepo.findBySessionId(sessionId).orElse(null);
      }
    }.execute();
  }

  @Override
  public Session findAndCheck(Long id) {
    return new BizTemplate<Session>() {
      @Override
      protected Session process() {
        return sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Session findAndCheckBySessionId(String sessionId) {
    return new BizTemplate<Session>() {
      @Override
      protected Session process() {
        return sessionRepo.findBySessionId(sessionId)
            .orElseThrow(() -> ResourceNotFound.of("会话「{0}」不存在", new Object[]{sessionId}));
      }
    }.execute();
  }

  @Override
  public Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Session>>() {
      @Override
      protected Page<Session> process() {
        return fullTextSearch
            ? sessionSearchRepo.find(spec.getCriteria(), pageable, Session.class, match)
            : sessionRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  /**
   * 会话配额校验：每个用户每应用不超过上限，应用总会话不超过上限。 无登录用户时仅校验应用总会话。
   */
  @Override
  public void checkSessionQuota(Long appId) {
    // 应用总会话校验
    long appTotal = sessionRepo.countByAppId(appId);
    if (appTotal >= SESSION_QUOTA_PER_APP_TOTAL) {
      throw ProtocolException.of("应用会话数已达上限「{0}」，请先删除部分会话",
          new Object[]{SESSION_QUOTA_PER_APP_TOTAL});
    }
    // 用户级配额校验（需登录上下文）
    Long userId = getUserId();
    if (userId != null) {
      long userAppCount = sessionRepo.countByCreatedByAndAppId(userId, appId);
      if (userAppCount >= SESSION_QUOTA_PER_USER_APP) {
        throw ProtocolException.of("您在该应用下的会话数已达上限「{0}」，请先删除部分会话",
            new Object[]{SESSION_QUOTA_PER_USER_APP});
      }
    }
  }

  @Override
  public List<TopApp> getTopApps(int limit) {
    return List.of();
  }

  @Override
  public List<TopModel> getTopModels(int limit) {
    return List.of();
  }

  @Override
  public Long countAll() {
    return 0L;
  }

  @Override
  public Long countToday() {
    return 0L;
  }
}
