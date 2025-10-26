package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.application.query.chat.SessionQuery;
import cloud.xcan.angus.core.ai.domain.chat.Session;
import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.SessionFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.*;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.internal.assembler.SessionAssembler;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

  @Override
  public SessionDetailVo createSession(SessionCreateDto dto) {
    Session saved = sessionCmd.create(SessionAssembler.toDomain(dto));
    return SessionAssembler.toDetailVo(saved);
  }

  @Override
  public SessionDetailVo updateSession(Long id, SessionUpdateDto dto) {
    Session session = sessionCmd.update(SessionAssembler.updateDomain(id, dto));
    return SessionAssembler.toDetailVo(session);
  }

  @Override
  public SessionDetailVo switchApp(Long sessionId, SessionSwitchAppDto dto) {
    sessionCmd.switchApp(sessionId, dto.getAppId());
    Session session = sessionQuery.findAndCheck(sessionId);
    return SessionAssembler.toDetailVo(session);
  }

  @Override
  public SessionDetailVo switchModel(Long sessionId, SessionSwitchModelDto dto) {
    sessionCmd.switchModel(sessionId, dto.getModelId());
    Session session = sessionQuery.findAndCheck(sessionId);
    return SessionAssembler.toDetailVo(session);
  }

  @Override
  public SessionDetailVo starSession(Long sessionId, SessionStarDto dto) {
    sessionCmd.star(sessionId, dto.getIsStarred());
    Session session = sessionQuery.findAndCheck(sessionId);
    return SessionAssembler.toDetailVo(session);
  }

  @Override
  public void deleteSession(Long id) {
    sessionCmd.delete(id);
  }

  @Override
  public Integer batchDeleteSessions(SessionBatchDeleteDto dto) {
    return sessionCmd.batchDelete(dto.getSessionIds());
  }

  @NameJoin
  @Override
  public SessionDetailVo getSessionDetail(Long id) {
    Session session = sessionQuery.findAndCheck(id);
    return SessionAssembler.toDetailVo(session);
  }

  @NameJoin
  @Override
  public PageResult<SessionListVo> listSessions(SessionFindDto dto) {
    GenericSpecification<Session> spec = SessionAssembler.getSpecification(dto);
    PageRequest pageRequest = PageRequest.of(dto.getPageNo() - 1, dto.getPageSize());
    Page<Session> page = sessionQuery.find(spec, pageRequest, false, null);
    return buildVoPageResult(page, SessionAssembler::toListVo);
  }
}
