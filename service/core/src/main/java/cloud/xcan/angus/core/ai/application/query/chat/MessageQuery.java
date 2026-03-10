package cloud.xcan.angus.core.ai.application.query.chat;

import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.UsageTrend;
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
   * 根据会话ID(UUID)分页查询消息
   */
  Page<Message> findBySessionId(String sessionId, PageRequest pageable);

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
}
