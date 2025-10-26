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
import java.time.ZoneId;
import java.util.Date;
import org.springframework.util.StringUtils;

public class SessionAssembler {

  public static Session toDomain(SessionCreateDto dto) {
    Session session = new Session();
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());

    // 设置配置
    session.setConfig(nullSafe(dto.getConfig(), new SessionConfig()));

    // 初始化计数和标志
    session.setMessageCount(0);
    session.setIsArchived(false);
    session.setIsPinned(false);
    session.setIsStarred(false);
    return session;
  }

  public static Session updateDomain(Long id, SessionUpdateDto dto) {
    Session session = new Session();
    session.setId(id);
    session.setTitle(dto.getTitle());
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());
    session.setIsPinned(dto.getIsPinned());
    session.setIsArchived(dto.getIsArchived());
    session.setConfig(dto.getConfig());
    return session;
  }

  /**
   * Session -> SessionDetailVo
   */
  public static SessionDetailVo toDetailVo(Session session) {
    if (session == null) {
      return null;
    }

    SessionDetailVo vo = new SessionDetailVo();
    // Note: 这些getter方法由BaseEntity提供
    vo.setId(session.identity());
    vo.setTitle(session.getTitle());
    vo.setAppId(session.getAppId());
    vo.setModelId(session.getModelId());
    vo.setMessageCount(session.getMessageCount());
    vo.setIsArchived(session.getIsArchived());
    vo.setIsPinned(session.getIsPinned());
    vo.setIsStarred(session.getIsStarred());

    // 审计字段从TenantAuditingEntity继承
    if (session.getCreatedBy() != null) {
      vo.setCreatedBy(session.getCreatedBy());
    }
    if (session.getCreatedDate() != null) {
      vo.setCreatedDate(
          Date.from(session.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant()));
    }
    if (session.getLastModifiedDate() != null) {
      vo.setLastModifiedDate(
          Date.from(session.getLastModifiedDate().atZone(ZoneId.systemDefault()).toInstant()));
    }

    // 转换配置
    if (session.getConfig() != null) {
      vo.setConfig(session.getConfig());
    }
    return vo;
  }

  /**
   * Session -> SessionListVo
   */
  public static SessionListVo toListVo(Session session) {
    if (session == null) {
      return null;
    }

    SessionListVo vo = new SessionListVo();
    vo.setId(session.identity());
    vo.setTitle(session.getTitle());
    vo.setAppId(session.getAppId());
    vo.setModelId(session.getModelId());
    vo.setMessageCount(session.getMessageCount());
    vo.setIsArchived(session.getIsArchived());
    vo.setIsPinned(session.getIsPinned());
    vo.setIsStarred(session.getIsStarred());

    if (session.getCreatedDate() != null) {
      vo.setCreatedDate(
          Date.from(session.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant()));
    }
    if (session.getLastModifiedDate() != null) {
      vo.setLastModifiedDate(
          Date.from(session.getLastModifiedDate().atZone(ZoneId.systemDefault()).toInstant()));
    }

    // 最后一条消息
    if (StringUtils.hasText(session.getLastMessageContent())) {
      SessionListVo.LastMessage lastMessage = new SessionListVo.LastMessage();
      lastMessage.setContent(session.getLastMessageContent());
      lastMessage.setRole(session.getLastMessageRole());
      if (session.getLastMessageTime() != null) {
        lastMessage.setDatetime(session.getLastMessageTime());
      }
      vo.setLastMessage(lastMessage);
    }

    return vo;
  }

  /**
   * SessionFindDto -> GenericSpecification
   */
  public static GenericSpecification<Session> getSpecification(SessionFindDto dto) {
    // TODO: 实现查询条件构建
    // 由于SearchCriteria的使用方式复杂，暂时返回空的GenericSpecification
    // 在实际项目中，应该根据具体的查询需求来实现
    return new GenericSpecification<>();
  }

}
