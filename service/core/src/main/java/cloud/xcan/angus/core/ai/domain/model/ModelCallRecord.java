package cloud.xcan.angus.core.ai.domain.model;

import static cloud.xcan.angus.spec.SpecConstant.DateFormat.DATE_FMT;

import cloud.xcan.angus.spec.experimental.EntitySupport;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 模型调用事件记录：一条记录对应一次模型调用，用于统计ModelStats。
 */
@Entity
@Table(name = "ai_model_call_record")
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
@Accessors(chain = true)
@Schema(description = "模型调用事件记录")
public class ModelCallRecord extends EntitySupport<ModelCallRecord, Long> {

  @Id
  private Long id;

  @Column(name = "model_id", nullable = false)
  private Long modelId;

  @Column(name = "success", nullable = false)
  private Boolean success = true;

  @Column(name = "tokens")
  private Long tokens = 0L;

  @Column(name = "cost")
  private Double cost = 0.0;

  @Column(name = "response_time_ms")
  private Double responseTimeMs = 0.0;

  @Column(name = "error_message")
  private String errorMessage;

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

