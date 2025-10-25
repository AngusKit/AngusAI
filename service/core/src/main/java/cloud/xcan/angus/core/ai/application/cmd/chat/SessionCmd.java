package cloud.xcan.angus.core.ai.application.cmd.chat;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;

/**
 * 会话命令接口
 */
public interface SessionCmd {

  /**
   * 创建会话
   */
  Long create(String title, Long appId, Long modelId, SessionConfig config);

  /**
   * 更新会话
   */
  void update(Long id, String title, Long appId, Long modelId, SessionConfig config,
              Boolean isPinned, Boolean isStarred, Boolean isArchived);

  /**
   * 删除会话
   */
  void delete(Long id);

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
   * 清空会话消息
   */
  Integer clearMessages(Long id);

  /**
   * 批量删除会话
   */
  Integer batchDelete(java.util.List<Long> sessionIds);

  /**
   * 更新会话的最后消息信息
   */
  void updateLastMessage(Long sessionId, String content, cloud.xcan.angus.core.ai.domain.chat.MessageRole role);

  /**
   * 增加消息计数
   */
  void incrementMessageCount(Long sessionId);
}
