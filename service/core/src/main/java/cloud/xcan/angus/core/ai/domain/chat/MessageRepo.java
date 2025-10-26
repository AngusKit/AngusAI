package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

/**
 * 消息仓储接口
 */
@NoRepositoryBean
public interface MessageRepo extends BaseRepository<Message, Long> {

  /**
   * 根据会话ID查询消息列表
   */
  List<Message> findBySessionIdOrderByCreatedDateAsc(Long sessionId);

  /**
   * 根据会话ID分页查询消息
   */
  Page<Message> findBySessionIdOrderByCreatedDateDesc(Long sessionId, Pageable pageable);

  /**
   * 统计会话的消息数量
   */
  long countBySessionId(Long sessionId);

  /**
   * 删除会话的所有消息
   */
  void deleteBySessionId(Long sessionId);

  /**
   * 查询会话的最后一条消息
   */
  Message findFirstBySessionIdOrderByCreatedDateDesc(Long sessionId);

  /**
   * 根据会话ID和角色查询消息
   */
  List<Message> findBySessionIdAndRole(Long sessionId, MessageRole role);

  /**
   * 查询正在流式生成的消息
   */
  List<Message> findBySessionIdAndIsStreamingTrue(Long sessionId);

  /**
   * 根据父消息ID查询子消息
   */
  List<Message> findByParentMessageId(Long parentMessageId);
}
