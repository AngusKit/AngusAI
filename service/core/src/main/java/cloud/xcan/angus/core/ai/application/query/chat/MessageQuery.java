package cloud.xcan.angus.core.ai.application.query.chat;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.UsageTrend;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * 消息查询接口
 */
public interface MessageQuery {

  /**
   * 根据ID查找消息
   */
  Message findById(Long id);

  /**
   * 根据ID查找并检查消息是否存在
   */
  Message findAndCheck(Long id);

  /**
   * 根据会话ID查询消息列表
   */
  List<Message> findBySessionId(Long sessionId);

  /**
   * 根据会话ID分页查询消息
   */
  Page<Message> findBySessionId(Long sessionId, PageRequest pageable);

  /**
   * 查询会话的最后一条消息
   */
  Message findLastMessageBySessionId(Long sessionId);

  /**
   * 统计会话的消息数量
   */
  long countBySessionId(Long sessionId);

  /**
   * 根据条件查询消息
   */
  Page<Message> find(GenericSpecification<Message> spec, PageRequest pageable);

  /**
   * 根据会话ID和角色查询消息
   */
  List<Message> findBySessionIdAndRole(Long sessionId, cloud.xcan.angus.core.ai.domain.chat.MessageRole role);

  /**
   * 查询正在流式生成的消息
   */
  List<Message> findStreamingMessages(Long sessionId);

  /**
   * 根据父消息ID查询子消息
   */
  List<Message> findByParentMessageId(Long parentMessageId);

  /**
   * 查询最近的消息历史（用于AI上下文）
   */
  List<Message> findRecentBySessionId(Long sessionId, int limit);

  /**
   * 更新消息内容
   */
  void updateContent(Long messageId, String content);

  /**
   * 获取使用趋势
   */
  List<UsageTrend> getUsageTrend(int days);

  /**
   * 统计所有消息数量
   */
  Long countAll();

  /**
   * 统计今日消息数量
   */
  Long countToday();
}
