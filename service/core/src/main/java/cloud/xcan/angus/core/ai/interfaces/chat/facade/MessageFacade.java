package cloud.xcan.angus.core.ai.interfaces.chat.facade;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFeedbackDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.AttachmentUploadVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.remote.PageResult;
import org.springframework.web.multipart.MultipartFile;

/**
 * 消息Facade接口
 */
public interface MessageFacade {

  /**
   * 上传附件
   */
  AttachmentUploadVo uploadAttachment(MultipartFile file, Long messageId);

  /**
   * 消息反馈
   */
  MessageVo feedbackMessage(Long messageId, MessageFeedbackDto dto);

  /**
   * 清除消息反馈（将 feedbackType、feedbackComment 置空）
   */
  void clearFeedback(Long messageId);

  /**
   * 停止生成
   */
  MessageVo stopGeneration(Long messageId);

  /**
   * 删除消息
   */
  void deleteMessage(Long messageId);

  /**
   * 清空会话消息
   */
  Integer clearSessionMessages(String sessionId);

  /**
   * 删除附件
   */
  void deleteAttachment(Long id);

  /**
   * 根据消息 ID 查询单条消息详情（用于 SSE 断开后轮询）
   */
  MessageVo getMessage(Long messageId);

  /**
   * 获取消息历史
   */
  PageResult<MessageVo> list(MessageFindDto dto);

  /**
   * 获取对话统计
   */
  ChatStatisticsVo getChatStatistics(String period);

}
