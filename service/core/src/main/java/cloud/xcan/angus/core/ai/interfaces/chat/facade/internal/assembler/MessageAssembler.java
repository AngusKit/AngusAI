package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class MessageAssembler {

  public static MessageVo toMessageVo(Message message) {
    if (message == null) {
      return null;
    }

    MessageVo vo = new MessageVo();
    vo.setId(message.identity());
    vo.setSessionId(message.getSessionId());
    vo.setSessionEntityId(message.getSessionEntityId());
    vo.setAppId(message.getAppId());
    vo.setAgentId(message.getAgentId());
    vo.setModelId(message.getModelId());
    vo.setRole(message.getRole());
    vo.setContent(message.getContent());
    vo.setAttachments(message.getAttachments());
    vo.setUsage(message.getUsage());
    vo.setIsStreaming(message.getIsStreaming());
    vo.setDatetime(message.getCreatedDate());
    vo.setFeedbackType(message.getFeedbackType());
    vo.setFeedbackComment(message.getFeedbackComment());

    // 设置审计字段
    vo.setCreatedBy(message.getCreatedBy());
    vo.setCreatedDate(message.getCreatedDate());
    vo.setModifiedBy(message.getModifiedBy());
    vo.setModifiedDate(message.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<Message> getSpecification(MessageFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "sessionId", "role", "createdDate", "modifiedDate")
        .inAndNotFields("sessionId", "role", "isStreaming", "feedbackType")
        .matchSearchFields("content", "feedbackComment")
        .build();
    return new GenericSpecification<>(filters);
  }

}
