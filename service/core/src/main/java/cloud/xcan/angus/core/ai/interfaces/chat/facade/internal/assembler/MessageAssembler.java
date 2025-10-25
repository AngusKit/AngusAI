package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageSendDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.search.SearchCriteria;
import org.springframework.util.StringUtils;

import java.util.stream.Collectors;

/**
 * Message转换器
 */
public class MessageAssembler {

  /**
   * MessageSendDto -> Message (用户消息)
   */
  public static Message toUserMessage(MessageSendDto dto, Long sessionId) {
    Message message = new Message();
    message.setSessionId(sessionId);
    message.setRole(MessageRole.USER);
    message.setContent(dto.getContent());
    message.setIsStreaming(false);
    
    if (dto.getAttachments() != null && !dto.getAttachments().isEmpty()) {
      // TODO: 转换附件信息
      // message.setAttachments(dto.getAttachments().stream()
      //     .map(MessageAssembler::toAttachmentDomain)
      //     .collect(Collectors.toList()));
    }
    
    return message;
  }

  /**
   * 创建AI助手消息
   */
  public static Message createAssistantMessage(Long sessionId, String content) {
    Message message = new Message();
    message.setSessionId(sessionId);
    message.setRole(MessageRole.ASSISTANT);
    message.setContent(content);
    message.setIsStreaming(false);
    return message;
  }

  /**
   * Message -> MessageVo
   */
  public static MessageVo toMessageVo(Message message) {
    if (message == null) {
      return null;
    }
    
    MessageVo vo = new MessageVo();
    vo.setId(message.identity());
    vo.setSessionId(message.getSessionId());
    vo.setRole(message.getRole().name());
    vo.setContent(message.getContent());
    vo.setIsStreaming(message.getIsStreaming());
    vo.setFeedback(message.getFeedback());
    
    if (message.getCreatedDate() != null) {
      vo.setCreatedDate(message.getCreatedDate());
    }
    
    // 转换附件
    if (message.getAttachments() != null && !message.getAttachments().isEmpty()) {
      vo.setAttachments(message.getAttachments().stream()
          .map(MessageAssembler::toAttachmentVo)
          .collect(Collectors.toList()));
    }
    
    // 转换使用情况
    if (message.getUsage() != null) {
      MessageVo.MessageUsageVo usageVo = new MessageVo.MessageUsageVo();
      CoreUtils.copyProperties(message.getUsage(), usageVo);
      vo.setUsage(usageVo);
    }
    
    return vo;
  }

  /**
   * MessageAttachment -> AttachmentVo
   */
  private static MessageVo.AttachmentVo toAttachmentVo(
      cloud.xcan.angus.core.ai.domain.chat.MessageAttachment attachment) {
    if (attachment == null) {
      return null;
    }
    
    MessageVo.AttachmentVo vo = new MessageVo.AttachmentVo();
    vo.setId(attachment.getId());
    vo.setName(attachment.getName());
    vo.setType(attachment.getType());
    vo.setUrl(attachment.getUrl());
    vo.setSize(attachment.getSize());
    return vo;
  }

  /**
   * MessageFindDto -> GenericSpecification
   */
  public static GenericSpecification<Message> getSpecification(MessageFindDto dto, Long sessionId) {
    GenericSpecification<Message> spec = new GenericSpecification<>();
    
    spec.add(new SearchCriteria("sessionId", ":", sessionId));
    
    if (StringUtils.hasText(dto.getKeyword())) {
      spec.add(new SearchCriteria("content", "~", dto.getKeyword()));
    }
    
    return spec;
  }
}
