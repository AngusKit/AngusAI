package cloud.xcan.angus.core.ai.application.query.chat;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopApp;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.TopModel;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * 会话查询接口
 */
public interface SessionQuery {

  /**
   * 根据ID查找会话
   */
  Session findById(Long id);

  /**
   * 根据会话ID(UUID)查找
   */
  Session findBySessionId(String sessionId);

  /**
   * 查找并检查会话是否存在（按实体ID）
   */
  Session findAndCheck(Long id);

  /**
   * 根据会话ID(UUID)查找并检查
   */
  Session findAndCheckBySessionId(String sessionId);

  /**
   * 根据条件查询会话（支持全文搜索）
   */
  Page<Session> find(GenericSpecification<Session> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据应用ID查询会话列表
   */
  List<Session> findByAppId(Long appId);

  /**
   * 根据模型ID查询会话列表
   */
  List<Session> findByModelId(Long modelId);

  /**
   * 查询最近创建的会话
   */
  List<Session> findRecentSessions(Long userId, int limit);

  /**
   * 查询最近活跃的会话
   */
  List<Session> findRecentActiveSessions(Long userId, int limit);

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
   * 获取Top应用
   */
  List<TopApp> getTopApps(int limit);

  /**
   * 获取Top模型
   */
  List<TopModel> getTopModels(int limit);

  /**
   * 统计总会话
   */
  Long countAll();

  /**
   * 统计今日会话
   */
  Long countToday();
}
