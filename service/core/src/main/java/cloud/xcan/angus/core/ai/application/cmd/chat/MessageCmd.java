package cloud.xcan.angus.core.ai.application.cmd.chat;

import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.MessageUsage;

/**
 * 消息命令接口
 */
public interface MessageCmd {

  /**
   * 创建消息
   */
  Long create(Long sessionId, MessageRole role, String content);

  /**
   * 创建带附件的消息
   */
  Long createWithAttachments(Long sessionId, MessageRole role, String content, 
                             java.util.List<cloud.xcan.angus.core.ai.domain.chat.MessageAttachment> attachments);

  /**
   * 更新消息内容
   */
  void updateContent(Long id, String content);

  /**
   * 更新消息使用统计
   */
  void updateUsage(Long id, MessageUsage usage);

  /**
   * 设置消息流式生成状态
   */
  void setStreaming(Long id, Boolean isStreaming);

  /**
   * 添加消息反馈
   */
  void addFeedback(Long id, String feedbackType, String feedbackComment);

  /**
   * 重新生成消息（删除原消息，创建新消息）
   */
  Long regenerateMessage(Long originalMessageId, String newContent);

  /**
   * 删除消息
   */
  void delete(Long id);

  /**
   * 批量删除消息
   */
  Integer batchDelete(java.util.List<Long> messageIds);

  /**
   * 删除会话的所有消息
   */
  void deleteBySessionId(Long sessionId);
}
