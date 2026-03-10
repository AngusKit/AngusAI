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
   * 检查会话配额
   */
  void checkSessionQuota(Long appId);

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
