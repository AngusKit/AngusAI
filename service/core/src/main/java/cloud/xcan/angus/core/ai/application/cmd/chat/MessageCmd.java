package cloud.xcan.angus.core.ai.application.cmd.chat;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.domain.chat.Session;

/**
 * 消息命令接口
 */
public interface MessageCmd {

  /**
   * 创建消息
   */
  Message create0(Session session, MessageRole role, String content);

  /**
   * 创建消息，可指定父消息ID（用于 ASSISTANT 关联对应的 USER 消息）
   */
  Message create0(Session session, MessageRole role, String content, Long parentMessageId);

  /**
   * 添加消息反馈
   */
  void addFeedback(Long id, String feedbackType, String feedbackComment);

  /**
   * 清除消息反馈（将 feedbackType、feedbackComment 置空）
   */
  void clearFeedback(Long id);

  /**
   * 删除消息
   */
  void delete(Long id);

  /**
   * 设置消息流式生成状态
   */
  void setStreaming(Message message, Boolean isStreaming);

}
