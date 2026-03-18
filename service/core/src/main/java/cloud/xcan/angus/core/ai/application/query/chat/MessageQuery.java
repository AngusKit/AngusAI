package cloud.xcan.angus.core.ai.application.query.chat;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.UsageTrend;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * 消息查询接口
 */
public interface MessageQuery {

  /**
   * 根据条件查询消息（支持分页、筛选）
   */
  Page<Message> find(GenericSpecification<Message> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据ID查找消息
   */
  Message findById(Long id);

  /**
   * 根据ID查找并检查消息是否存在
   */
  Message findAndCheck(Long id);

  /**
   * 查询正在流式生成的消息
   */
  List<Message> findStreamingMessages(String sessionId);

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

  /**
   * 批量获取各会话的最后一条消息（按 sessionId UUID）
   *
   * @param sessionIds 会话ID(UUID)列表
   * @return sessionId -> Message，仅包含有消息的会话
   */
  Map<String, Message> findLastMessageMapBySessionIds(List<String> sessionIds);

  /**
   * 统计进行中对话数量：当前有消息正在流式生成的会话数
   */
  long countActiveConversations();
}
