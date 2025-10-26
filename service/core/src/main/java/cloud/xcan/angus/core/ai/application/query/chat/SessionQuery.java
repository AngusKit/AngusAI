package cloud.xcan.angus.core.ai.application.query.chat;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * 会话查询接口
 */
public interface SessionQuery {

  /**
   * 根据ID查找会话
   */
  Session findById(Long id);

  /**
   * 根据ID查找并检查会话是否存在
   */
  Session findAndCheck(Long id);

  /**
   * 根据应用ID查询会话列表
   */
  List<Session> findByAppId(Long appId);

  /**
   * 根据模型ID查询会话列表
   */
  List<Session> findByModelId(Long modelId);

  /**
   * 查询用户的置顶会话
   */
  List<Session> findPinnedSessions(Long userId);

  /**
   * 查询用户的收藏会话
   */
  List<Session> findStarredSessions(Long userId);

  /**
   * 查询用户的归档会话
   */
  List<Session> findArchivedSessions(Long userId);

  /**
   * 根据条件查询会话
   */
  Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable);

  /**
   * 根据条件查询会话（支持全文搜索）
   */
  Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable, 
                     boolean fullTextSearch, String[] match);

  /**
   * 统计用户的会话数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计应用的使用次数
   */
  long countByAppId(Long appId);

  /**
   * 统计模型的使用次数
   */
  long countByModelId(Long modelId);

  /**
   * 查询最近创建的会话
   */
  List<Session> findRecentSessions(Long userId, int limit);

  /**
   * 查询最近活跃的会话
   */
  List<Session> findRecentActiveSessions(Long userId, int limit);
}
