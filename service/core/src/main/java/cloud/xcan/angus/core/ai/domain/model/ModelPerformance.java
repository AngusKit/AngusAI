package cloud.xcan.angus.core.ai.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "模型性能指标")
public class ModelPerformance {

  @Schema(description = "延迟（可读格式，如：120ms）")
  private String latency;

  @Schema(description = "延迟（毫秒）")
  private Double latencyMs;

  @Schema(description = "吞吐量（可读格式，如：100 req/s）")
  private String throughput;

  @Schema(description = "吞吐量原始值")
  private Double throughputRaw;

  @Schema(description = "准确率（可读格式，如：98%）")
  private String accuracy;

  @Schema(description = "准确率（百分比，0-100）")
  private Double accuracyPercent;

}
