package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.SessionFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionStarDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionSwitchAppDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionSwitchModelDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler.SessionAssembler;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * Session Facade实现
 */
@Component
public class SessionFacadeImpl implements SessionFacade {

  @Resource
  private SessionCmd sessionCmd;

  @Resource
  private SessionQuery sessionQuery;

  @Resource
  private MessageQuery messageQuery;

  @Override
  public SessionDetailVo createSession(SessionCreateDto dto) {
    Session saved = sessionCmd.create(SessionAssembler.toDomain(dto));
    return SessionAssembler.toDetailVo(saved);
  }

  @Override
  public SessionDetailVo updateSession(String sessionId, SessionUpdateDto dto) {
    Session existing = sessionQuery.findAndCheckBySessionId(sessionId);
    Session updated = SessionAssembler.updateDomain(existing.getId(), dto);
    Session session = sessionCmd.update(updated);
    setLastMessage(List.of(session));
    return SessionAssembler.toDetailVo(session);
  }

  @Override
  public SessionDetailVo switchApp(String sessionId, SessionSwitchAppDto dto) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    sessionCmd.switchApp(session.getId(), dto.getAppId());
    setLastMessage(List.of(session));
    return SessionAssembler.toDetailVo(sessionQuery.findAndCheck(session.getId()));
  }

  @Override
  public SessionDetailVo switchModel(String sessionId, SessionSwitchModelDto dto) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    sessionCmd.switchModel(session.getId(), dto.getModelId());
    setLastMessage(List.of(session));
    return SessionAssembler.toDetailVo(sessionQuery.findAndCheck(session.getId()));
  }

  @Override
  public SessionDetailVo starSession(String sessionId, SessionStarDto dto) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    sessionCmd.star(session.getId(), dto.getIsStarred());
    setLastMessage(List.of(session));
    return SessionAssembler.toDetailVo(sessionQuery.findAndCheck(session.getId()));
  }

  @Override
  public void deleteSession(String sessionId) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    sessionCmd.delete(session.getId());
  }

  @Override
  public Integer batchDeleteSessions(SessionBatchDeleteDto dto) {
    List<Session> sessions = sessionQuery.findBySessionIdIn(dto.getSessionIds());
    List<Long> ids = sessions.stream().map(Session::getId).toList();
    return sessionCmd.batchDelete(ids);
  }

  @NameJoin
  @Override
  public SessionDetailVo getSessionDetail(String sessionId) {
    Session session = sessionQuery.findAndCheckBySessionId(sessionId);
    setLastMessage(List.of(session));
    return SessionAssembler.toDetailVo(session);
  }

  @NameJoin
  @Override
  public PageResult<SessionListVo> listSessions(SessionFindDto dto) {
    GenericSpecification<Session> spec = SessionAssembler.getSpecification(dto);
    Page<Session> page = sessionQuery.find(spec, dto.tranPage(), dto.fullTextSearch,
        getMatchSearchFields(dto.getClass()));
    setLastMessage(page.getContent());
    return buildVoPageResult(page, SessionAssembler::toListVo);
  }

  private void setLastMessage(List<Session> sessions) {
    if (isNotEmpty(sessions)) {
      List<String> sessionIds = sessions.stream()
          .map(Session::getSessionId)
          .filter(id -> id != null && !id.isBlank())
          .toList();
      Map<String, Message> lastMessageMap = messageQuery.findLastMessageMapBySessionIds(sessionIds);
      for (Session session : sessions) {
        if (session.getSessionId() != null) {
          session.setLastMessage(lastMessageMap.get(session.getSessionId()));
        }
      }
    }
  }
}
