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
   * 批量查询多个会话各自的最后一条消息（一次 SQL，使用窗口函数）
   */
  @Query(
      value =
          "SELECT t.id, t.session_id, t.session_id_uuid, t.parent_message_id, t.role, t.content,"
              + " t.attachments, t.usage, t.is_streaming, t.feedback_type, t.feedback_comment,"
              + " t.tenant_id, t.created_by, t.modified_by, t.created_date, t.modified_date"
              + " FROM ("
              + "   SELECT m.*, ROW_NUMBER() OVER (PARTITION BY m.session_id_uuid ORDER BY m.created_date DESC, m.id DESC) AS rn"
              + "   FROM ai_chat_message m"
              + "   WHERE m.session_id_uuid IN (:sessionIds)"
              + " ) t WHERE t.rn = 1",
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
