package cloud.xcan.angus.core.ai.domain.chat;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;

import cloud.xcan.angus.spec.experimental.EntitySupport;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 附件实体
 */
@Getter
@Setter
@Entity
@Table(name = "ai_chat_attachment")
@EntityListeners(AuditingEntityListener.class)
public class Attachment extends EntitySupport<Attachment, Long> {

  @Id
  private Long id;

  /**
   * 关联会话ID（可选）
   */
  @Column
  private Long sessionId;

  /**
   * 文件名
   */
  @Column(nullable = false, length = 255)
  private String name;

  /**
   * MIME类型
   */
  @Column(nullable = false, length = 100)
  private String type;

  /**
   * 文件大小（字节）
   */
  @Column(nullable = false)
  private Long size;

  /**
   * 存储路径
   */
  @Column(nullable = false, length = 500)
  private String path;

  /**
   * 访问URL
   */
  @Column(nullable = false, length = 500)
  private String url;

  @CreatedDate
  @DateTimeFormat(pattern = DATE_FMT)
  //@Temporal(TemporalType.TIMESTAMP)
  @Column(name = "created_date", nullable = false, updatable = false, columnDefinition = "TIMESTAMP")
  protected LocalDateTime createdDate;

  @CreatedBy
  @Column(name = "created_by", nullable = false, updatable = false)
  protected Long createdBy;

  @Override
  public Long identity() {
    return id;
  }
}
