package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.spec.experimental.EntitySupport;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * 模型调用事件记录：一条记录对应一次模型调用，用于统计ModelStats。
 */
@Entity
@Table(name = "model_call_record")
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
@Accessors(chain = true)
@Schema(description = "模型调用事件记录")
public class ModelCallRecord extends EntitySupport<ModelCallRecord, Long> {

  @Id
  private Long id;

  @Schema(description = "模型ID")
  @Column(name = "model_id", nullable = false)
  private Long modelId;

  @Schema(description = "调用是否成功")
  @Column(name = "success", nullable = false)
  private Boolean success = true;

  @Schema(description = "本次调用消耗的tokens总数")
  @Column(name = "tokens")
  private Long tokens = 0L;

  @Schema(description = "本次调用的成本（货币单位由业务侧定义）")
  @Column(name = "cost")
  private Double cost = 0.0;

  @Schema(description = "响应时间（毫秒）")
  @Column(name = "response_time_ms")
  private Double responseTimeMs = 0.0;

  @Schema(description = "失败时的简要错误信息")
  @Column(name = "error_message")
  private String errorMessage;

  @Override
  public Long identity() {
    return id;
  }
}

