package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class SessionAssembler {

  public static Session toDomain(SessionCreateDto dto) {
    Session session = new Session();
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());

    // 设置配置
    session.setConfig(nullSafe(dto.getConfig(), new SessionConfig()));

    // 初始化计数和标志
    session.setMessageCount(0);
    session.setIsStarred(false);
    session.setIsPinned(false);
    session.setIsArchived(false);
    return session;
  }

  public static Session updateDomain(Long id, SessionUpdateDto dto) {
    Session session = new Session();
    session.setId(id);
    session.setTitle(dto.getTitle());
    session.setConfig(dto.getConfig());
    return session;
  }

  public static SessionDetailVo toDetailVo(Session session) {
    if (session == null) {
      return null;
    }

    SessionDetailVo vo = new SessionDetailVo();
    vo.setId(session.identity());
    vo.setSessionId(session.getSessionId());
    vo.setTitle(session.getTitle());
    vo.setAppId(session.getAppId());
    vo.setModelId(session.getModelId());
    vo.setMessageCount(session.getMessageCount());
    vo.setIsStarred(session.getIsStarred());
    vo.setIsArchived(session.getIsArchived());
    vo.setIsPinned(session.getIsPinned());

    // 设置配置参数
    vo.setConfig(session.getConfig());

    // 最后一条消息
    if (session.getLastMessage() != null) {
      SessionListVo.LastMessage lastMessage = new SessionListVo.LastMessage();
      lastMessage.setContent(session.getLastMessage().getContent());
      lastMessage.setRole(session.getLastMessage().getRole());
      lastMessage.setDatetime(session.getLastMessage().getCreatedDate());
      vo.setLastMessage(lastMessage);
    }

    // 设置审计字段
    vo.setCreatedBy(session.getCreatedBy());
    vo.setCreatedDate(session.getCreatedDate());
    vo.setModifiedBy(session.getModifiedBy());
    vo.setModifiedDate(session.getModifiedDate());

    return vo;
  }

  public static SessionListVo toListVo(Session session) {
    if (session == null) {
      return null;
    }

    SessionListVo vo = new SessionListVo();
    vo.setId(session.identity());
    vo.setSessionId(session.getSessionId());
    vo.setTitle(session.getTitle());
    vo.setAppId(session.getAppId());
    vo.setModelId(session.getModelId());
    vo.setMessageCount(session.getMessageCount());
    vo.setIsStarred(session.getIsStarred());
    vo.setIsArchived(session.getIsArchived());
    vo.setIsPinned(session.getIsPinned());

    // 设置配置参数
    vo.setConfig(session.getConfig());

    // 最后一条消息
    if (session.getLastMessage() != null) {
      SessionListVo.LastMessage lastMessage = new SessionListVo.LastMessage();
      lastMessage.setContent(session.getLastMessage().getContent());
      lastMessage.setRole(session.getLastMessage().getRole());
      lastMessage.setDatetime(session.getLastMessage().getCreatedDate());
      vo.setLastMessage(lastMessage);
    }

    // 设置审计字段
    vo.setCreatedBy(session.getCreatedBy());
    vo.setCreatedDate(session.getCreatedDate());
    vo.setModifiedBy(session.getModifiedBy());
    vo.setModifiedDate(session.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<Session> getSpecification(SessionFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "title", "createdDate", "modifiedDate")
        .matchSearchFields("title")
        .build();
    return new GenericSpecification<>(filters);
  }

}
