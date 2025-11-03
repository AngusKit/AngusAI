package cloud.xcan.angus.core.ai.application.query.chat.impl;

import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.ai.domain.chat.SessionSearchRepo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopApp;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopModel;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
  public Session findAndCheck(Long id) {
    return new BizTemplate<Session>() {
      @Override
      protected Session process() {
        return sessionRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("会话不存在", new Object[]{}));
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

  @Override
  public List<Session> findByAppId(Long appId) {
    return sessionRepo.findByAppId(appId);
  }

  @Override
  public List<Session> findByModelId(Long modelId) {
    return sessionRepo.findByModelId(modelId);
  }

  @Override
  public List<Session> findPinnedSessions(Long userId) {
    return sessionRepo.findByCreatedByAndIsPinnedTrueOrderByLastModifiedDateDesc(userId);
  }

  @Override
  public List<Session> findStarredSessions(Long userId) {
    return sessionRepo.findByCreatedByAndIsPinnedTrueOrderByLastModifiedDateDesc(userId);
  }

  @Override
  public List<Session> findArchivedSessions(Long userId) {
    return sessionRepo.findByCreatedByAndIsPinnedTrueOrderByLastModifiedDateDesc(userId);
  }

  @Override
  public List<Session> findRecentSessions(Long userId, int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return sessionRepo.findByCreatedByOrderByCreatedDateDesc(userId, pageable).getContent();
  }

  @Override
  public List<Session> findRecentActiveSessions(Long userId, int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return sessionRepo.findByCreatedByOrderByLastModifiedDateDesc(userId, pageable).getContent();
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return sessionRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByAppId(Long appId) {
    return sessionRepo.countByAppId(appId);
  }

  @Override
  public long countByModelId(Long modelId) {
    return sessionRepo.countByModelId(modelId);
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
