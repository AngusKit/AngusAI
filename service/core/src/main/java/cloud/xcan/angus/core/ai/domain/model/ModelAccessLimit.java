package cloud.xcan.angus.core.ai.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Data;

@Data
@Schema(description = "模型访问限制配置")
public class ModelAccessLimit {

  @Schema(description = "每秒请求数上限（RPS）")
  @Column(name = "rate_limit")
  private Integer rateLimit;

  @Schema(description = "每日请求总量上限")
  @Column(name = "daily_limit")
  private Integer dailyLimit;

  @Schema(description = "最大并发数")
  @Column(name = "max_concurrent")
  private Integer maxConcurrent;

}
