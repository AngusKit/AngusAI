package cloud.xcan.angus.core.ai.application.query.chat.impl;

import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 会话查询实现
 */
@Service
public class SessionQueryImpl implements SessionQuery {

  @Resource
  private SessionRepo sessionRepo;

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
  public List<Session> findByAppId(Long appId) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        return sessionRepo.findByAppId(appId);
      }
    }.execute();
  }

  @Override
  public List<Session> findByModelId(Long modelId) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        return sessionRepo.findByModelId(modelId);
      }
    }.execute();
  }

  @Override
  public List<Session> findPinnedSessions(Long userId) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        return sessionRepo.findByCreatedByAndIsPinnedTrueOrderByLastModifiedDateDesc(userId);
      }
    }.execute();
  }

  @Override
  public List<Session> findStarredSessions(Long userId) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        return sessionRepo.findByCreatedByAndIsStarredTrueOrderByLastModifiedDateDesc(userId);
      }
    }.execute();
  }

  @Override
  public List<Session> findArchivedSessions(Long userId) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        return sessionRepo.findByCreatedByAndIsArchivedTrueOrderByLastModifiedDateDesc(userId);
      }
    }.execute();
  }

  @Override
  public Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable) {
    return new BizTemplate<Page<Session>>() {
      @Override
      protected Page<Session> process() {
        return sessionRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable, 
                            boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Session>>() {
      @Override
      protected Page<Session> process() {
        // TODO: 实现全文搜索
        // 如果支持全文搜索，应该使用SearchRepository
        // 否则使用普通的findAll
        return sessionRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return sessionRepo.countByCreatedBy(createdBy);
      }
    }.execute();
  }

  @Override
  public long countByAppId(Long appId) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return sessionRepo.countByAppId(appId);
      }
    }.execute();
  }

  @Override
  public long countByModelId(Long modelId) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return sessionRepo.countByModelId(modelId);
      }
    }.execute();
  }

  @Override
  public List<Session> findRecentSessions(Long userId, int limit) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        Pageable pageable = PageRequest.of(0, limit);
        return sessionRepo.findByCreatedByOrderByCreatedDateDesc(userId, pageable).getContent();
      }
    }.execute();
  }

  @Override
  public List<Session> findRecentActiveSessions(Long userId, int limit) {
    return new BizTemplate<List<Session>>() {
      @Override
      protected List<Session> process() {
        Pageable pageable = PageRequest.of(0, limit);
        return sessionRepo.findByCreatedByOrderByLastModifiedDateDesc(userId, pageable).getContent();
      }
    }.execute();
  }
}
