package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.infra.jpa.common.TenantAuditingEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 附件实体
 */
@Getter
@Setter
@Entity
@Table(name = "chat_attachment")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Attachment extends TenantAuditingEntity<Long> {

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

  /**
   * 上传时间戳
   */
  @Column(nullable = false)
  private Long uploadedAt;
}
