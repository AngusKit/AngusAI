package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

/**
 * 对话会话实体
 */
@Getter
@Setter
@Entity
@Table(name = "chat_session")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Session extends TenantAuditingEntity<Session, Long> {

  @Id
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(name = "app_id", nullable = false)
  private Long appId;

  @Column(name = "model_id", nullable = false)
  private Long modelId;

  @Type(JsonType.class)
  @Column(name = "config", columnDefinition = "json", length = 2000)
  private SessionConfig config;

  @Column(name = "is_starred", nullable = false)
  private Boolean isStarred = false;

  @Column(name = "message_count", nullable = false)
  private Integer messageCount = 0;

  /**
   * 最后一条消息内容摘要
   */
  @Column(name = "last_message_content", length = 60000, columnDefinition = "MEDIUMTEXT")
  private String lastMessageContent;

  /**
   * 最后一条消息角色
   */
  @Enumerated(EnumType.STRING)
  @Column(name = "last_message_role", length = 20)
  private MessageRole lastMessageRole;

  /**
   * 最后消息时间
   */
  @Column(name = "last_message_time")
  private Long lastMessageTime;

  @Override
  public Long identity() {
    return id;
  }
}
