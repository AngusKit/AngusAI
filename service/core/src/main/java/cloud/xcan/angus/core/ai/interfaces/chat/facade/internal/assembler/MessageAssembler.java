package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageSendDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.search.SearchCriteria;
import org.springframework.util.StringUtils;

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
      message.setAttachments(dto.getAttachments());
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
    vo.setRole(message.getRole());
    vo.setContent(message.getContent());
    vo.setAttachments(message.getAttachments());
    vo.setUsage(message.getUsage());
    vo.setIsStreaming(message.getIsStreaming());

    if (message.getCreatedDate() != null) {
      vo.setDatetime(message.getCreatedDate().getTime());
    }

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
