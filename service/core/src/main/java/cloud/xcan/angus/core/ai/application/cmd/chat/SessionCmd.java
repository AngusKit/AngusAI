package cloud.xcan.angus.core.ai.application.cmd.chat;

import cloud.xcan.angus.core.ai.domain.chat.Session;

/**
 * 会话命令接口
 */
public interface SessionCmd {

  /**
   * 创建会话
   */
  Session create(Session session);

  /**
   * 更新会话
   */
  Session update(Session session);

  /**
   * 切换应用
   */
  void switchApp(Long id, Long appId);

  /**
   * 切换模型
   */
  void switchModel(Long id, Long modelId);

  /**
   * 收藏/取消收藏
   */
  void star(Long id, Boolean isStarred);

  /**
   * 增加消息计数
   */
  void incrementMessageCount(Long sessionId);

  /**
   * 删除会话
   */
  void delete(Long id);

  /**
   * 清空会话消息
   */
  Integer clearMessages(Long id);

  /**
   * 批量删除会话
   */
  Integer batchDelete(java.util.List<Long> sessionIds);

}
