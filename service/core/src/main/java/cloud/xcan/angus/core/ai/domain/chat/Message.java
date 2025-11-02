package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

/**
 * 对话消息实体
 */
@Getter
@Setter
@Entity
@Table(name = "chat_message")
public class Message extends TenantAuditingEntity<Message, Long> {

  @Id
  private Long id;

  /**
   * 所属会话ID
   */
  @Column(name = "session_id", nullable = false)
  private Long sessionId;

  /**
   * 父消息ID（用于重新生成）
   */
  @Column(name = "parent_message_id")
  private Long parentMessageId;

  /**
   * 消息角色
   */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MessageRole role;

  /**
   * 消息内容
   */
  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  /**
   * 附件列表
   */
  @Type(JsonType.class)
  @Column(name = "attachments", columnDefinition = "json")
  private List<MessageAttachment> attachments;

  /**
   * 使用统计（仅AI消息）
   */
  @Type(JsonType.class)
  @Column(columnDefinition = "json")
  private MessageUsage usage;

  /**
   * 是否正在流式生成
   */
  @Column(name = "is_streaming")
  private Boolean isStreaming = false;

  /**
   * 反馈类型：like/dislike
   */
  @Column(name = "feedback_type", length = 20)
  private String feedbackType;

  /**
   * 反馈说明
   */
  @Column(name = "feedback_comment", length = 500)
  private String feedbackComment;

  @Override
  public Long identity() {
    return id;
  }
}
