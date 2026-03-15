package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;

public class MessageAssembler {

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
    vo.setDatetime(message.getCreatedDate());
    vo.setFeedbackType(message.getFeedbackType());
    vo.setFeedbackComment(message.getFeedbackComment());
    return vo;
  }

}
