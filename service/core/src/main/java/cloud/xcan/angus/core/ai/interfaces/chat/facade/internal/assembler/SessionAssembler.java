package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.search.SearchCriteria;
import org.springframework.util.StringUtils;

/**
 * Session转换器
 */
public class SessionAssembler {

  /**
   * SessionCreateDto -> Session
   */
  public static Session toDomain(SessionCreateDto dto) {
    Session session = new Session();
    session.setTitle(dto.getTitle() != null ? dto.getTitle() : "新对话");
    session.setAppId(dto.getAppId());
    session.setModelId(dto.getModelId());
    
    // 设置配置
    if (dto.getConfig() != null) {
      SessionConfig config = new SessionConfig();
      CoreUtils.copyProperties(dto.getConfig(), config);
      session.setConfig(config);
    } else {
      session.setConfig(new SessionConfig());
    }
    
    // 初始化计数和标志
    session.setMessageCount(0);
    session.setIsArchived(false);
    session.setIsPinned(false);
    session.setIsStarred(false);
    
    return session;
  }

  /**
   * SessionUpdateDto -> Session (更新)
   */
  public static Session updateDomain(Long id, SessionUpdateDto dto) {
    Session session = new Session();
    // Note: Session实体使用BaseEntity,可能没有setId方法
    // 在实际使用中,通过sessionCmd.update()时会先查询现有session
    
    if (dto.getTitle() != null) {
      session.setTitle(dto.getTitle());
    }
    if (dto.getIsPinned() != null) {
      session.setIsPinned(dto.getIsPinned());
    }
    if (dto.getIsArchived() != null) {
      session.setIsArchived(dto.getIsArchived());
    }
    if (dto.getConfig() != null) {
      SessionConfig config = new SessionConfig();
      CoreUtils.copyProperties(dto.getConfig(), config);
      session.setConfig(config);
    }
    
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
      vo.setCreatedDate(session.getCreatedDate());
    }
    if (session.getLastModifiedBy() != null) {
      vo.setLastModifiedBy(session.getLastModifiedBy());
    }
    if (session.getLastModifiedDate() != null) {
      vo.setLastModifiedDate(session.getLastModifiedDate());
    }
    
    // 转换配置
    if (session.getConfig() != null) {
      SessionDetailVo.SessionConfigVo configVo = new SessionDetailVo.SessionConfigVo();
      CoreUtils.copyProperties(session.getConfig(), configVo);
      vo.setConfig(configVo);
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
      vo.setCreatedDate(session.getCreatedDate());
    }
    if (session.getLastModifiedDate() != null) {
      vo.setLastModifiedDate(session.getLastModifiedDate());
    }
    
    // 最后一条消息
    if (StringUtils.hasText(session.getLastMessageContent())) {
      SessionListVo.LastMessage lastMessage = new SessionListVo.LastMessage();
      lastMessage.setContent(session.getLastMessageContent());
      lastMessage.setRole(session.getLastMessageRole());
      if (session.getLastMessageTime() != null) {
        lastMessage.setTime(session.getLastMessageTime());
      }
      vo.setLastMessage(lastMessage);
    }
    
    return vo;
  }

  /**
   * SessionFindDto -> GenericSpecification
   */
  public static GenericSpecification<Session> getSpecification(SessionFindDto dto) {
    GenericSpecification<Session> spec = new GenericSpecification<>();
    
    if (dto.getAppId() != null) {
      spec.add(new SearchCriteria("appId", ":", dto.getAppId()));
    }
    if (dto.getIsStarred() != null) {
      spec.add(new SearchCriteria("isStarred", ":", dto.getIsStarred()));
    }
    if (dto.getIsPinned() != null) {
      spec.add(new SearchCriteria("isPinned", ":", dto.getIsPinned()));
    }
    if (dto.getIsArchived() != null) {
      spec.add(new SearchCriteria("isArchived", ":", dto.getIsArchived()));
    }
    if (StringUtils.hasText(dto.getKeyword())) {
      spec.add(new SearchCriteria("title", "~", dto.getKeyword()));
    }
    
    return spec;
  }
}
