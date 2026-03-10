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
  AttachmentUploadVo uploadAttachment(MultipartFile file, String sessionId);

  /**
   * 消息反馈
   */
  MessageVo feedbackMessage(String sessionId, Long messageId, MessageFeedbackDto dto);

  /**
   * 停止生成
   */
  MessageVo stopGeneration(String sessionId);

  /**
   * 清空会话消息
   */
  Integer clearSessionMessages(String sessionId);

  /**
   * 删除附件
   */
  void deleteAttachment(Long id);

  /**
   * 获取消息历史
   */
  PageResult<MessageVo> listMessages(String sessionId, MessageFindDto dto);

  /**
   * 获取对话统计
   */
  ChatStatisticsVo getChatStatistics(String period);
}
