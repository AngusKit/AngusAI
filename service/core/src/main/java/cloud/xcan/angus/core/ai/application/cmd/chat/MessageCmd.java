package cloud.xcan.angus.core.ai.application.cmd.chat;

import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import java.util.List;

/**
 * 消息命令接口
 */
public interface MessageCmd {

  /**
   * 创建消息
   *
   * @param sessionId 会话ID（UUID），与 Session.sessionId 统一
   */
  Long create(String sessionId, MessageRole role, String content);

  /**
   * 创建带附件的消息
   *
   * @param sessionId 会话ID（UUID）
   */
  Long createWithAttachments(String sessionId, MessageRole role, String content,
      List<MessageAttachment> attachments);

  /**
   * 设置消息流式生成状态
   */
  void setStreaming(Long id, Boolean isStreaming);

  /**
   * 添加消息反馈
   */
  void addFeedback(Long id, String feedbackType, String feedbackComment);

  /**
   * 删除消息
   */
  void delete(Long id);

}
