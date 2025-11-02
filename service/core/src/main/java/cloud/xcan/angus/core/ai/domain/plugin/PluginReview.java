package cloud.xcan.angus.core.ai.domain.plugin;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;

import cloud.xcan.angus.spec.experimental.EntitySupport;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 插件评价记录
 */
@Entity
@Table(name = "plugin_review")
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
@Accessors(chain = true)
public class PluginReview extends EntitySupport<PluginReview, Long> {

  @Id
  private Long id;

  @Column(name = "plugin_id", nullable = false)
  private Long pluginId;

  @Column(name = "rating", nullable = false)
  private Integer rating; // 1-5 星

  @Column(name = "content", length = 200)
  private String content; // 评价内容

  @CreatedDate
  @DateTimeFormat(pattern = DATE_FMT)
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
