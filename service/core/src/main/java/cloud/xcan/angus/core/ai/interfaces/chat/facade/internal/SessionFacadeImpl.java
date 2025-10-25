package cloud.xcan.angus.core.ai.interfaces.chat.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.chat.SessionCmd;
import cloud.xcan.angus.core.ai.domain.chat.Session;
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
import org.springframework.stereotype.Component;

/**
 * Session Facade实现
 */
@Component
public class SessionFacadeImpl implements SessionFacade {

  @Resource
  private SessionCmd sessionCmd;

  // TODO: 需要注入 SessionQuery
  // @Resource
  // private SessionQuery sessionQuery;

  @Override
  public SessionDetailVo createSession(SessionCreateDto dto) {
    Session session = SessionAssembler.toDomain(dto);
    Session saved = sessionCmd.create(session);
    return SessionAssembler.toDetailVo(saved);
  }

  @Override
  public SessionDetailVo updateSession(Long id, SessionUpdateDto dto) {
    Session session = SessionAssembler.updateDomain(id, dto);
    Session saved = sessionCmd.update(session);
    return SessionAssembler.toDetailVo(saved);
  }

  @Override
  public void deleteSession(Long id) {
    sessionCmd.delete(id);
  }

  @NameJoin
  @Override
  public SessionDetailVo getSessionDetail(Long id) {
    // TODO: 使用SessionQuery查询
    // Session session = sessionQuery.findById(id);
    // return SessionAssembler.toDetailVo(session);
    return null;
  }

  @NameJoin
  @Override
  public PageResult<SessionListVo> listSessions(SessionFindDto dto) {
    // TODO: 使用SessionQuery查询
    // GenericSpecification<Session> spec = SessionAssembler.getSpecification(dto);
    // Page<Session> page = sessionQuery.find(spec, dto.tranPage(),
    //     dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    // return buildVoPageResult(page, SessionAssembler::toListVo);
    return new PageResult<>();
  }

  @Override
  public SessionDetailVo switchApp(Long sessionId, SessionSwitchAppDto dto) {
    sessionCmd.switchApp(sessionId, dto.getAppId());
    // TODO: 查询并返回更新后的session
    return null;
  }

  @Override
  public SessionDetailVo switchModel(Long sessionId, SessionSwitchModelDto dto) {
    sessionCmd.switchModel(sessionId, dto.getModelId());
    // TODO: 查询并返回更新后的session
    return null;
  }

  @Override
  public SessionDetailVo starSession(Long sessionId, SessionStarDto dto) {
    sessionCmd.star(sessionId, dto.getIsStarred());
    // TODO: 查询并返回更新后的session
    return null;
  }

  @Override
  public Integer batchDeleteSessions(SessionBatchDeleteDto dto) {
    return sessionCmd.batchDelete(dto.getSessionIds());
  }

  @Override
  public String applyPrompt(Long sessionId, PromptApplyDto dto) {
    // TODO: 实现提示词应用
    // 1. 从提示词库获取提示词模板
    // 2. 替换变量
    // 3. 返回渲染后的提示词
    return "渲染后的提示词内容";
  }
}
