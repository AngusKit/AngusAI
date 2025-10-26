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

  /**
   * 会话标题
   */
  @Column(nullable = false, length = 200)
  private String title;

  /**
   * 关联的应用ID
   */
  @Column(nullable = false)
  private Long appId;

  /**
   * 使用的模型ID
   */
  @Column(nullable = false)
  private Long modelId;

  /**
   * 会话配置
   */
  @Type(JsonType.class)
  @Column(columnDefinition = "json", length = 2000)
  private SessionConfig config;

  /**
   * 消息总数
   */
  @Column(nullable = false)
  private Integer messageCount = 0;

  /**
   * 是否已归档
   */
  @Column(nullable = false)
  private Boolean isArchived = false;

  /**
   * 是否置顶
   */
  @Column(nullable = false)
  private Boolean isPinned = false;

  /**
   * 是否收藏（星标） TODO 一对多，需建立子表
   */
  @Column(nullable = false)
  private Boolean isStarred = false;

  /**
   * 最后一条消息内容摘要
   */
  @Column(length = 60000, columnDefinition = "MEDIUMTEXT")
  private String lastMessageContent;

  /**
   * 最后一条消息角色
   */
  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private MessageRole lastMessageRole;

  /**
   * 最后消息时间
   */
  @Column
  private Long lastMessageTime;

  @Override
  public Long identity() {
    return id;
  }
}
