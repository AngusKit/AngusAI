package cloud.xcan.angus.core.ai.interfaces.chat.facade;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionStarDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionSwitchAgentDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionSwitchAppDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionSwitchModelDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.SessionUpdateDto;
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
  SessionDetailVo updateSession(String sessionId, SessionUpdateDto dto);

  /**
   * 切换应用
   */
  SessionDetailVo switchApp(String sessionId, SessionSwitchAppDto dto);

  /**
   * 切换模型
   */
  SessionDetailVo switchModel(String sessionId, SessionSwitchModelDto dto);

  /**
   * 切换智能体（需验证智能体已绑定到会话当前应用）
   */
  SessionDetailVo switchAgent(String sessionId, SessionSwitchAgentDto dto);

  /**
   * 收藏/取消收藏会话
   */
  SessionDetailVo starSession(String sessionId, SessionStarDto dto);

  /**
   * 删除会话
   */
  void deleteSession(String sessionId);

  /**
   * 批量删除会话
   */
  Integer batchDeleteSessions(SessionBatchDeleteDto dto);

  /**
   * 获取会话详情
   */
  SessionDetailVo getSessionDetail(String sessionId);

  /**
   * 获取会话列表
   */
  PageResult<SessionListVo> listSessions(SessionFindDto dto);
}
