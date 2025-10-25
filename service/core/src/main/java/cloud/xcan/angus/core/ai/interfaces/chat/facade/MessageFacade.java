package cloud.xcan.angus.core.ai.interfaces.chat.facade;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFeedbackDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageSendDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.AttachmentUploadVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageSendVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.remote.PageResult;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 消息Facade接口
 */
public interface MessageFacade {

  /**
   * 发送消息
   */
  MessageSendVo sendMessage(Long sessionId, MessageSendDto dto);

  /**
   * 发送消息（流式）
   */
  SseEmitter sendMessageStream(Long sessionId, MessageSendDto dto);

  /**
   * 获取消息历史
   */
  PageResult<MessageVo> listMessages(Long sessionId, MessageFindDto dto);

  /**
   * 重新生成消息
   */
  MessageVo regenerateMessage(Long sessionId, Long messageId);

  /**
   * 消息反馈
   */
  MessageVo feedbackMessage(Long sessionId, Long messageId, MessageFeedbackDto dto);

  /**
   * 停止生成
   */
  MessageVo stopGeneration(Long sessionId);

  /**
   * 清空会话消息
   */
  Integer clearSessionMessages(Long sessionId);

  /**
   * 上传附件
   */
  AttachmentUploadVo uploadAttachment(MultipartFile file, Long sessionId);

  /**
   * 删除附件
   */
  void deleteAttachment(Long id);

  /**
   * 获取对话统计
   */
  ChatStatisticsVo getChatStatistics(String period);
}
