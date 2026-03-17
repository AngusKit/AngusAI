package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

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
   * 查询正在流式生成的消息（按会话ID UUID）
   */
  List<Message> findBySessionIdAndIsStreamingTrue(String sessionId);

  /**
   * 统计进行中对话数量：当前有消息正在流式生成的会话数（is_streaming=true 的 distinct session）
   */
  @Query("SELECT COUNT(DISTINCT m.sessionId) FROM Message m WHERE m.isStreaming = true AND m.sessionId IS NOT NULL")
  long countActiveConversations();

  /**
   * 根据会话ID(UUID)分页查询消息
   */
  Page<Message> findBySessionIdOrderByCreatedDateAsc(String sessionId, Pageable pageable);

  /**
   * 批量查询多个会话各自的最后一条消息（一次 SQL，兼容 MySQL 5.7）
   */
  @Query(
      value =
          "SELECT m.id, m.session_id, m.session_id_uuid, m.parent_message_id, m.role, m.content,"
              + " m.attachments, m.usage, m.is_streaming, m.feedback_type, m.feedback_comment,"
              + " m.tenant_id, m.created_by, m.modified_by, m.created_date, m.modified_date"
              + " FROM ai_chat_message m"
              + " INNER JOIN ("
              + "   SELECT session_id_uuid, MAX(id) AS max_id"
              + "   FROM ai_chat_message"
              + "   WHERE session_id_uuid IN (:sessionIds)"
              + "   GROUP BY session_id_uuid"
              + " ) latest ON m.session_id_uuid = latest.session_id_uuid AND m.id = latest.max_id"
              + " WHERE m.session_id_uuid IN (:sessionIds)",
      nativeQuery = true)
  List<Message> findLastMessageBySessionIds(@Param("sessionIds") List<String> sessionIds);

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
