package cloud.xcan.angus.core.ai.interfaces.chat.facade;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.*;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 会话Facade接口
 */
public interface SessionFacade {

  /**
   * 创建会话
   */
  SessionDetailVo createSession(SessionCreateDto dto);

  /**
   * 更新会话
   */
  SessionDetailVo updateSession(Long id, SessionUpdateDto dto);

  /**
   * 删除会话
   */
  void deleteSession(Long id);

  /**
   * 获取会话详情
   */
  SessionDetailVo getSessionDetail(Long id);

  /**
   * 获取会话列表
   */
  PageResult<SessionListVo> listSessions(SessionFindDto dto);

  /**
   * 切换应用
   */
  SessionDetailVo switchApp(Long sessionId, SessionSwitchAppDto dto);

  /**
   * 切换模型
   */
  SessionDetailVo switchModel(Long sessionId, SessionSwitchModelDto dto);

  /**
   * 收藏/取消收藏会话
   */
  SessionDetailVo starSession(Long sessionId, SessionStarDto dto);

  /**
   * 批量删除会话
   */
  Integer batchDeleteSessions(SessionBatchDeleteDto dto);

  /**
   * 应用提示词
   */
  String applyPrompt(Long sessionId, PromptApplyDto dto);
}
