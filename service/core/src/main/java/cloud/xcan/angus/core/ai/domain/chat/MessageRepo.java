package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 消息仓储接口
 */
@NoRepositoryBean
public interface MessageRepo extends BaseRepository<Message, Long> {

  /**
   * 统计创建时间在指定范围内的消息数
   */
  long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 根据会话ID(UUID)和角色查询消息
   */
  List<Message> findBySessionIdAndRole(String sessionId, MessageRole role);

  /**
   * 查询正在流式生成的消息（按会话ID UUID）
   */
  List<Message> findBySessionIdAndIsStreamingTrue(String sessionId);

  /**
   * 根据父消息ID查询子消息
   */
  List<Message> findByParentMessageId(Long parentMessageId);

  /**
   * 根据会话ID(UUID)统计消息数量
   */
  long countBySessionId(String sessionId);

  /**
   * 根据会话ID(UUID)查询消息列表
   */
  List<Message> findBySessionIdOrderByCreatedDateAsc(String sessionId);

  /**
   * 根据会话ID(UUID)分页查询消息
   */
  Page<Message> findBySessionIdOrderByCreatedDateDesc(String sessionId, Pageable pageable);

  /**
   * 查询会话的最后一条消息（按会话ID UUID）
   */
  Message findFirstBySessionIdOrderByCreatedDateDesc(String sessionId);

  /**
   * 根据会话实体ID删除消息
   */
  @Modifying
  int deleteBySessionEntityId(Long sessionEntityId);

  /**
   * 批量删除会话的所有消息
   */
  @Modifying
  int deleteBySessionEntityIdIn(List<Long> ids);
}
